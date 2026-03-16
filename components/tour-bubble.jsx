"use client";

import { useEffect, useState } from "react";

export function TourBubble() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if tour was already completed
    const isCompleted = localStorage.getItem("splitr-tour-completed") === "true";
    if (!isCompleted) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="absolute -top-16 bg-zinc-900 text-white font-bold px-4 py-2 rounded-xl shadow-2xl border border-zinc-700 text-sm whitespace-nowrap animate-bounce z-50 pointer-events-none flex items-center gap-2">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px]">✨</span>
      Start your App Tour here!
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-zinc-900 border-r-[6px] border-r-transparent"></div>
    </div>
  );
}
