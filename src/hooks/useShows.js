import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import tmdbApi from '../services/api';

// 1. Fetch the list (Trending or Filtered)
export const fetchShowsList = async ({ pageParam = 1, sortBy }) => {
  if (!sortBy) {
    const response = await tmdbApi.get('/trending/tv/day', {
      params: { page: pageParam }
    });
    return response.data;
  }
  
  const response = await tmdbApi.get('/discover/tv', {
    params: { 
      page: pageParam,
      sort_by: sortBy,
      'vote_count.gte': 300, 
    }
  });
  return response.data; 
};

export const useShowsList = (sortBy) => {
  return useInfiniteQuery({
    queryKey: ['showsList', sortBy || 'trending'], 
    queryFn: ({ pageParam }) => fetchShowsList({ pageParam, sortBy }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) return lastPage.page + 1;
      return undefined;
    },
  });
};

// 2. We will need this for the instant pre-fetch on hover!
export const fetchShowDetails = async (id) => {
  const response = await tmdbApi.get(`/tv/${id}`);
  return response.data;
};

// --- 3. SHOW DETAILS FETCH ---
export const useShowDetails = (id) => {
  return useQuery({
    queryKey: ['showDetails', String(id)],
    queryFn: () => fetchShowDetails(id),
    enabled: !!id, // Only fetch if we have an ID from the URL
    staleTime: 1000 * 60 * 30, // Keep cached for 30 minutes
  });
};

// --- 4. SIMILAR / RECOMMENDED SHOWS ---
export const fetchSimilarShows = async (id) => {
  const response = await tmdbApi.get(`/tv/${id}/recommendations`);
  return response.data.results; 
};

export const useSimilarShows = (id) => {
  return useQuery({
    queryKey: ['similarShows', String(id)],
    queryFn: () => fetchSimilarShows(id),
    enabled: !!id, 
    staleTime: 1000 * 60 * 30, 
  });
};