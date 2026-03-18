import React from 'react';
import useMovieStore from '../store';
import { Button } from "@/components/ui/button";

// ADDED: season, episode, and showBackButton props
export default function VideoPlayer({ tmdbId, type = 'movie', season = 1, episode = 1, showBackButton = true }) {
  const clearActiveMovie = useMovieStore((state) => state.clearActiveMovie);
  
  // CHANGED: Handle VidKing's different URL structures for Movies vs TV Shows
  let embedUrl = `https://www.vidking.net/embed/movie/${tmdbId}?autoPlay=true`;
  if (type === 'tv') {
    embedUrl = `https://www.vidking.net/embed/tv/${tmdbId}/${season}/${episode}?autoPlay=true`;
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      
      {/* Conditionally render the button so it doesn't clash with WatchPage's back button */}
      {showBackButton && (
        <Button 
          variant="outline" 
          onClick={clearActiveMovie}
          className="mb-6 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
        >
          ← Back to Movies
        </Button>
      )}
      
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-zinc-800">
        <iframe 
          src={embedUrl}
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
}