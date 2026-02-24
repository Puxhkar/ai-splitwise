"use client";

import { FEATURES } from "@/lib/landing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FeaturesPage() {
    return (
        <div className="container mx-auto px-4 py-20 min-h-screen pt-32 bg-white">
            <div className="text-center mb-16">
                <Badge variant="outline" className="bg-zinc-50 border-zinc-200 text-zinc-600 px-4 py-1.5 shadow-sm text-xs font-semibold uppercase tracking-wider">
                    Core Features
                </Badge>
                <h1 className="gradient-title mt-4 text-4xl md:text-6xl font-black">
                    Everything you need to split expenses
                </h1>
                <p className="mx-auto mt-4 max-w-[700px] text-zinc-500 md:text-xl font-medium">
                    Our platform provides all the tools you need to handle shared
                    expenses with ease in a modern, professional, and bright environment.
                </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
                {FEATURES.map(({ title, Icon, bg, color, description }) => {
                    return (
                        <Card
                            key={title}
                            className="flex flex-col items-center space-y-4 p-8 text-center bg-zinc-50 border-zinc-200 shadow-sm"
                        >
                            <div className={`rounded-xl p-4 bg-white border border-zinc-100 shadow-sm`}>
                                <Icon className={`h-8 w-8 text-zinc-700`} />
                            </div>

                            <h3 className="text-xl font-bold text-zinc-900">{title}</h3>
                            <p className="text-zinc-500">{description}</p>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
