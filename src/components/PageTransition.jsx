import React from 'react';
import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
  return (
    <motion.div
      // 1. Initial state (when page first loads)
      initial={{ opacity: 0 }}
      // 2. Animate state (resting state of the page)
      animate={{ opacity: 1 }}
      // 3. Exit state (when navigating away)
      exit={{ opacity: 0 }}
      // Keep the transition quick so the app feels snappy
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}