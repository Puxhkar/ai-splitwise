"use client";

import { useState, useRef, useEffect } from "react";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function GroupChat({ groupId }) {
    const { user } = useUser();
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef(null);

    const { data: messages = [], isLoading } = useConvexQuery(api.messages.getMessages, {
        groupId,
    });

    const sendMessage = useConvexMutation(api.messages.sendMessage);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await sendMessage.mutate({
                groupId,
                text: newMessage,
            });
            setNewMessage("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="flex flex-col h-[600px] border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 border-b">
                <h3 className="font-semibold leading-none tracking-tight">Live Chat</h3>
                <p className="text-sm text-muted-foreground">Discuss expenses with your group</p>
            </div>

            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center text-sm text-muted-foreground">Loading messages...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground">No messages yet. Start the conversation!</div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.user?.name === user?.fullName || msg.user?.name === user?.firstName || (user && user.id === msg.senderId); // simple fallback check
                            return (
                                <div key={msg._id} className={`flex gap-3 ₹{isMe ? "flex-row-reverse" : ""}`}>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={msg.user?.imageUrl} />
                                        <AvatarFallback>{msg.user?.name?.charAt(0) || "?"}</AvatarFallback>
                                    </Avatar>
                                    <div className={`flex flex-col ₹{isMe ? "items-end" : "items-start"}`}>
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-xs font-medium">{isMe ? "You" : msg.user?.name}</span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                                            </span>
                                        </div>
                                        <div className={`rounded-lg px-3 py-2 text-sm ₹{isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    );
}
