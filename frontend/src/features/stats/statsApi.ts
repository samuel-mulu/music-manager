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

// Request interceptor
statsApiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
statsApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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
};

export default statsApi;
