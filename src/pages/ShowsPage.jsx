import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Loader2, Home, Filter, X, TrendingUp, Star, Calendar } from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import SearchBar from '../components/SearchBar';
import { useQueryClient } from '@tanstack/react-query';
// Import our new TV hooks
import { useShowsList, fetchShowDetails } from '../hooks/useShows';

export default function ShowsPage() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();
  
  // Scroll Memory Fix (Adapted for Shows)
  const sortMemory = useRef(searchParams.get('sort'));
  if (location.pathname === '/shows') {
    sortMemory.current = searchParams.get('sort');
  }
  const activeSort = sortMemory.current; 

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempSort, setTempSort] = useState(activeSort); 

  useEffect(() => {
    setTempSort(activeSort);
  }, [activeSort]);

  // Use the new TV hook
  const { data: showsData, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useShowsList(activeSort);

  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 50], ["rgba(9, 9, 11, 0)", "rgba(9, 9, 11, 0.85)"]);
  const blurEffect = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
  const paddingY = useTransform(scrollY, [0, 50], ["2.5rem", "1rem"]);

  // Infinite Scroll Trigger
  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  // Pre-fetch on hover for instant loading
  const handlePrefetch = (id) => {
    queryClient.prefetchQuery({
      queryKey: ['showDetails', String(id)],
      queryFn: () => fetchShowDetails(id),
      staleTime: 1000 * 60 * 5,
    });
  };

  const handleApply = () => {
    if (tempSort) setSearchParams({ sort: tempSort });
    else setSearchParams({}); 
    setIsFilterOpen(false);
  };

  const handleClear = () => {
    setTempSort(null);
    setSearchParams({}); 
  };

  const showsList = showsData?.pages.flatMap((page) => page.results) || [];

  // Scroll Restoration Hook
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('showsScrollPosition');
    if (savedScroll && showsList.length > 0) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' });
        sessionStorage.removeItem('showsScrollPosition'); 
      }, 0);
    }
  }, [showsList.length]);

  const sectionTitle = 
    activeSort === 'popularity.desc' ? 'Most Popular Shows' :
    activeSort === 'vote_average.desc' ? 'Top Rated Shows' :
    activeSort === 'first_air_date.desc' ? 'New Releases' :
    'Trending TV Shows';

  return (
    <div className="min-h-screen pb-12 bg-zinc-950">
      
      {/* Header */}
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

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 md:mt-16">
        
        <div className="flex justify-between items-center w-full mb-6">
          <h2 className="text-2xl font-semibold text-zinc-300">{sectionTitle}</h2>
          
          <Button 
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`transition-all duration-200 ${
              isFilterOpen || activeSort
              ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700/80'
              : 'bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 32 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 md:p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2 text-zinc-100 font-semibold text-lg">
                    <Filter className="w-5 h-5 text-red-500" /> Filter Shows
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={handleClear} className="text-sm font-medium text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
                      <X className="w-4 h-4" /> Clear All
                    </button>
                    <Button onClick={handleApply} className="bg-red-600 hover:bg-red-700 text-white px-6 rounded-md font-semibold">
                      Apply
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium mb-1">
                    <TrendingUp className="w-4 h-4" /> Sort By
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => setTempSort('popularity.desc')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${tempSort === 'popularity.desc' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'}`}>
                      <TrendingUp className="w-4 h-4" /> Popularity
                    </button>
                    <button onClick={() => setTempSort('vote_average.desc')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${tempSort === 'vote_average.desc' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'}`}>
                      <Star className="w-4 h-4" /> Rating
                    </button>
                    <button onClick={() => setTempSort('first_air_date.desc')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${tempSort === 'first_air_date.desc' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'}`}>
                      <Calendar className="w-4 h-4" /> Release Date
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isLoading && <p className="text-zinc-500 text-lg text-left">Loading shows...</p>}
        {isError && <p className="text-red-500 text-lg text-left">Failed to load shows.</p>}
        
        {/* Shows Grid */}
        {showsList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 relative z-0">
            {showsList.map((show, index) => {
              const posterUrl = show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : null;
              if (!posterUrl) return null;

              return (
                <motion.div
                  key={`${show.id}-${index}`}
                  onClick={() => {
                    sessionStorage.setItem('showsScrollPosition', window.scrollY);
                    navigate(`/show/${show.id}`);
                  }}
                  onMouseEnter={() => handlePrefetch(show.id)}
                  initial="rest"
                  whileHover="hover"
                  className="relative aspect-[2/3] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer shadow-lg ring-1 ring-zinc-800"
                >
                  <img src={posterUrl} alt={show.name} className="w-full h-full object-cover object-center" />
                  <div className="absolute top-3 right-3 bg-zinc-900/90 text-white text-xs font-bold px-2 py-1.5 rounded-md flex items-center gap-1">
                    <span className="text-cyan-400 text-[10px]">★</span> {show.vote_average?.toFixed(1) || 'NR'}
                  </div>
                  <motion.div 
                    variants={{ rest: { y: "100%" }, hover: { y: 0 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute bottom-0 left-0 right-0 p-4 pt-16 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent flex flex-col justify-end"
                  >
                    {/* CRITICAL CHANGE: show.name and show.first_air_date */}
                    <h3 className="text-lg font-bold text-white tracking-wide leading-tight">{show.name}</h3>
                    <p className="text-zinc-400 text-sm mt-1">{show.first_air_date?.substring(0, 4) || 'N/A'}</p>
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