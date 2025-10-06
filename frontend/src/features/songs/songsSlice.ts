import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Song,
  SongsState,
  CreateSongRequest,
  UpdateSongRequest,
} from "../../types/song.types";

const initialState: SongsState = {
  list: [],
  currentSong: null,
  loading: {
    fetch: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
  pagination: null,
};

const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set current song
    setCurrentSong: (state, action: PayloadAction<Song | null>) => {
      state.currentSong = action.payload;
    },

    // Fetch songs
    fetchSongsRequest: (state, action: PayloadAction<any>) => {
      state.loading.fetch = true;
      state.error = null;
    },
    fetchSongsSuccess: (
      state,
      action: PayloadAction<{ songs: Song[]; pagination?: any }>
    ) => {
      state.list = action.payload.songs;
      state.loading.fetch = false;
      if (action.payload.pagination) {
        console.log("📊 Pagination data received:", action.payload.pagination);
        state.pagination = action.payload.pagination;
      } else {
        console.log("⚠️ No pagination data received from API");
      }
    },
    fetchSongsFailure: (state, action: PayloadAction<string>) => {
      state.loading.fetch = false;
      state.error = action.payload;
    },

    // Create song
    createSongRequest: (state, _action: PayloadAction<CreateSongRequest>) => {
      state.loading.create = true;
      state.error = null;
    },
    createSongSuccess: (state, action: PayloadAction<Song>) => {
      // Check if song already exists to prevent duplicates
      const existingSongIndex = state.list.findIndex(
        (song) => song._id === action.payload._id
      );

      if (existingSongIndex === -1) {
        state.list.unshift(action.payload); // Add to beginning only if not exists
      }
      state.loading.create = false;
    },
    createSongFailure: (state, action: PayloadAction<string>) => {
      state.loading.create = false;
      state.error = action.payload;
    },

    // Update song
    updateSongRequest: (
      state,
      _action: PayloadAction<{ id: string; data: UpdateSongRequest }>
    ) => {
      state.loading.update = true;
      state.error = null;
    },
    updateSongSuccess: (state, action: PayloadAction<Song>) => {
      const index = state.list.findIndex(
        (song) => song._id === action.payload._id
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      if (state.currentSong?._id === action.payload._id) {
        state.currentSong = action.payload;
      }
      state.loading.update = false;
    },
    updateSongFailure: (state, action: PayloadAction<string>) => {
      state.loading.update = false;
      state.error = action.payload;
    },

    // Delete song
    deleteSongRequest: (state, _action: PayloadAction<string>) => {
      state.loading.delete = true;
      state.error = null;
    },
    deleteSongSuccess: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((song) => song._id !== action.payload);
      if (state.currentSong?._id === action.payload) {
        state.currentSong = null;
      }
      state.loading.delete = false;
    },
    deleteSongFailure: (state, action: PayloadAction<string>) => {
      state.loading.delete = false;
      state.error = action.payload;
    },

    // Get single song
    getSongByIdRequest: (state, _action: PayloadAction<string>) => {
      state.loading.fetch = true;
      state.error = null;
    },
    getSongByIdSuccess: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
      state.loading.fetch = false;
    },
    getSongByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading.fetch = false;
      state.error = action.payload;
    },

    // Socket connection actions
    connectSocket: (state) => {
      // Socket connection is handled in saga
    },
    disconnectSocket: (state) => {
      // Socket disconnection is handled in saga
    },
  },
});

export const {
  clearError,
  setCurrentSong,
  fetchSongsRequest,
  fetchSongsSuccess,
  fetchSongsFailure,
  createSongRequest,
  createSongSuccess,
  createSongFailure,
  updateSongRequest,
  updateSongSuccess,
  updateSongFailure,
  deleteSongRequest,
  deleteSongSuccess,
  deleteSongFailure,
  getSongByIdRequest,
  getSongByIdSuccess,
  getSongByIdFailure,
  connectSocket,
  disconnectSocket,
} = songsSlice.actions;

export default songsSlice.reducer;
