import { create } from 'zustand';

const useMovieStore = create((set) => ({
  activeMovie: null,
  setActiveMovie: (movie) => set({ activeMovie: movie }),
  clearActiveMovie: () => set({ activeMovie: null }),
}));

export default useMovieStore;