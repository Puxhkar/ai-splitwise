"use client";

import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function HelpPage() {
    return (
        <div className="container mx-auto px-4 py-20 min-h-screen pt-32 text-center text-zinc-900">
            <Badge variant="outline" className="bg-zinc-100 border-zinc-200 text-zinc-600 mb-6 font-bold uppercase tracking-widest text-xs">
                Help & Guides
            </Badge>

            <h1 className="gradient-title text-4xl md:text-6xl font-black mb-4 tracking-tight">
                How can we help you?
            </h1>
            <p className="mx-auto max-w-[700px] text-zinc-500 mb-12 font-medium bg-white">
                Find articles, guides, and tutorials on how to effectively use our premium expense splitting features.
            </p>

            <div className="relative mx-auto max-w-2xl mb-16">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                <Input
                    className="pl-14 bg-white border-zinc-300 h-16 text-lg text-zinc-900 placeholder-zinc-400 font-medium rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                    placeholder="Search for answers (e.g., 'how to add an expense')"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
                {[
                    { title: "Getting Started", desc: "Setting up your account and your very first splitting group." },
                    { title: "Adding Expenses", desc: "Step-by-step guide on unequal and equal bills logic." },
                    { title: "Live Chat", desc: "How to use real-time messaging within your groups to coordinate." },
                    { title: "Avatars & Profiles", desc: "Selecting your character avatars and customizing your profile." },
                    { title: "Account Settings", desc: "Managing notifications, passwords, and API limits." },
                    { title: "Troubleshooting", desc: "Common issues with real-time updates and group access." }
                ].map(item => (
                    <div key={item.title} className="p-8 bg-zinc-50 border border-zinc-200 rounded-3xl hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer">
                        <h3 className="font-bold text-lg mb-3 text-zinc-900">{item.title}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
