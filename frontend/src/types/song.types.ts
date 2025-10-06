// Shared types for Songs across the application

export interface Song {
  _id: string;
  title: string;
  artist: string;
  songType: "single" | "album";
  genre: string;
  album?: string; // Optional album name for album type songs
  createdAt: string;
  updatedAt: string;
}

export interface CreateSongRequest {
  title: string;
  artist: string;
  songType: "single" | "album";
  genre: string;
  album?: string; // Optional album name for album type songs
}

export interface UpdateSongRequest {
  title?: string;
  artist?: string;
  songType?: "single" | "album";
  genre?: string;
  album?: string; // Optional album name for album type songs
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  data: T[];
}

export interface SongsState {
  list: Song[];
  currentSong: Song | null;
  loading: {
    fetch: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
}
