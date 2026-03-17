import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Loader2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import SearchBar from '../components/SearchBar';
import { useQueryClient } from '@tanstack/react-query'; // 1. Import this!
import { useTrendingMovies, fetchMovieDetails } from '../hooks/useMovies'; // 2. Import fetchMovieDetails!

export default function MoviesPage() {
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  // 3. Initialize the query client
  const queryClient = useQueryClient();

  const { data: trendingData, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useTrendingMovies();

  // 4. Create the prefetch function
  const handlePrefetch = (id) => {
    queryClient.prefetchQuery({
      queryKey: ['movieDetails', String(id)], // Must match the key in useMovieDetails!
      queryFn: () => fetchMovieDetails(id),
      staleTime: 1000 * 60 * 5, // Keep the prefetched data fresh for 5 minutes
    });
  };

  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 50], ["rgba(9, 9, 11, 0)", "rgba(9, 9, 11, 0.85)"]);
  const blurEffect = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
  
  // 1. CHANGED: Increased the starting top padding to 2.5rem (40px) for that extra space above!
  const paddingY = useTransform(scrollY, [0, 50], ["2.5rem", "1rem"]);

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const trendingMovies = trendingData?.pages.flatMap((page) => page.results) || [];

  return (
    <div className="min-h-screen pb-12 bg-zinc-950">
      
      {/* The Sticky Header */}
      <motion.div 
        style={{ backgroundColor: bgOpacity, backdropFilter: blurEffect, paddingTop: paddingY, paddingBottom: paddingY }}
        className="sticky top-0 z-50 w-full border-b border-zinc-800/0 transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between gap-4">
          
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="-ml-4 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-full transition-colors shrink-0"
          >
            <Home className="w-5 h-5 mr-2" />
            <span className="text-base font-medium tracking-wide hidden sm:inline-block">Home</span>
          </Button>

          <SearchBar />

        </div>
      </motion.div>

      {/* 2. CHANGED: Increased margin-top to mt-12 md:mt-16 to ensure it's larger than the top gap */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 md:mt-16">
        
        <div className="flex justify-start w-full">
          <h2 className="text-2xl font-semibold mb-6 text-zinc-300">Trending Movies</h2>
        </div>
        
        {isLoading && <p className="text-zinc-500 text-lg text-left">Loading latest hits...</p>}
        {isError && <p className="text-red-500 text-lg text-left">Failed to load movies.</p>}
        
        {trendingMovies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 relative z-0">
            {trendingMovies.map((movie, index) => {
              const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
              if (!posterUrl) return null;

              return (
                <motion.div
                  key={`${movie.id}-${index}`}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  onMouseEnter={() => handlePrefetch(movie.id)} // 5. THE MAGIC TRIGGER!
                  initial="rest"
                  whileHover="hover"
                  className="relative aspect-[2/3] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer shadow-lg ring-1 ring-zinc-800"
                >
                  <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover object-center" />
                  <div className="absolute top-3 right-3 bg-zinc-900/90 text-white text-xs font-bold px-2 py-1.5 rounded-md flex items-center gap-1">
                    <span className="text-cyan-400 text-[10px]">★</span> {movie.vote_average?.toFixed(1) || 'NR'}
                  </div>
                  <motion.div 
                    variants={{ rest: { y: "100%" }, hover: { y: 0 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute bottom-0 left-0 right-0 p-4 pt-16 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent flex flex-col justify-end"
                  >
                    <h3 className="text-lg font-bold text-white tracking-wide leading-tight">{movie.title}</h3>
                    <p className="text-zinc-400 text-sm mt-1">{movie.release_date?.substring(0, 4) || 'N/A'}</p>
                  </motion.div>
                </motion.div>
              )
            })}

            {hasNextPage && (
              <div ref={ref} className="col-span-full py-10 flex justify-center items-center">
                {isFetchingNextPage ? (
                  <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
                ) : (
                  <span className="text-zinc-500">Scroll down for more...</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}