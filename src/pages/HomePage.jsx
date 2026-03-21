import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GridBackground from '../components/GridBackground';
// IMPORT YOUR NEW BUTTON
import { AnimatedButton } from "@/components/ui/animated-button"; 

export default function HomePage() {
  return (
    <GridBackground>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-8 text-center">
            
            <div className="space-y-4 flex flex-col items-center">
              <Badge variant="outline" className="px-3 py-1.5 text-sm bg-zinc-900/50 backdrop-blur-md border-zinc-800 text-zinc-300">
                Welcome to VidKing v2.0
              </Badge>
              
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
                Unlimited movies, TV shows, and more.
              </h1>
              
              <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl leading-relaxed">
                Step into the next generation of streaming. Watch anywhere. Zero friction. Ready to start your cinematic journey?
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              
              {/* Standard Start Watching Button */}
              <Link to="/movies">
                <Button size="lg" className="w-full sm:w-auto gap-2 h-14 px-8 bg-red-600 hover:bg-red-700 text-white border-0 text-base rounded-full shadow-[0_0_30px_rgba(229,9,20,0.3)] hover:scale-105 transition-all">
                  <Play className="w-5 h-5 fill-current" /> Start Watching
                </Button>
              </Link>

              {/* YOUR NEW PREMIUM ANIMATED BUTTON */}
              <Link to="/shows">
                <AnimatedButton className="w-full sm:w-auto h-14 px-8 text-base">
                  Explore TV Shows <ArrowRight className="w-5 h-5" />
                </AnimatedButton>
              </Link>
              
            </div>

          </div>
        </div>
      </section>
    </GridBackground>
  );
}