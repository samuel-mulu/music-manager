import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SongStats, StatsState, RecentSong } from "../../types/stats.types";

// Action creators for Redux-Saga
export const fetchStatsRequest = () => ({
  type: "stats/fetchStatsRequest",
});

export const fetchStatsSuccess = (data: SongStats) => ({
  type: "stats/fetchStatsSuccess",
  payload: data,
});

export const fetchStatsFailure = (error: string) => ({
  type: "stats/fetchStatsFailure",
  payload: error,
});

export const fetchRecentSongsRequest = () => ({
  type: "stats/fetchRecentSongsRequest",
});

export const fetchRecentSongsSuccess = (songs: RecentSong[]) => ({
  type: "stats/fetchRecentSongsSuccess",
  payload: songs,
});

export const fetchRecentSongsFailure = (error: string) => ({
  type: "stats/fetchRecentSongsFailure",
  payload: error,
});

// Initial state
const initialState: StatsState = {
  data: null,
  recentSongs: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Statistics slice
const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    clearStatsError: (state) => {
      state.error = null;
    },
    clearStats: (state) => {
      state.data = null;
      state.recentSongs = [];
      state.error = null;
      state.lastUpdated = null;
    },
    fetchStatsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStatsSuccess: (state, action: PayloadAction<SongStats>) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
      state.lastUpdated = new Date().toISOString();
    },
    fetchStatsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchRecentSongsRequest: (state) => {
      // Don't set loading to true for recent songs to avoid UI blocking
    },
    fetchRecentSongsSuccess: (state, action: PayloadAction<RecentSong[]>) => {
      state.recentSongs = action.payload;
    },
    fetchRecentSongsFailure: (state, action: PayloadAction<string>) => {
      // Don't set error for recent songs to avoid blocking main stats
      console.error("Failed to fetch recent songs:", action.payload);
    },
  },
});

// Export actions
export const {
  clearStatsError,
  clearStats,
  fetchStatsRequest: fetchStatsRequestAction,
  fetchStatsSuccess: fetchStatsSuccessAction,
  fetchStatsFailure: fetchStatsFailureAction,
  fetchRecentSongsRequest: fetchRecentSongsRequestAction,
  fetchRecentSongsSuccess: fetchRecentSongsSuccessAction,
  fetchRecentSongsFailure: fetchRecentSongsFailureAction,
} = statsSlice.actions;

// Export reducer
export default statsSlice.reducer;
