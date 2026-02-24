import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

// Send a message
export const sendMessage = mutation({
    args: {
        groupId: v.id("groups"),
        text: v.string(),
    },
    handler: async (ctx, args) => {
        // Check authentication
        const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

        // Verify user is in the group
        const group = await ctx.db.get(args.groupId);
        if (!group) throw new Error("Group not found");
        const isMember = group.members.some(
            (m) => m.userId === currentUser._id
        );
        if (!isMember) throw new Error("Not a member of this group");

        // Send the message
        await ctx.db.insert("messages", {
            groupId: args.groupId,
            senderId: currentUser._id,
            text: args.text,
            timestamp: Date.now(),
        });
    },
});

// Get messages for a group
export const getMessages = query({
    args: {
        groupId: v.id("groups"),
    },
    handler: async (ctx, args) => {
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
            .order("asc")
            .collect();

        // Fetch user details for each message
        const messagesWithUsers = await Promise.all(
            messages.map(async (msg) => {
                const user = await ctx.db.get(msg.senderId);
                return {
                    ...msg,
                    user: user
                        ? {
                            name: user.name,
                            imageUrl: user.imageUrl,
                        }
                        : null,
                };
            })
        );

        return messagesWithUsers;
    },
});
