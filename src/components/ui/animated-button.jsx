import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedButton({ children, className, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative group overflow-hidden rounded-full bg-zinc-900/40 backdrop-blur-sm border border-zinc-700/50 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors",
        className
      )}
    >
      {/* The cinematic light sweep effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Button Content */}
      <span className="relative flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}