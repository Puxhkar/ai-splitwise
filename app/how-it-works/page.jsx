"use client";

import { STEPS } from "@/lib/landing";
import { Badge } from "@/components/ui/badge";

export default function HowItWorksPage() {
    return (
        <div className="container mx-auto px-4 py-20 min-h-screen pt-32">
            <div className="text-center mb-16">
                <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300">
                    How It Works
                </Badge>
                <h1 className="gradient-title mt-4 text-4xl md:text-6xl font-bold">
                    Splitting has never been simpler
                </h1>
                <p className="mx-auto mt-4 max-w-[700px] text-zinc-400 md:text-xl">
                    Follow these easy steps to completely automate your shared expense management.
                </p>
            </div>

            <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-3">
                {STEPS.map(({ label, title, description }) => (
                    <div key={label} className="flex flex-col items-center space-y-4 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-2xl font-bold text-zinc-200 border border-zinc-700">
                            {label}
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-100">{title}</h3>
                        <p className="text-zinc-400 text-lg leading-relaxed">{description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
