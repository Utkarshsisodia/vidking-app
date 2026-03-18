import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { fetchMoviesList } from '../hooks/useMovies';

export default function SplashScreen({ onFinish }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const initializeApp = async () => {
      // 1. PRELOAD ASSETS: Start fetching the first page of Trending Movies secretly
      const prefetchPromise = queryClient.prefetchInfiniteQuery({
        queryKey: ['moviesList', null], // Matches your default trending fetch!
        queryFn: ({ pageParam }) => fetchMoviesList({ pageParam, sortBy: null }),
        initialPageParam: 1,
      });

      // 2. MINIMUM TIMER: Guarantee the logo animation plays for at least 1.8 seconds
      const timerPromise = new Promise(resolve => setTimeout(resolve, 1800));

      // 3. THE MAGIC: Wait for BOTH the data to finish downloading AND the timer to finish
      await Promise.all([prefetchPromise, timerPromise]);

      // 4. Tell the App we are ready to go!
      onFinish();
    };

    initializeApp();
  }, [queryClient, onFinish]);

  return (
    <motion.div 
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }} // Smooth zoom-fade out when done
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        {/* The glowing brand text */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 relative z-10">
          VidKing
        </h1>
        
        {/* The subtle pulsing glow behind the text */}
        <motion.div 
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-red-600 blur-[60px] -z-10 rounded-full"
        />
      </motion.div>
    </motion.div>
  );
}