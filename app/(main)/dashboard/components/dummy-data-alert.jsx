"use client";

import { useState } from "react";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { AlertCircle, UserPlus, FileSpreadsheet, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DummyDataAlert({ groupCount }) {
    const { mutate: seedDatabase } = useConvexMutation(api.seed.seedDatabase);
    const { mutate: clearDatabase } = useConvexMutation(api.seed.clearDatabase);
    const [isAdding, setIsAdding] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const router = useRouter();

    const handleClearData = async () => {
        setIsClearing(true);
        try {
            await clearDatabase();
            toast.success("Dashboard wiped! Time for a fresh start.");
            router.refresh();
        } catch (e) {
            toast.error("Failed to clear data");
            console.error(e);
        } finally {
            setIsClearing(false);
        }
    };

    // If they already have multiple groups, give them the option to wipe them.
    if (groupCount > 1) {
        return (
            <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-start gap-4 z-10">
                    <div className="bg-amber-100 p-3 rounded-full shrink-0">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-amber-900 mb-1">Start Your Real Journey</h3>
                        <p className="text-amber-800/80 font-medium text-sm leading-relaxed max-w-lg">
                            Ready to use Splitr for real? You can <strong className="text-amber-900">wipe all playground data</strong> and start fresh with a clean dashboard to invite your actual friends.
                        </p>
                    </div>
                </div>
                <Button
                    onClick={handleClearData}
                    disabled={isClearing}
                    variant="outline"
                    className="shrink-0 border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold rounded-xl h-12 px-6 shadow-sm transition-all z-10 w-full sm:w-auto"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isClearing ? "Wiping..." : "Reset Dashboard"}
                </Button>
            </div>
        );
    }

    const handleAddDummyData = async () => {
        setIsAdding(true);
        try {
            const res = await seedDatabase();
            if (res.skipped && res.reason === "Not enough users") {
                toast.error("Not enough users. (Backend needs at least 3 dummy users created via search first).");
            } else if (res.skipped) {
                toast.info("Database already contains demo data!");
            } else {
                toast.success("Dummy data added successfully!");
                router.refresh();
            }
        } catch (e) {
            toast.error("Failed to add dummy data");
            console.error(e);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-start gap-4 z-10">
                <div className="bg-blue-100 p-3 rounded-full shrink-0">
                    <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-blue-900 mb-1">Getting Started Guide</h3>
                    <p className="text-blue-800/80 font-medium text-sm leading-relaxed max-w-lg">
                        You need at least <strong className="text-blue-900">3 users</strong> to try splitting expenses and to make a group between you guys. If you don't have enough real users handy, you can <strong className="text-blue-900">generate dummy data</strong> to instantly try out the application!
                    </p>
                </div>
            </div>
            <Button
                onClick={handleAddDummyData}
                disabled={isAdding}
                className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-12 px-6 shadow-md transition-all z-10 w-full sm:w-auto"
            >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                {isAdding ? "Generating..." : "Add Some Dummy Data"}
            </Button>
        </div>
    );
}
