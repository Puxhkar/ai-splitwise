import { query } from "./_generated/server";
import { internal } from "./_generated/api";

// Get user balances
export const getUserBalances = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { youOwe: 0, youAreOwed: 0, totalBalance: 0, oweDetails: { youOwe: [], youAreOwedBy: [] } };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) {
      return { youOwe: 0, youAreOwed: 0, totalBalance: 0, oweDetails: { youOwe: [], youAreOwedBy: [] } };
    }

    // Get current year start timestamp
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1).getTime();

    /* ───────────── 1‑to‑1 expenses (no groupId) for current year ───────────── */
    const expenses = (await ctx.db.query("expenses")
      .withIndex("by_date", (q) => q.gte("date", startOfYear))
      .collect()).filter(
        (e) =>
          !e.groupId && // 1‑to‑1 only
          (e.paidByUserId === user._id ||
            (e.splits && e.splits.some((s) => s.userId === user._id)))
      );

    /* tallies */
    let youOwe = 0;
    let youAreOwed = 0;
    const balanceByUser = {};

    for (const e of expenses) {
      const isPayer = e.paidByUserId === user._id;
      const mySplit = e.splits.find((s) => s.userId === user._id);

      if (isPayer) {
        for (const s of e.splits) {
          if (s.userId === user._id || s.paid) continue;
          youAreOwed += s.amount;
          (balanceByUser[s.userId] ??= { owed: 0, owing: 0 }).owed += s.amount;
        }
      } else if (mySplit && !mySplit.paid) {
        youOwe += mySplit.amount;
        (balanceByUser[e.paidByUserId] ??= { owed: 0, owing: 0 }).owing +=
          mySplit.amount;
      }
    }

    /* ───────────── 1‑to‑1 settlements (no groupId) ───────────── */
    const settlements = (await ctx.db.query("settlements").collect()).filter(
      (s) =>
        !s.groupId &&
        (s.paidByUserId === user._id || s.receivedByUserId === user._id)
    );

    for (const s of settlements) {
      if (s.paidByUserId === user._id) {
        youOwe -= s.amount;
        (balanceByUser[s.receivedByUserId] ??= { owed: 0, owing: 0 }).owing -=
          s.amount;
      } else {
        youAreOwed -= s.amount;
        (balanceByUser[s.paidByUserId] ??= { owed: 0, owing: 0 }).owed -=
          s.amount;
      }
    }

    /* build lists for UI */
    const youOweList = [];
    const youAreOwedByList = [];
    for (const [uid, { owed, owing }] of Object.entries(balanceByUser)) {
      const net = owed - owing;
      if (net === 0) continue;
      const counterpart = await ctx.db.get(uid);
      const base = {
        userId: uid,
        name: counterpart?.name ?? "Unknown",
        imageUrl: counterpart?.imageUrl,
        amount: Math.abs(net),
      };
      net > 0 ? youAreOwedByList.push(base) : youOweList.push(base);
    }

    youOweList.sort((a, b) => b.amount - a.amount);
    youAreOwedByList.sort((a, b) => b.amount - a.amount);

    return {
      youOwe,
      youAreOwed,
      totalBalance: youAreOwed - youOwe,
      oweDetails: { youOwe: youOweList, youAreOwedBy: youAreOwedByList },
    };
  },
});

// Get total spent in the current year
export const getTotalSpent = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) return 0;

    // Get start of current year timestamp
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1).getTime();

    // Get all expenses for the current year
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_date", (q) => q.gte("date", startOfYear))
      .collect();

    let totalSpent = 0;

    for (const expense of expenses) {
      if (!expense || !expense.splits || !Array.isArray(expense.splits)) continue;

      const userSplit = expense.splits.find((split) => split && split.userId === user._id);
      if (userSplit && typeof userSplit.amount === "number") {
        totalSpent += userSplit.amount;
      }
    }

    return parseFloat(totalSpent.toFixed(2));
  },
});

// Get monthly spending
export const getMonthlySpending = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) return [];

    // Get current year
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1).getTime();

    // Get all expenses for current year
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_date", (q) => q.gte("date", startOfYear))
      .collect();

    // Group expenses by month
    const monthlyTotals = new Map();

    // Initialize all months with zero
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(currentYear, i, 1).getTime();
      monthlyTotals.set(monthStart, 0);
    }

    for (const expense of expenses) {
      if (!expense || !expense.splits || !Array.isArray(expense.splits)) continue;

      const userSplit = expense.splits.find((split) => split && split.userId === user._id);
      if (userSplit && typeof userSplit.amount === "number") {
        const date = new Date(expense.date);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).getTime();

        const current = monthlyTotals.get(monthStart) || 0;
        monthlyTotals.set(monthStart, current + userSplit.amount);
      }
    }

    // Convert to array format
    const result = Array.from(monthlyTotals.entries()).map(([month, total]) => ({
      month,
      total: parseFloat(total.toFixed(2)),
    }));

    // Sort by month (ascending)
    result.sort((a, b) => a.month - b.month);

    return result;
  },
});

// Get groups for the current user
export const getUserGroups = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) return [];

    // Get all groups
    const allGroups = await ctx.db.query("groups").collect();

    // Filter for groups where the user is a member
    const groups = allGroups.filter((group) =>
      group.members.some((member) => member.userId === user._id)
    );

    // Calculate balances for each group
    const enhancedGroups = await Promise.all(
      groups.map(async (group) => {
        // Get all expenses for this group
        const expenses = await ctx.db
          .query("expenses")
          .withIndex("by_group", (q) => q.eq("groupId", group._id))
          .collect();

        let balance = 0;

        expenses.forEach((expense) => {
          if (expense.paidByUserId === user._id) {
            // User paid for others
            expense.splits.forEach((split) => {
              if (split.userId !== user._id && !split.paid) {
                balance += split.amount;
              }
            });
          } else {
            // User owes someone else
            const userSplit = expense.splits.find(
              (split) => split.userId === user._id
            );
            if (userSplit && !userSplit.paid) {
              balance -= userSplit.amount;
            }
          }
        });

        // Apply settlements
        const settlements = await ctx.db
          .query("settlements")
          .filter((q) =>
            q.and(
              q.eq(q.field("groupId"), group._id),
              q.or(
                q.eq(q.field("paidByUserId"), user._id),
                q.eq(q.field("receivedByUserId"), user._id)
              )
            )
          )
          .collect();

        settlements.forEach((settlement) => {
          if (settlement.paidByUserId === user._id) {
            // User paid someone
            balance += settlement.amount;
          } else {
            // Someone paid the user
            balance -= settlement.amount;
          }
        });

        return {
          ...group,
          id: group._id,
          balance,
        };
      })
    );

    return enhancedGroups;
  },
});

// Get report data for the current user
export const getReportData = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) return [];

    // Get all expenses user is involved in
    const allExpenses = await ctx.db.query("expenses").collect();
    const userExpenses = allExpenses.filter(
      (expense) =>
        expense.paidByUserId === user._id ||
        expense.splits.some((split) => split.userId === user._id)
    );

    const expensesWithDetails = await Promise.all(
      userExpenses.map(async (e) => {
        const payer = await ctx.db.get(e.paidByUserId);
        const mySplit = e.splits.find((s) => s.userId === user._id);
        const amount = mySplit ? mySplit.amount : 0;

        let type = "Involved";
        if (e.paidByUserId === user._id) type = "Paid";
        else if (mySplit && !mySplit.paid) type = "Owe";

        return {
          id: e._id,
          date: e.date,
          description: e.description,
          category: e.category,
          amount: e.amount,
          yourShare: amount,
          type,
          payerName: payer ? payer.name : "Unknown",
        };
      })
    );

    return expensesWithDetails.sort((a, b) => b.date - a.date);
  },
});

// Get category distribution for charts
export const getCategoryDistribution = query({
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return [];

      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier)
        )
        .first();

      if (!user) return [];

      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1).getTime();

      const expenses = await ctx.db
        .query("expenses")
        .withIndex("by_date", (q) => q.gte("date", startOfYear))
        .collect();

      const distribution = new Map();

      for (const expense of expenses) {
        if (!expense || !expense.splits || !Array.isArray(expense.splits)) continue;

        const userSplit = expense.splits.find((split) => split && split.userId === user._id);

        if (userSplit && typeof userSplit.amount === "number" && userSplit.amount > 0) {
          const category = expense.category || "Uncategorized";
          const current = distribution.get(category) || 0;
          distribution.set(category, current + userSplit.amount);
        }
      }

      return Array.from(distribution.entries()).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }));
    } catch (error) {
      console.error("Error in getCategoryDistribution:", error);
      return [];
    }
  },
});