"use client";

import { useParams, useRouter } from "next/navigation";
import { GroupChat } from "@/components/group-chat";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { BarLoader } from "react-spinners";

export default function DedicatedGroupChatPage() {
    const params = useParams();
    const router = useRouter();

    const { data, isLoading } = useConvexQuery(api.groups.getGroupExpenses, {
        groupId: params.id,
    });

    if (isLoading) {
        return (
            <div className="container mx-auto py-12">
                <BarLoader width={"100%"} color="#18181b" />
            </div>
        );
    }

    const group = data?.group;

    return (
        <div className="container mx-auto py-8 max-w-4xl px-4">
            <div className="mb-6 flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium px-4 py-2"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Group
                </Button>
            </div>

            <div className="mb-8">
                <h1 className="text-4xl font-black text-zinc-950 tracking-tight">{group?.name} Live Chat</h1>
                <p className="text-zinc-500 font-medium text-lg">Discuss expenses, trips, and settle up in real-time.</p>
            </div>

            <div className="shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] bg-white rounded-[2rem] overflow-hidden border border-zinc-100">
                <GroupChat groupId={params.id} />
            </div>
        </div>
    );
}
