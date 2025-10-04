import axios, { AxiosResponse } from "axios";
import {
  Song,
  CreateSongRequest,
  UpdateSongRequest,
  ApiResponse,
  PaginatedResponse,
} from "../../types/song.types";
import { API_URL } from "../../config/env";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1/songs`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config: any) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: any) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: any) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: any) => {
    console.error("Response Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const songsApi = {
  // Fetch all songs with optional pagination and search
  fetchAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    fields?: string;
    genre?: string;
    songType?: string;
  }): Promise<PaginatedResponse<Song>> => {
    const response: AxiosResponse<PaginatedResponse<Song>> =
      await apiClient.get("/", { params });
    return response.data;
  },

  // Get single song by ID
  getById: async (id: string): Promise<ApiResponse<Song>> => {
    const response: AxiosResponse<ApiResponse<Song>> = await apiClient.get(
      `/${id}`
    );
    return response.data;
  },

  // Create new song
  create: async (song: CreateSongRequest): Promise<ApiResponse<Song>> => {
    const response: AxiosResponse<ApiResponse<Song>> = await apiClient.post(
      "/",
      song
    );
    return response.data;
  },

  // Update existing song
  update: async (
    id: string,
    song: UpdateSongRequest
  ): Promise<ApiResponse<Song>> => {
    const response: AxiosResponse<ApiResponse<Song>> = await apiClient.put(
      `/${id}`,
      song
    );
    return response.data;
  },

  // Delete song
  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response: AxiosResponse<ApiResponse<{ message: string }>> =
      await apiClient.delete(`/${id}`);
    return response.data;
  },

  // Get song statistics
  getStats: async (): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(
      "/stats"
    );
    return response.data;
  },

  // Get recent songs
  getRecent: async (): Promise<ApiResponse<Song[]>> => {
    const response: AxiosResponse<ApiResponse<Song[]>> = await apiClient.get(
      "/stats/recent"
    );
    return response.data;
  },
};
