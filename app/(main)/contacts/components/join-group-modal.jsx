"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function JoinGroupModal({ isOpen, onClose, onSuccess }) {
    const [inviteCode, setInviteCode] = useState("");
    const [isJoining, setIsJoining] = useState(false);

    const joinGroup = useConvexMutation(api.contacts.joinGroup);

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!inviteCode.trim()) return;

        try {
            setIsJoining(true);
            const groupId = await joinGroup.mutate({ inviteCode });

            toast.success("Successfully joined the group!");
            setInviteCode("");
            if (onSuccess) onSuccess(groupId);
            onClose();
        } catch (error) {
            toast.error(error.message || "Failed to join group");
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleJoin}>
                    <DialogHeader>
                        <DialogTitle>Join a Group</DialogTitle>
                        <DialogDescription>
                            Enter the 6-character invite code shared by the group creator.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="inviteCode">Invite Code</Label>
                            <Input
                                id="inviteCode"
                                placeholder="e.g. A1B2C3"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                className="font-mono uppercase tracking-wider"
                                maxLength={6}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isJoining}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isJoining || inviteCode.length < 5}
                        >
                            {isJoining ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Joining...
                                </>
                            ) : (
                                "Join Group"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
