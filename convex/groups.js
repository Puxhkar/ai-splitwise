import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const getGroupOrMembers = query({
  args: {
    groupId: v.optional(v.id("groups")), // Optional - if provided, will return details for just this group
  },
  handler: async (ctx, args) => {
    // Use centralized getCurrentUser function
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

    // Get all groups where the user is a member
    const allGroups = await ctx.db.query("groups").collect();
    const userGroups = allGroups.filter((group) =>
      group.members.some((member) => member.userId === currentUser._id)
    );

    // If a specific group ID is provided, only return details for that group
    if (args.groupId) {
      const selectedGroup = userGroups.find(
        (group) => group._id === args.groupId
      );

      if (!selectedGroup) {
        return {
          selectedGroup: null,
          groups: userGroups.map((group) => ({
            id: group._id,
            name: group.name,
            description: group.description,
            memberCount: group.members.length,
          })),
        };
      }

      // Get all user details for this group's members
      const memberDetails = await Promise.all(
        selectedGroup.members.map(async (member) => {
          const user = await ctx.db.get(member.userId);
          if (!user) return null;

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            role: member.role,
          };
        })
      );

      // Filter out any null values (in case a user was deleted)
      const validMembers = memberDetails.filter((member) => member !== null);

      // Return selected group with member details
      return {
        selectedGroup: {
          id: selectedGroup._id,
          name: selectedGroup.name,
          description: selectedGroup.description,
          createdBy: selectedGroup.createdBy,
          members: validMembers,
        },
        groups: userGroups.map((group) => ({
          id: group._id,
          name: group.name,
          description: group.description,
          memberCount: group.members.length,
        })),
      };
    } else {
      // Just return the list of groups without member details
      return {
        selectedGroup: null,
        groups: userGroups.map((group) => ({
          id: group._id,
          name: group.name,
          description: group.description,
          memberCount: group.members.length,
        })),
      };
    }
  },
});

// Get expenses for a specific group
export const getGroupExpenses = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, { groupId }) => {
    // Use centralized getCurrentUser function
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

    const group = await ctx.db.get(groupId);
    if (!group) return null;

    if (!group.members.some((m) => m.userId === currentUser._id))
      return null;

    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_group", (q) => q.eq("groupId", groupId))
      .collect();

    const settlements = await ctx.db
      .query("settlements")
      .withIndex("by_group", (q) => q.eq("groupId", groupId))
      .collect();

    /* ----------  member map ---------- */
    const memberDetailsRaw = await Promise.all(
      group.members.map(async (m) => {
        const u = await ctx.db.get(m.userId);
        if (!u) return null;
        return { id: u._id, name: u.name, imageUrl: u.imageUrl, role: m.role };
      })
    );
    const memberDetails = memberDetailsRaw.filter(Boolean);
    const ids = memberDetails.map((m) => m.id);

    /* ----------  ledgers ---------- */
    // total net balance (old behaviour)
    const totals = Object.fromEntries(ids.map((id) => [id, 0]));
    // pair‑wise ledger  debtor -> creditor -> amount
    const ledger = {};
    ids.forEach((a) => {
      ledger[a] = {};
      ids.forEach((b) => {
        if (a !== b) ledger[a][b] = 0;
      });
    });

    /* ----------  apply expenses ---------- */
    for (const exp of expenses) {
      const payer = exp.paidByUserId;
      if (totals[payer] === undefined) continue;

      for (const split of exp.splits) {
        if (split.userId === payer || split.paid) continue; // skip payer & settled
        const debtor = split.userId;
        const amt = split.amount;

        if (totals[debtor] === undefined) continue;

        totals[payer] += amt;
        totals[debtor] -= amt;

        ledger[debtor][payer] += amt; // debtor owes payer
      }
    }

    /* ----------  apply settlements ---------- */
    for (const s of settlements) {
      if (totals[s.paidByUserId] === undefined || totals[s.receivedByUserId] === undefined) continue;

      totals[s.paidByUserId] += s.amount;
      totals[s.receivedByUserId] -= s.amount;

      ledger[s.paidByUserId][s.receivedByUserId] -= s.amount; // they paid back
    }

    /* ----------  net the pair‑wise ledger ---------- */
    ids.forEach((a) => {
      ids.forEach((b) => {
        if (a >= b) return; // visit each unordered pair once
        const diff = ledger[a][b] - ledger[b][a];
        if (diff > 0) {
          ledger[a][b] = diff;
          ledger[b][a] = 0;
        } else if (diff < 0) {
          ledger[b][a] = -diff;
          ledger[a][b] = 0;
        } else {
          ledger[a][b] = ledger[b][a] = 0;
        }
      });
    });

    /* ----------  shape the response ---------- */
    const balances = memberDetails.map((m) => ({
      ...m,
      totalBalance: totals[m.id],
      owes: Object.entries(ledger[m.id])
        .filter(([, v]) => v > 0)
        .map(([to, amount]) => ({ to, amount })),
      owedBy: ids
        .filter((other) => ledger[other][m.id] > 0)
        .map((other) => ({ from: other, amount: ledger[other][m.id] })),
    }));

    const userLookupMap = {};
    memberDetails.forEach((member) => {
      userLookupMap[member.id] = member;
    });

    return {
      group: {
        id: group._id,
        name: group.name,
        description: group.description,
        inviteCode: group.inviteCode,
        createdBy: group.createdBy,
      },
      members: memberDetails,
      expenses,
      settlements,
      balances,
      userLookupMap,
    };
  },
});

export const deleteGroup = mutation({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    const group = await ctx.db.get(args.groupId);

    if (!group) {
      throw new Error("Group not found");
    }

    // Verify permission: Must be the creator, OR it's an old group (no createdBy) and user is a member
    if (group.createdBy) {
      if (group.createdBy !== user._id) {
        throw new Error("Only the creator can delete this group");
      }
    } else {
      const isMember = group.members.some(m => m.userId === user._id);
      if (!isMember) {
        throw new Error("You do not have permission to delete this group");
      }
    }

    // Delete all expenses in this group
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    for (const expense of expenses) {
      await ctx.db.delete(expense._id);
    }

    // Delete all settlements in this group
    const settlements = await ctx.db
      .query("settlements")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    for (const settlement of settlements) {
      await ctx.db.delete(settlement._id);
    }

    // Delete all messages in this group
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Finally delete the group
    await ctx.db.delete(args.groupId);

    return { success: true };
  }
});
