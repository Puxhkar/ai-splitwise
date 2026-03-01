"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function SuccessAnimation({ show, onComplete }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onComplete) onComplete();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onComplete]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-background/20 backdrop-blur-sm animate-in fade-in duration-500" />

            <div className="relative flex flex-col items-center">
                {/* Confetti Particles (CSS Only) */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: ["#36d7b7", "#3b82f6", "#f59e0b", "#ef4444"][i % 4],
                            left: "50%",
                            top: "50%",
                            transform: `rotate(${i * 30}deg) translateY(-80px)`,
                            animation: `particle ₹{i} 1s ease-out forwards`
                        }}
                    />
                ))}

                <div className="h-24 w-24 bg-primary rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(54,215,183,0.5)] animate-in zoom-in duration-500">
                    <Check className="h-12 w-12 text-primary-foreground stroke-[4px] animate-in slide-in-from-bottom duration-500 delay-150" />
                </div>

                <h2 className="mt-6 text-3xl font-black text-primary tracking-tighter animate-in bounce-in duration-1000">
                    SETTLED UP!
                </h2>
            </div>

            <style jsx>{`
        @keyframes particle {
          0% { transform: rotate(var(--rotation)) translateY(0); opacity: 1; }
          100% { transform: rotate(var(--rotation)) translateY(-150px); opacity: 0; }
        }
        .bounce-in {
          animation: bounce 0.8s cubic-bezier(0.36, 0, 0.66, -0.56) infinite alternate;
        }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }
      `}</style>
        </div>
    );
}
