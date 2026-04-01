import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, ArrowRight, Film, User, LogOut, Settings, Bookmark } from 'lucide-react';

// Custom Components & Store
import GridBackground from '../components/GridBackground';
import SearchBar from '@/components/SearchBar';
import useAuthStore from '@/store/Auth';

// Shadcn UI Primitives
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/ui/animated-button"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HomePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Handle User Logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Dynamically grab their initials for the Avatar
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative">
      
      {/* --- 1. THE STICKY HEADER --- */}
      <header className="fixed top-0 inset-x-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-3 sm:gap-6">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-tighter shrink-0">
              <Film className="w-6 h-6 text-red-600 fill-red-600" />
              <span className="hidden sm:inline">VidKing</span>
            </Link>

            {/* SearchBar */}
            <div className="flex-1 min-w-0 max-w-md flex justify-center">
              <div className="w-full">
                <SearchBar />
              </div>
            </div>

            {/* Shadcn Avatar Dropdown */}
            <div className="shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none focus:ring-2 focus:ring-red-600 rounded-full">
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border border-zinc-800 hover:border-red-600 transition-colors cursor-pointer">
                    <AvatarImage src="" /> 
                    <AvatarFallback className="bg-zinc-900 text-zinc-400 text-xs sm:text-sm font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800 text-zinc-300 mt-2" align="end" sideOffset={8}>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{user?.name || "Guest"}</p>
                      <p className="text-xs leading-none text-zinc-500 truncate">{user?.email || "No email provided"}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  
                  <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer py-2">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer py-2">
                    <Bookmark className="mr-2 h-4 w-4" />
                    <span>My Watchlist</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer py-2">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-zinc-800" />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="focus:bg-red-600 focus:text-white text-red-500 cursor-pointer py-2"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </div>
        </div>
      </header>

      {/* --- 2. YOUR PREMIUM HERO SECTION --- */}
      <main className="pt-16"> {/* Push down past the 4rem/16px header */}
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
                
                {/* Fixed Button Layout */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 w-full">
                  
                  {/* Fixed standard button using asChild */}
                  <Button 
                    asChild 
                    size="lg" 
                    className="w-full sm:w-auto gap-2 h-14 px-8 bg-red-600 hover:bg-red-700 text-white border-0 text-base rounded-full shadow-[0_0_30px_rgba(229,9,20,0.3)]  transition-all"
                  >
                    <Link to="/movies">
                      <Play className="w-5 h-5 fill-current" /> Start Watching
                    </Link>
                  </Button>

                  {/* Wrapped animated button for mobile scaling */}
                  <Link to="/shows" className="w-full sm:w-auto">
                    <AnimatedButton className="w-full h-14 px-8 text-base">
                      Explore TV Shows <ArrowRight className="w-5 h-5" />
                    </AnimatedButton>
                  </Link>
                  
                </div>

              </div>
            </div>
          </section>
        </GridBackground>
      </main>

    </div>
  );
}