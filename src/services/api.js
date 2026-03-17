import axios from 'axios';

// Create a custom Axios instance
const tmdbApi = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  params: {
    // This automatically attaches ?api_key=... to the end of EVERY request!
    api_key: import.meta.env.VITE_TMDB_API_KEY, 
  },
});

export default tmdbApi;