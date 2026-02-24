"use client";

import { useState } from "react";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

const AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jocelyn",
];

export default function SettingsPage() {
    const { data: user, isLoading } = useConvexQuery(api.users.getCurrentUser);
    const updateProfile = useConvexMutation(api.users.updateProfile);

    const [name, setName] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [initialized, setInitialized] = useState(false);

    if (!isLoading && user && !initialized) {
        setName(user.name);
        setSelectedAvatar(user.imageUrl || AVATARS[0]);
        setInitialized(true);
    }

    const handleSave = async () => {
        try {
            await updateProfile.mutate({ name, imageUrl: selectedAvatar });
            toast.success("Profile updated successfully!");
        } catch (e) {
            toast.error("Failed to update profile.");
        }
    };

    if (isLoading) return <BarLoader width="100%" color="#18181b" />;

    return (
        <div className="container mx-auto py-12 max-w-2xl text-zinc-900 bg-white">
            <h1 className="text-4xl gradient-title font-black tracking-tight mb-4">Profile Settings</h1>
            <p className="text-zinc-500 mb-10 font-medium">Choose a built-in character avatar and set your display name.</p>

            <div className="space-y-8 bg-zinc-50 border border-zinc-200 p-10 rounded-3xl shadow-sm">
                {/* Current Avatar Preview */}
                <div className="flex items-center gap-6 pb-8 border-b border-zinc-200">
                    <img src={selectedAvatar} alt="Current Preview" className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-zinc-200" />
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900">{name || "Your Name"}</h2>
                        <p className="text-zinc-500 font-medium text-sm">This is how you appear in groups.</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-zinc-900 font-bold text-lg">Display Name</Label>
                    <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="bg-white border-zinc-300 h-14 text-zinc-900 font-medium rounded-xl shadow-sm"
                        placeholder="Your name"
                    />
                </div>

                <div className="space-y-6 pt-4">
                    <Label className="text-zinc-900 font-bold text-lg">Choose your Character</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                        {AVATARS.map((avatar) => (
                            <div
                                key={avatar}
                                onClick={() => setSelectedAvatar(avatar)}
                                className={`cursor-pointer rounded-2xl p-2 flex items-center justify-center border-2 transition-all hover:-translate-y-1 ₹{selectedAvatar === avatar ? "border-zinc-900 bg-zinc-100 shadow-md transform -translate-y-1" : "border-zinc-200 hover:border-zinc-400 bg-white"
                                    }`}
                            >
                                <img src={avatar} alt="Avatar" className="w-[60px] h-[60px] rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-8">
                    <Button onClick={handleSave} size="lg" className="w-full bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl h-14 text-lg font-bold shadow-md">
                        Save Profile
                    </Button>
                </div>
            </div>
        </div>
    );
}
