import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import tmdbApi from '../services/api'; // Import our new custom instance!

// --- 1. TRENDING FETCH ---
export const fetchTrendingMovies = async ({ pageParam = 1 }) => {
  // Look how clean this is now! We just pass the endpoint and the page parameter.
  const response = await tmdbApi.get('/trending/movie/day', {
    params: { page: pageParam }
  });
  return response.data; 
};

export const useTrendingMovies = () => {
  return useInfiniteQuery({
    queryKey: ['trendingMovies'],
    queryFn: fetchTrendingMovies,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) return lastPage.page + 1;
      return undefined;
    },
  });
};


// --- 2. SEARCH FETCH ---
export const fetchSearchResults = async (query) => {
  if (!query) return [];
  // Axios automatically handles the URI encoding for the query parameter!
  const response = await tmdbApi.get('/search/movie', {
    params: { query } 
  });
  return response.data.results;
};

export const useSearchMovies = (query) => {
  return useQuery({
    queryKey: ['searchMovies', query],
    queryFn: () => fetchSearchResults(query),
    enabled: !!query?.trim(), 
    staleTime: 1000 * 60 * 5, 
  });
};


// --- 3. MOVIE DETAILS FETCH ---
export const fetchMovieDetails = async (id) => {
  // Just the endpoint. The base URL and API key are injected automatically.
  const response = await tmdbApi.get(`/movie/${id}`);
  return response.data;
};

export const useMovieDetails = (id) => {
  return useQuery({
    queryKey: ['movieDetails', String(id)],
    queryFn: () => fetchMovieDetails(id),
    enabled: !!id, 
  });
};