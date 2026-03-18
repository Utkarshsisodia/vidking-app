import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Calendar, Clock, Star, ArrowLeft, Bookmark, Loader2 } from 'lucide-react';
import { useShowDetails } from '../hooks/useShows';
import SimilarShows from '../components/SimilarShows';
import { motion } from 'framer-motion';

export default function ShowDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: show, isLoading, isError } = useShowDetails(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-red-500 animate-spin mb-4" />
        <p className="text-zinc-400 font-medium">Loading show details...</p>
      </div>
    );
  }

  if (isError || !show) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-2">Show Not Found</h2>
        <Button onClick={() => navigate('/shows')} className="bg-red-600 hover:bg-red-700">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shows
        </Button>
      </div>
    );
  }

  const posterUrl = show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : null;
  const year = show.first_air_date ? show.first_air_date.substring(0, 4) : 'N/A';
  const runtime = show.episode_run_time?.length > 0 ? `${show.episode_run_time[0]}m` : 'N/A';
  const rating = show.vote_average ? show.vote_average.toFixed(1) : 'NR';
  const genres = show.genres ? show.genres.map(g => g.name).join(' • ') : '';

  return (
    <motion.div initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }} className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 md:p-10 font-sans">
      
      {/* 1. Header (Exactly like the screenshot) */}
      <header className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-zinc-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <div className="text-2xl font-extrabold tracking-tight text-white">
          VidKing
        </div>
      </header>

      {/* 2. Main Grid Layout */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] gap-10 items-start">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="flex flex-col gap-6">
          {/* Poster */}
          <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-zinc-800 bg-zinc-900 aspect-[2/3]">
            {posterUrl && <img src={posterUrl} alt={show.name} className="w-full h-full object-cover" />}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate(`/watch/tv/${show.id}`)}
              className="w-full bg-[#e50914] hover:bg-red-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-5 h-5 fill-current" /> Watch Now
            </button>
            <button 
              className="w-full bg-transparent border border-zinc-800 hover:bg-zinc-900 text-zinc-300 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Bookmark className="w-5 h-5" /> Watch Later
            </button>
          </div>

          {/* Quick Info Card */}
          <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5 shadow-lg">
            <h3 className="text-white font-semibold mb-4 text-sm">Quick Info</h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Rating</span>
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" /> 
                  {rating} <span className="text-zinc-600 text-[10px] font-normal -ml-0.5">/10</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Release</span>
                <span className="text-white font-medium">{year}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Runtime</span>
                <span className="text-white font-medium">{runtime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        {/* ADDED: items-start and text-left to force a hard left alignment constraint */}
        <div className="flex flex-col items-start text-left w-full">
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight w-full">
            {show.name}
          </h1>

          {/* Meta Information Row */}
          {/* ADDED: justify-start to ensure the flex items pack tightly to the left */}
          <div className="flex flex-wrap items-center justify-start gap-4 text-sm text-zinc-400 mb-8 w-full">
            <span className="bg-[#0f3d3e] text-cyan-400 px-3 py-1 rounded-full font-semibold text-xs tracking-wide">
              TV Show
            </span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {year}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {runtime}</span>
            <span className="hidden md:inline-block text-zinc-600">•</span>
            <span className="text-zinc-300">{genres}</span>
            
            {/* Right-aligned Top Rating Badge (Using ml-auto pushes only this badge to the far right) */}
            <div className="ml-auto bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md flex items-center gap-1.5 text-white font-bold text-sm">
              <Star className="w-4 h-4 text-yellow-500 fill-current" /> {rating}
            </div>
          </div>

          {/* Synopsis Header & Paragraph */}
          <h3 className="text-xl font-semibold text-white mb-3 w-full">Synopsis</h3>
          <p className="text-zinc-400 text-base leading-relaxed mb-12 max-w-3xl w-full">
            {show.overview || "No synopsis available for this show."}
          </p>

          {/* Divider */}
          <hr className="border-zinc-800 mb-10 w-full" />

          <SimilarShows showId={id} />

        </div>
      </main>
    </motion.div>
  );
}