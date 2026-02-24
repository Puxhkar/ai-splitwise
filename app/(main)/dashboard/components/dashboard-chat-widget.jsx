"use client";

import { useState } from "react";
import { MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DashboardChatWidget({ groups }) {
    const [selectedGroup, setSelectedGroup] = useState("");
    const router = useRouter();

    const handleChatOpen = () => {
        if (selectedGroup) {
            router.push(`/groups/${selectedGroup}/chat`);
        }
    };

    if (!groups || groups.length === 0) {
        return (
            <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="bg-zinc-100 p-4 rounded-2xl mb-4">
                    <MessageCircle className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="font-bold text-lg text-zinc-900 mb-2">Live Chat with your Group</h3>
                <p className="text-zinc-500 font-medium text-sm max-w-xs mb-6 px-4">
                    Chat instantly with your homies. You haven't made any groups yet, please ask them to make a group first!
                </p>
                <Button onClick={() => router.push('/contacts?createGroup=true')} className="bg-zinc-900 text-white rounded-xl h-11 px-6 font-bold shadow-md hover:bg-zinc-800">
                    <Users className="w-4 h-4 mr-2" />
                    Make a Group First
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white border flex flex-col items-start border-zinc-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 w-full mb-6">
                <div className="bg-green-100 p-3 rounded-full shrink-0">
                    <MessageCircle className="w-5 h-5 text-green-700" />
                </div>
                <div className="w-full">
                    <h3 className="font-bold text-lg text-zinc-900">Live Team Chat</h3>
                    <p className="text-zinc-500 font-medium text-xs leading-relaxed">
                        Select a group directly from your dashboard to check messages.
                    </p>
                </div>
            </div>

            <div className="flex w-full flex-col sm:flex-row items-center gap-4">
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger className="w-full bg-zinc-50 border-zinc-200 shadow-sm rounded-xl h-12 uppercase tracking-widest text-xs font-bold text-zinc-700">
                        <SelectValue placeholder="SELECT A GROUP" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-zinc-200 bg-white">
                        {groups.map(g => (
                            <SelectItem key={g.id} value={g.id} className="font-bold cursor-pointer text-zinc-900">
                                {g.name} ({g.members.length} members)
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    onClick={handleChatOpen}
                    disabled={!selectedGroup}
                    className="w-full sm:w-auto shrink-0 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl h-12 px-6 shadow-md transition-all uppercase tracking-widest text-xs"
                >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Open Chat
                </Button>
            </div>
        </div>
    );
}
