import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react'; 
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query'; // 1. Import QueryClient

// 2. Add fetchMovieDetails to your imports
import { useSearchMovies, fetchMovieDetails } from '../hooks/useMovies'; 
import useDebounce from '../hooks/useDebounce';

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);
  
  // 3. Initialize the query client
  const queryClient = useQueryClient(); 

  const debouncedSearch = useDebounce(searchInput, 1000);
  const { data: searchResults, isFetching: isSearching } = useSearchMovies(debouncedSearch);

  // 4. Create the prefetch function
  const handlePrefetch = (id) => {
    queryClient.prefetchQuery({
      queryKey: ['movieDetails', String(id)],
      queryFn: () => fetchMovieDetails(id),
      staleTime: 1000 * 60 * 5,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-[200px] sm:max-w-xs md:max-w-sm z-50" ref={searchContainerRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
      
      <Input 
        type="text" 
        placeholder="Search movies..." 
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          setIsDropdownOpen(true);
        }}
        onFocus={() => setIsDropdownOpen(true)}
        className="pl-9 pr-9 h-10 bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-red-500 rounded-full text-sm shadow-inner"
      />

      {isSearching && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 h-4 w-4 animate-spin" />
      )}

      {isDropdownOpen && searchInput.trim() !== '' && (
        <div className="absolute top-full mt-3 right-0 w-[calc(100vw-3rem)] sm:w-[400px] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto z-50">
          {!isSearching && searchResults?.length === 0 && (
            <div className="p-4 text-center text-zinc-500 text-sm">No movies found for "{searchInput}"</div>
          )}
          {searchResults?.map((movie) => (
            <div 
              key={movie.id}
              onClick={() => {
                navigate(`/movie/${movie.id}`);
                setIsDropdownOpen(false);
                setSearchInput('');
              }}
              // 5. THE MAGIC TRIGGER!
              onMouseEnter={() => handlePrefetch(movie.id)} 
              className="flex items-center gap-3 p-3 hover:bg-zinc-800 cursor-pointer transition-colors border-b border-zinc-800/50 last:border-0"
            >
              {movie.poster_path ? (
                <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} className="w-10 h-14 object-cover rounded-md bg-zinc-800"/>
              ) : (
                <div className="w-10 h-14 rounded-md bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-600">N/A</div>
              )}
              <div className="flex flex-col">
                <span className="text-zinc-100 font-medium text-sm line-clamp-1">{movie.title}</span>
                <span className="text-zinc-500 text-xs mt-0.5">
                  {movie.release_date ? movie.release_date.substring(0, 4) : 'Unknown Year'} • ★ {movie.vote_average?.toFixed(1) || 'NR'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}