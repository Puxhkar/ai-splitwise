"use client";

import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { DashboardChatWidget } from "@/app/(main)/dashboard/components/dashboard-chat-widget";
import { Authenticated } from "convex/react";

export function LandingChatWidget() {
    return (
        <Authenticated>
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-6 text-center">Your Active Groups</h2>
                        <ChatWidgetLoader />
                    </div>
                </div>
            </section>
        </Authenticated>
    );
}

function ChatWidgetLoader() {
    // Try to safely fetch user groups
    const { data: groups, isLoading } = useConvexQuery(api.dashboard.getUserGroups);

    if (isLoading) return null;

    return <DashboardChatWidget groups={groups || []} />;
}
