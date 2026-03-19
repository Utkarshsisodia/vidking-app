import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, Layers, ListVideo, PlayCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useShowDetails, useSeasonDetails } from '../hooks/useShows';

export default function SeasonEpisodeSelector({ 
  showId,
  currentSeason = 1, 
  currentEpisode = 1,
  onSeasonChange,
  onEpisodeChange
}) {
  // Controlled state for closing the modals automatically after a click
  const [isSeasonOpen, setIsSeasonOpen] = useState(false);
  const [isEpisodeOpen, setIsEpisodeOpen] = useState(false);

  // 1. Fetch the overall show details (to get the list of Seasons)
  const { data: show, isLoading: isShowLoading } = useShowDetails(showId);
  
  // 2. Fetch the specific season details (to get the list of Episodes)
  const { data: seasonData, isLoading: isSeasonLoading } = useSeasonDetails(showId, currentSeason);

  // Filter out "Specials" (Season 0) to keep the UI clean
  const seasons = show?.seasons?.filter(s => s.season_number > 0) || [];
  const episodes = seasonData?.episodes || [];

  return (
    <div className="flex items-center gap-4">
      
      {/* --- SEASONS MODAL --- */}
      <Dialog open={isSeasonOpen} onOpenChange={setIsSeasonOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-40 bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all shadow-lg backdrop-blur-sm"
          >
            <Layers className="w-4 h-4 mr-2 text-red-500" />
            Season {currentSeason}
            <ChevronDown className="w-4 h-4 ml-auto opacity-50" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="bg-zinc-950 border border-zinc-800 text-white max-w-md w-[90%] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-zinc-800/80 bg-zinc-900/50">
            <DialogTitle className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-500" /> Select Season
            </DialogTitle>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {isShowLoading ? (
               <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 text-red-500 animate-spin" /></div>
            ) : (
              seasons.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSeasonChange(s.season_number);
                    setIsSeasonOpen(false); // Close modal
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                    currentSeason === s.season_number 
                      ? 'bg-red-500/10 border-red-500/50 text-white' 
                      : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <span className="font-semibold text-lg">Season {s.season_number}</span>
                  <span className="text-xs font-medium opacity-60">{s.episode_count} Episodes</span>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* --- EPISODES MODAL --- */}
      <Dialog open={isEpisodeOpen} onOpenChange={setIsEpisodeOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-40 bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all shadow-lg backdrop-blur-sm"
          >
            <ListVideo className="w-4 h-4 mr-2 text-cyan-500" />
            Episode {currentEpisode}
            <ChevronDown className="w-4 h-4 ml-auto opacity-50" />
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-zinc-950 border border-zinc-800 text-white max-w-lg w-[95%] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-zinc-800/80 bg-zinc-900/50">
            <DialogTitle className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <ListVideo className="w-5 h-5 text-cyan-500" /> Season {currentSeason} Episodes
            </DialogTitle>
          </DialogHeader>
          
          <div className="max-h-[65vh] overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {isSeasonLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 text-cyan-500 animate-spin" /></div>
            ) : (
              episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => {
                    onEpisodeChange(ep.episode_number);
                    setIsEpisodeOpen(false); // Close modal
                  }}
                  className={`w-full flex items-start text-left gap-4 p-3 rounded-lg border transition-all ${
                    currentEpisode === ep.episode_number 
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-white' 
                      : 'bg-zinc-900/30 border-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {/* Episode Number Badge */}
                  <div className={`mt-0.5 shrink-0 flex items-center justify-center w-8 h-8 rounded-md font-bold text-sm ${
                    currentEpisode === ep.episode_number ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {ep.episode_number}
                  </div>
                  
                  {/* Episode Info */}
                  <div className="flex flex-col flex-grow pr-2">
                    <span className="font-semibold text-base line-clamp-1">{ep.name}</span>
                    <span className="text-xs font-medium opacity-60 mt-0.5">
                      {ep.runtime ? `${ep.runtime} min` : 'TBA'}
                    </span>
                  </div>

                  {/* Play Icon Indicator */}
                  {currentEpisode === ep.episode_number && (
                    <PlayCircle className="w-5 h-5 text-cyan-500 shrink-0 mt-1.5" />
                  )}
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}