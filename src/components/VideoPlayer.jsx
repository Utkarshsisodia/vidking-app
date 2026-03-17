import React from 'react';
import useMovieStore from '../store';
import { Button } from "@/components/ui/button";

export default function VideoPlayer({ tmdbId, type = 'movie' }) {
  const clearActiveMovie = useMovieStore((state) => state.clearActiveMovie);
  
  // autoPlay=true ensures it starts immediately
  const embedUrl = `https://www.vidking.net/embed/${type}/${tmdbId}?autoPlay=true`;

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      
      {/* Shadcn Button with custom Tailwind styling */}
      <Button 
        variant="outline" 
        onClick={clearActiveMovie}
        className="mb-6 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
      >
        ← Back to Movies
      </Button>
      
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