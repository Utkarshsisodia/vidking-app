import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // autoPlay=true ensures it starts immediately
  const embedUrl = `https://www.vidking.net/embed/movie/${id}?autoPlay=true`;

  return (
    // min-h-screen and flex ensure the content is perfectly centered vertically and horizontally
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

      {/* Centered Video Player Container */}
      <div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-zinc-800 animate-in fade-in zoom-in-95 duration-500">
        <iframe 
          src={embedUrl}
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>

    </div>
  );
}