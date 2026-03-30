import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Film, Tv, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useMultiSearch, fetchMovieDetails } from '../hooks/useMovies';
import { fetchShowDetails } from '../hooks/useShows'; 

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(searchTerm, 800);

  const { data: results, isLoading } = useMultiSearch(debouncedSearch);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (item) => {
    setIsOpen(false);
    setSearchTerm('');
    if (item.media_type === 'tv') {
      navigate(`/show/${item.id}`);
    } else {
      navigate(`/movie/${item.id}`);
    }
  };

  const handlePrefetch = (item) => {
    if (item.media_type === 'tv') {
      queryClient.prefetchQuery({
        queryKey: ['showDetails', String(item.id)],
        queryFn: () => fetchShowDetails(item.id),
        staleTime: 1000 * 60 * 5,
      });
    } else {
      queryClient.prefetchQuery({
        queryKey: ['movieDetails', String(item.id)],
        queryFn: () => fetchMovieDetails(item.id),
        staleTime: 1000 * 60 * 5,
      });
    }
  };

  return (
    <div ref={dropdownRef} className="relative z-50 w-full max-w-sm">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-5 h-5 text-zinc-400" />
        <input
          type="text"
          placeholder="Search movies & shows..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-zinc-900/80 border border-zinc-800 text-white rounded-full py-2 pl-10 pr-10 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-500"
        />
        {searchTerm && (
          <button 
            onClick={() => {
              setSearchTerm('');
              setIsOpen(false);
            }}
            className="absolute right-3 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && searchTerm.trim().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
          >
            {isLoading && (
              <div className="p-4 flex items-center justify-center text-zinc-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2 text-red-500" /> Searching...
              </div>
            )}

            {!isLoading && results?.length === 0 && debouncedSearch && (
              <div className="p-4 text-center text-zinc-500 text-sm">
                No results found for "{debouncedSearch}"
              </div>
            )}

            {!isLoading && results?.length > 0 && (
              <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-2">
                {results.slice(0, 8).map((item) => {
                  const title = item.title || item.name; 
                  const date = item.release_date || item.first_air_date;
                  const poster = item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : null;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleResultClick(item)}
                      onMouseEnter={() => handlePrefetch(item)}
                      className="w-full text-left flex items-center gap-3 p-3 hover:bg-zinc-800/80 cursor-pointer transition-colors"
                    >
                      <div className="w-10 h-14 bg-zinc-800 rounded flex-shrink-0 overflow-hidden">
                        {poster ? (
                          <img src={poster} alt={title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600">
                            <Film className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col flex-grow overflow-hidden">
                        <h4 className="text-zinc-200 text-sm font-medium truncate">{title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {item.media_type === 'tv' ? (
                            <span className="flex items-center text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded">
                              <Tv className="w-3 h-3 mr-1" /> SHOW
                            </span>
                          ) : (
                            <span className="flex items-center text-[10px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
                              <Film className="w-3 h-3 mr-1" /> MOVIE
                            </span>
                          )}
                          <span className="text-zinc-500 text-xs">
                            {date ? date.substring(0, 4) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}