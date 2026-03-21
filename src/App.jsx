import React,{ useState } from 'react';
import { createBrowserRouter, RouterProvider, useLocation, useOutlet, Link } from 'react-router-dom';
import {motion, AnimatePresence } from 'framer-motion';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import WatchPage from './pages/WatchPage';
import PageTransition from './components/PageTransition';
import SplashScreen from './components/SplashScreen';
import ShowsPage from './pages/ShowsPage';
import ShowDetailPage from './pages/ShowDetailPage';
import HomePage from './pages/HomePage';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// --- Landing Page Component ---
function LandingPage() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-center p-6 bg-zinc-950 overflow-hidden">
      
      {/* Optional: A very subtle background grid to make it feel like a premium app interface */}
      <div className="absolute inset-0 bg-[#0a0a0a] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
          VidKing
        </h1>
        <p className="text-zinc-400 text-xl md:text-2xl mb-16 max-w-2xl">
          What are we watching today?
        </p>

        {/* --- TWO-CARD CONTAINER --- */}
        {/* flex-col on mobile so they stack, sm:flex-row on bigger screens so they are side-by-side */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-16 w-full px-4">
          
          {/* MOVIES CARD */}
          <Link 
            to="/movies" 
            className="group flex flex-col items-center gap-5 transition-all w-full sm:w-auto"
          >
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] border border-zinc-800 bg-zinc-900/40 shadow-xl group-hover:-translate-y-2 group-hover:border-cyan-500 group-hover:bg-zinc-900/80 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] transition-all duration-500 relative flex items-center justify-center backdrop-blur-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 text-cyan-500 group-hover:text-cyan-400 group-hover:[filter:drop-shadow(0_0_15px_rgba(34,211,238,0.6))] transition-all duration-500">
                {/* Custom Film Strip Icon */}
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="3" y1="15" x2="21" y2="15"/>
                  <line x1="9" y1="3" x2="9" y2="21"/>
                  <line x1="15" y1="3" x2="15" y2="21"/>
                </svg>
              </div>
            </div>
            <span className="text-xl md:text-2xl font-bold text-zinc-400 group-hover:text-white tracking-wide transition-colors duration-300">Movies</span>
          </Link>

          {/* TV SERIES CARD */}
          <Link 
            to="/shows" 
            className="group flex flex-col items-center gap-5 transition-all w-full sm:w-auto"
          >
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] border border-zinc-800 bg-zinc-900/40 shadow-xl group-hover:-translate-y-2 group-hover:border-cyan-500 group-hover:bg-zinc-900/80 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] transition-all duration-500 relative flex items-center justify-center backdrop-blur-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 text-cyan-500 group-hover:text-cyan-400 group-hover:[filter:drop-shadow(0_0_15px_rgba(34,211,238,0.6))] transition-all duration-500">
                {/* Custom Retro TV Icon */}
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                  {/* The TV Antennas */}
                  <polyline points="17 2 12 7 7 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <span className="text-xl md:text-2xl font-bold text-zinc-400 group-hover:text-white tracking-wide transition-colors duration-300">TV Series</span>
          </Link>

        </div>
      </div>
    </div>
  );
}

// --- 1. The Root Layout ---
// This acts as the "wrapper" for every single page. It detects URL changes 
// and triggers the Framer Motion fade-out/fade-in animations.
function RootLayout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    // 4. Use onExitComplete! This waits until the old page is 100% gone, 
    // THEN resets the scroll to the top before the new page fades in.
    <AnimatePresence 
      mode="wait" 
      initial={false}
      onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}
    >
      {outlet && React.cloneElement(outlet, { key: location.pathname })}
    </AnimatePresence>
  );
}

// --- 2. The Modern Data Router ---
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Every route goes through our animation wrapper first
    children: [
      { 
        index: true, 
        element: <PageTransition><HomePage /></PageTransition> 
      },
      { 
        path: "movies", 
        element: <PageTransition><MoviesPage /></PageTransition> 
      },
      { 
        path: "movie/:id", 
        element: <PageTransition><MovieDetailPage /></PageTransition> 
      },
      
      // FIXED: Removed leading slashes and added PageTransition wrappers!
      { 
        path: "shows", 
        element: <PageTransition><ShowsPage /></PageTransition> 
      },
      { 
        path: "show/:id", 
        element: <PageTransition><ShowDetailPage /></PageTransition> 
      },

      // FIXED: Added PageTransition to the Watch pages too!
      { 
        path: "watch/movie/:id", 
        element: <PageTransition><WatchPage /></PageTransition> 
      },
      { 
        path: "watch/tv/:id", 
        element: <PageTransition><WatchPage /></PageTransition> 
      },
    ]
  }
]);

// --- 3. Inject the Router ---
export default function App() {
  // 1. Lazy-initialize the state by checking sessionStorage first!
  const [isReady, setIsReady] = useState(() => {
    // If this returns true, the user has already seen it this session.
    return sessionStorage.getItem('hasSeenSplash') === 'true';
  });

  // 2. Create a handler to fire when the splash screen finishes
  const handleSplashFinish = () => {
    sessionStorage.setItem('hasSeenSplash', 'true'); // Save the memory!
    setIsReady(true); // Reveal the app
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isReady && (
          <SplashScreen onFinish={handleSplashFinish} />
        )}
      </AnimatePresence>

      {isReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <RouterProvider router={router} />
        </motion.div>
      )}
    </>
  );
}