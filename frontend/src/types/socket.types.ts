// Socket.IO Event Types

export interface SocketSongData {
  _id: string;
  title: string;
  artist: string;
  songType: "single" | "album";
  genre: string;
  album?: string; // Optional album name for album type songs
  createdAt: string;
  updatedAt: string;
}

export interface SocketSongEvent {
  song: SocketSongData;
}

export interface SocketSongDeletedEvent {
  songId: string;
  song?: SocketSongData;
}

export interface SocketStatsEvent {
  type: "song-created" | "song-updated" | "song-deleted";
  data: SocketSongEvent | SocketSongDeletedEvent;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

// Pagination Types
export interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  total: number;
}

// Genre Distribution Types
export interface GenreDistribution {
  _id: string;
  totalCount: number;
  singleCount: number;
  albumCount: number;
  genre?: string;
}

// Artist Distribution Types
export interface ArtistDistribution {
  _id: string;
  songCount: number;
  singleCount: number;
  albumCount: number;
  artist: string;
}

// Song Type Distribution Types
export interface SongTypeDistribution {
  _id: string | null;
  count: number;
}
