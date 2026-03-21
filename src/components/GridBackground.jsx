import React from "react";
import { cn } from "@/lib/utils";

export default function GridBackground({ children, className }) {
  return (
    <div className={cn("relative flex flex-col min-h-[100dvh] w-full bg-zinc-950 overflow-hidden", className)}>
      
      {/* --- FREE BACKGROUND PATTERN --- */}
      {/* CHANGED: Swapped #ffffff0f for rgba(255,255,255,0.15) to make the grid lines much brighter */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:4rem_4rem]">
        
        {/* Cinematic Red Spotlight (VidKing Brand Color) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_0%,#e5091425,transparent)]"></div>
        
        {/* Smooth fade-to-black at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
      </div>
      
      {/* Content Wrapper ensures children stay on top of the background */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}