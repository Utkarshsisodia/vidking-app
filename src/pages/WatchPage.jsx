import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine type from URL (e.g., /watch/tv/123 vs /watch/movie/123)
  const isTVShow = location.pathname.includes('/tv/');
  
  // State for TV shows (defaults to S1 E1)
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 md:p-12">
      
      {/* Top Bar for the Back Button */}
      <div className="w-full max-w-6xl mb-6 flex justify-start w-full animate-in fade-in slide-in-from-top-4 duration-500">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/80 hover:bg-zinc-800 px-5 py-2.5 rounded-full border border-zinc-800 shadow-lg"
        >
          <ArrowLeft className="h-5 w-5" /> Back to Details
        </button>
      </div>

      {/* REUSED COMPONENT: Passing down the correct props and hiding its internal back button */}
      <VideoPlayer 
        tmdbId={id} 
        type={isTVShow ? 'tv' : 'movie'} 
        season={season} 
        episode={episode}
        showBackButton={false} 
      />

      {/* Temporary indicator so users know which episode is playing */}
      {isTVShow && (
        <div className="w-full max-w-5xl mt-4 flex justify-end animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium">
            Playing: Season {season} • Episode {episode}
          </div>
        </div>
      )}

    </div>
  );
}