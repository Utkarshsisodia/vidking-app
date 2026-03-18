import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Bookmark, Star, Calendar, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMovieDetails } from '../hooks/useMovies';
import VideoPlayer from '../components/VideoPlayer';
import useMovieStore from '../store';
import SimilarMovies from '@/components/SimilarMovies';

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeMovie, setActiveMovie, clearActiveMovie } = useMovieStore();
  
  const { data: movie, isLoading, isError } = useMovieDetails(id);

  useEffect(() => {
    clearActiveMovie();
  }, [id, clearActiveMovie]);

  if (isLoading) return <div className="min-h-screen pt-32 text-center text-zinc-500 text-xl">Loading movie details...</div>;
  if (isError || !movie) return <div className="min-h-screen pt-32 text-center text-red-500 text-xl">Failed to load movie.</div>;

  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
  const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;
  const runtimeStr = `${hours}h ${minutes}m`;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12">
      
      {/* Top Navigation Bar */}
      <div className="w-full p-6 max-w-7xl mx-auto flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-zinc-400 hover:text-white transition-colors">
          ← Back
        </button>
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
          VidKing
        </h2>
      </div>

      {/* CHANGED: Increased top margin from mt-4 to mt-16 for more breathing room */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16">
        
        

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Poster, Buttons, Quick Info */}
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 flex flex-col gap-6">
            <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-zinc-800">
              {posterUrl ? (
                <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">No Image</div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => navigate(`/watch/${movie.id}`)}
                className="w-full py-6 text-lg font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors duration-200"
              >
                <Play className="mr-2 h-5 w-5 fill-white" /> Watch Now
              </Button>
              <Button 
                variant="outline" 
                className="w-full py-6 text-base font-semibold border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 rounded-xl"
              >
                <Bookmark className="mr-2 h-4 w-4" /> Watch Later
              </Button>
            </div>

            <div className="bg-zinc-900/40 rounded-xl p-5 border border-zinc-800/50 flex flex-col gap-4 text-left">
              <h3 className="font-semibold text-zinc-100 mb-1">Quick Info</h3>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Rating</span>
                <span className="font-medium flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500 fill-yellow-500"/> {rating} <span className="text-zinc-500 text-xs">/10</span></span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Release</span>
                <span className="font-medium">{year}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Runtime</span>
                <span className="font-medium">{runtimeStr}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Title, Meta, Synopsis */}
          {/* CHANGED: Added items-start and text-left to force everything to align left */}
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col items-start text-left pt-2 md:pt-8">
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 w-full">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-zinc-300 text-sm mb-10 w-full">
              <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 border-0 rounded-md px-3 py-1 font-medium">
                Movie
              </Badge>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-zinc-500" /> {year}
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-zinc-500" /> {runtimeStr}
              </div>

              <div className="flex items-center gap-2 flex-wrap ml-2">
                {movie.genres?.map(genre => (
                  <span key={genre.id} className="text-zinc-400">{genre.name}</span>
                )).reduce((prev, curr) => [prev, <span key={Math.random()} className="text-zinc-600">•</span>, curr])}
              </div>

              <div className="flex items-center gap-1 ml-auto text-yellow-500 font-bold bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                <Star className="h-4 w-4 fill-yellow-500" /> {rating}
              </div>
            </div>

            {/* CHANGED: Added w-full to the synopsis box so the text stays aligned to the far left boundary */}
            <div className="w-full">
              <h3 className="text-xl font-semibold mb-3 text-zinc-100">Synopsis</h3>
              <p className="text-zinc-300 leading-relaxed text-lg max-w-4xl">
                {movie.overview || "No synopsis available for this title."}
              </p>
            </div>
            {/* 2. ADD THE SIMILAR MOVIES HERE! */}
        {/* Placed inside the max-w-7xl container to guarantee pixel-perfect alignment */}
        <div className="mt-20 md:mt-24 border-t border-zinc-800/80 pt-12 md:pt-16">
          <SimilarMovies movieId={id} />
        </div>

          </div>
        </div>
      </div>
    </div>
  );
}