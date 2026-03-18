import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
// Import the new TV hooks!
import { useSimilarShows, fetchShowDetails } from '../hooks/useShows';

export default function SimilarShows({ showId }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: similarShows, isLoading, isError } = useSimilarShows(showId);

  const handlePrefetch = (id) => {
    queryClient.prefetchQuery({
      queryKey: ['showDetails', String(id)],
      queryFn: () => fetchShowDetails(id),
      staleTime: 1000 * 60 * 5,
    });
  };

  if (isLoading) return <Loader2 className="h-6 w-6 text-red-500 animate-spin" />;
  if (isError) return <p className="text-red-500 text-sm">Failed to load recommendations.</p>;
  
  if (!similarShows || similarShows.length === 0) return null;

  const displayShows = similarShows.slice(0, 4);

  return (
    <div className="w-full">
      <h3 className="relative pl-4 text-xl font-semibold text-zinc-200 mb-6 flex items-center before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:bg-red-500 before:rounded-full before:opacity-90">
        Similar Shows
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        
        {displayShows.map((show) => {
          const posterUrl = show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : null;
          if (!posterUrl) return null; 

          return (
            <motion.div
              key={show.id}
              initial="rest"
              whileHover="hover"
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 25 } }
              }}
              // Navigate to /show instead of /movie
              onClick={() => navigate(`/show/${show.id}`)}
              onMouseEnter={() => handlePrefetch(show.id)}
              className="w-full aspect-[2/3] bg-zinc-900 rounded-lg overflow-hidden cursor-pointer shadow-md ring-1 ring-zinc-800/80 relative"
            >
              <img src={posterUrl} alt={show.name} className="w-full h-full object-cover"/>
              
              <div className="absolute top-2 right-2 bg-zinc-950/80 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow">
                <Star className="text-cyan-400 h-3 w-3" fill="currentColor" /> {show.vote_average?.toFixed(1) || 'NR'}
              </div>

              <motion.div 
                variants={{ rest: { y: "100%" }, hover: { y: 0 } }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute bottom-0 left-0 right-0 p-3 pt-12 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent flex flex-col justify-end"
              >
                {/* Map to show.name and show.first_air_date */}
                <h3 className="text-base font-semibold text-white tracking-wide leading-tight">{show.name}</h3>
                <p className="text-zinc-400 text-xs mt-0.5">{show.first_air_date?.substring(0, 4) || 'N/A'}</p>
              </motion.div>

            </motion.div>
          )
        })}

      </div>
    </div>
  );
}