// Statistics Types for Song Management System

export interface SongStats {
  totals: {
    songs: number;
    artists: number;
    genres: number;
    singleSongs: number;
    albumSongs: number;
  };
  distribution: {
    songsPerGenre: Array<{
      _id: string;
      totalCount: number;
      singleCount: number;
      albumCount: number;
      genre: string;
    }>;
    songsPerArtist: Array<{
      _id: string;
      songCount: number;
      singleCount: number;
      albumCount: number;
      artist: string;
    }>;
    songsPerType: Array<{
      _id: string | null;
      count: number;
    }>;
  };
  insights?: {
    topGenre: { genre: string; totalCount: number };
    topArtist: { artist: string; songCount: number };
    averageSongsPerArtist: number;
    averageSongsPerGenre: number;
    recentActivity: ActivityStats[];
  };
  metadata?: {
    generatedAt: string;
    dataRange: {
      from: { createdAt: string } | null;
      to: { createdAt: string } | null;
    };
  };
}

export interface GenreStats {
  genre: string;
  totalCount: number;
  singleCount: number;
  albumCount: number;
  uniqueArtists: number;
  percentage: number;
}

export interface ArtistStats {
  artist: string;
  songCount: number;
  singleCount: number;
  albumCount: number;
  uniqueGenres: number;
  percentage: number;
  songs: Array<{
    title: string;
    type: string;
    genre: string;
  }>;
}

export interface TypeStats {
  type: string;
  count: number;
  uniqueGenres: number;
  uniqueArtists: number;
}

export interface ActivityStats {
  _id: {
    year: number;
    month: number;
    day: number;
  };
  count: number;
}

// Recent song interface
export interface RecentSong {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  duration?: number; // Made optional since backend doesn't provide this field
  releaseDate?: string; // Made optional since backend doesn't provide this field
  createdAt: string;
  updatedAt: string;
}

export interface StatsState {
  data: SongStats | null;
  recentSongs: RecentSong[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Chart data interfaces
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface PieChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }>;
}

// Filter options for statistics
export interface StatsFilters {
  dateRange?: {
    from: Date;
    to: Date;
  };
  genre?: string;
  artist?: string;
  songType?: "single" | "album";
}
