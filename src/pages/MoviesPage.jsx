import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Loader2, Home, Filter, X, TrendingUp, Star, Calendar } from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import SearchBar from '../components/SearchBar';
import { useQueryClient } from '@tanstack/react-query';
import { useMoviesList, fetchMovieDetails } from '../hooks/useMovies';

export default function MoviesPage() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();
  
  // --- THE FLICKER FIX (Updated) ---
  const sortMemory = useRef(searchParams.get('sort'));
  
  // CHANGED: We ONLY update the memory if the URL is strictly '/movies'.
  // If you navigate to '/' (Home) or '/movie/123', this safely ignores the URL change,
  // freezing the filter state perfectly in place while Framer Motion fades the page out!
  if (location.pathname === '/movies') {
    sortMemory.current = searchParams.get('sort');
  }
  
  const activeSort = sortMemory.current; 

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempSort, setTempSort] = useState(activeSort); 

const handleToggleFilter = () => {
  if(!isFilterOpen){
    setTempSort(activeSort);
  }
    setIsFilterOpen((prev) => !prev);
  };

  const { data: moviesData, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useMoviesList(activeSort);

  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 50], ["rgba(9, 9, 11, 0)", "rgba(9, 9, 11, 0.85)"]);
  const blurEffect = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
  const paddingY = useTransform(scrollY, [0, 50], ["2.5rem", "1rem"]);

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const handlePrefetch = (id) => {
    queryClient.prefetchQuery({
      queryKey: ['movieDetails', String(id)],
      queryFn: () => fetchMovieDetails(id),
      staleTime: 1000 * 60 * 5,
    });
  };

  const handleApply = () => {
    if (tempSort) {
      setSearchParams({ sort: tempSort });
    } else {
      setSearchParams({}); 
    }
    setIsFilterOpen(false);
  };

  const handleClear = () => {
    setTempSort(null);
    setSearchParams({}); 
  };
  const rawMovies = moviesData?.pages.flatMap((page) => page.results) || [];
  const moviesList = Array.from(new Map(rawMovies.map(movie => [movie.id, movie])).values());

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('moviesScrollPosition');
    if (savedScroll && moviesList.length > 0) {
      // Use a tiny timeout to ensure the DOM has painted the grid before jumping
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' });
        sessionStorage.removeItem('moviesScrollPosition'); // Clear it so it doesn't trigger randomly
      }, 0);
    }
  }, [moviesList.length]);

  const sectionTitle = 
    activeSort === 'popularity.desc' ? 'Most Popular' :
    activeSort === 'vote_average.desc' ? 'Top Rated' :
    activeSort === 'primary_release_date.desc' ? 'New Releases' :
    'Trending Movies';

  return (
    <div className="min-h-screen pb-12 bg-zinc-950">
      
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
            onClick={handleToggleFilter}
            // Kept the subtle styling for the main toggle button
            className={`transition-all duration-200 ${
              isFilterOpen || activeSort
              ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700/80'
              : 'bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>

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
                    {/* RESTORED: Red Icon */}
                    <Filter className="w-5 h-5 text-red-500" /> Filter Movies
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={handleClear} className="text-sm font-medium text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
                      <X className="w-4 h-4" /> Clear All
                    </button>
                    {/* RESTORED: VidKing Red Apply Button */}
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
                    
                    {/* RESTORED: Red active states for the filter options */}
                    <button
                      onClick={() => setTempSort('popularity.desc')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                        tempSort === 'popularity.desc' 
                        ? 'bg-red-500/10 border-red-500 text-red-500' 
                        : 'bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" /> Popularity
                    </button>

                    <button
                      onClick={() => setTempSort('vote_average.desc')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                        tempSort === 'vote_average.desc' 
                        ? 'bg-red-500/10 border-red-500 text-red-500' 
                        : 'bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
                      }`}
                    >
                      <Star className="w-4 h-4" /> Rating
                    </button>

                    <button
                      onClick={() => setTempSort('primary_release_date.desc')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                        tempSort === 'primary_release_date.desc' 
                        ? 'bg-red-500/10 border-red-500 text-red-500' 
                        : 'bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
                      }`}
                    >
                      <Calendar className="w-4 h-4" /> Release Date
                    </button>

                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isLoading && <p className="text-zinc-500 text-lg text-left">Loading movies...</p>}
        {isError && <p className="text-red-500 text-lg text-left">Failed to load movies.</p>}
        
        {moviesList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 relative z-0">
            {moviesList.map((movie) => {
              const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
              if (!posterUrl) return null;

              return (
                <motion.div
                  key={movie.id}
                  onClick={() => {
                    sessionStorage.setItem('moviesScrollPosition', window.scrollY);
                    navigate(`/movie/${movie.id}`);
                  }}
                  onMouseEnter={() => handlePrefetch(movie.id)}
                  initial="rest"
                  whileHover="hover"
                  className="relative aspect-[2/3] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer shadow-lg ring-1 ring-zinc-800"
                >
                  <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover object-center" />
                  <div className="absolute top-3 right-3 bg-zinc-900/90 text-white text-xs font-bold px-2 py-1.5 rounded-md flex items-center gap-1">
                    <span className="text-zinc-300 text-[10px]">★</span> {movie.vote_average?.toFixed(1) || 'NR'}
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
                  <Loader2 className="h-8 w-8 text-zinc-500 animate-spin" />
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