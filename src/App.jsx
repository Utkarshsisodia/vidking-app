import React,{ useState } from 'react';
import { createBrowserRouter, RouterProvider, useLocation, useOutlet, Link } from 'react-router-dom';
import {motion, AnimatePresence } from 'framer-motion';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import WatchPage from './pages/WatchPage';
import PageTransition from './components/PageTransition';
import SplashScreen from './components/SplashScreen';

// --- Landing Page Component ---
function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-zinc-950">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
        VidKing Stream
      </h1>
      <p className="text-zinc-400 text-xl md:text-2xl mb-12 max-w-2xl">
        Unlimited movies. Zero friction. Step into the next generation of streaming.
      </p>
      <Link 
        to="/movies" 
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg shadow-red-500/20"
      >
        Enter App
      </Link>
    </div>
  );
}

// --- 1. The Root Layout ---
// This acts as the "wrapper" for every single page. It detects URL changes 
// and triggers the Framer Motion fade-out/fade-in animations.
function RootLayout() {
  const location = useLocation();
  const outlet = useOutlet(); // This grabs whatever page we are currently supposed to be looking at

  return (
    <AnimatePresence mode="wait" initial={false}>
      {/* We use a clever React trick here to inject the current URL as a key into the page. */}
      {/* When the key changes, Framer Motion knows it's time to animate! */}
      {outlet && React.cloneElement(outlet, { key: location.pathname })}
    </AnimatePresence>
  );
}

// --- 2. The Modern Data Router ---
// Instead of <Routes> and <Route>, we define our app as a clean JavaScript array.
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Every route goes through our animation wrapper first
    children: [
      { 
        index: true, 
        element: <PageTransition><LandingPage /></PageTransition> 
      },
      { 
        path: "movies", 
        element: <PageTransition><MoviesPage /></PageTransition> 
      },
      { 
        path: "movie/:id", 
        element: <PageTransition><MovieDetailPage /></PageTransition> 
      },
      { 
        path: "watch/:id", 
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