import axios from "axios";
import { API_URL } from "../../config/env";
import { SongStats, RecentSong } from "../../types/stats.types";

// Create API client for statistics
const statsApiClient = axios.create({
  baseURL: `${API_URL}/api/v1/songs`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
statsApiClient.interceptors.request.use(
  (config) => {
    console.log(
      `📊 Stats API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("📊 Stats API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
statsApiClient.interceptors.response.use(
  (response) => {
    console.log(
      `📊 Stats API Response: ${response.status} ${response.config.url}`
    );
    return response;
  },
  (error) => {
    console.error(
      "📊 Stats API Response Error:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// Statistics API functions
export const statsApi = {
  // Get comprehensive statistics
  getStats: async (): Promise<{ data: SongStats }> => {
    const response = await statsApiClient.get("/stats");
    return response.data;
  },

  // Get recent songs
  getRecentSongs: async (): Promise<{ data: RecentSong[] }> => {
    const response = await statsApiClient.get("/stats/recent");
    return response.data;
  },

  // Get genre-specific statistics
  getGenreStats: async (genre: string): Promise<{ data: any }> => {
    const response = await statsApiClient.get(`/stats/genre/${genre}`);
    return response.data;
  },

  // Get artist-specific statistics
  getArtistStats: async (artist: string): Promise<{ data: any }> => {
    const response = await statsApiClient.get(`/stats/artist/${artist}`);
    return response.data;
  },
};

export default statsApi;
