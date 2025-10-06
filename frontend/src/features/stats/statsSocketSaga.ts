import { call, takeEvery } from "redux-saga/effects";
import socketService from "../../services/socketService";
import { connectStatsSocket, disconnectStatsSocket } from "./statsSlice";

// Direct stats update handlers
let statsCleanup: (() => void) | null = null;

// Setup direct stats socket listeners
function setupStatsSocketListeners() {
  console.log("📊 Setting up direct stats socket listeners");

  // Song created handler
  const handleSongCreated = (data: any) => {
    console.log("📊 Stats: Song created, updating stats", data);
    console.log("📊 Stats: Song data:", {
      title: data.song?.title,
      artist: data.song?.artist,
      genre: data.song?.genre,
      songType: data.song?.songType,
    });

    // Trigger immediate stats refresh
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("refresh-stats"));
    }, 100);
  };

  // Song updated handler
  const handleSongUpdated = (data: any) => {
    console.log("📊 Stats: Song updated, updating stats", data);
    console.log("📊 Stats: Updated song data:", {
      title: data.song?.title,
      artist: data.song?.artist,
      genre: data.song?.genre,
      songType: data.song?.songType,
    });

    // Trigger immediate stats refresh
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("refresh-stats"));
    }, 100);
  };

  // Song deleted handler
  const handleSongDeleted = (data: any) => {
    console.log("📊 Stats: Song deleted, updating stats", data);
    console.log("📊 Stats: Deleted song data:", {
      songId: data.songId,
      song: data.song,
    });

    // Trigger immediate stats refresh
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("refresh-stats"));
    }, 100);
  };

  // Register event listeners
  socketService.onSongCreated(handleSongCreated);
  socketService.onSongUpdated(handleSongUpdated);
  socketService.onSongDeleted(handleSongDeleted);

  // Return cleanup function
  const cleanup = () => {
    console.log("📊 Cleaning up direct stats socket listeners");
    socketService.offSongCreated(handleSongCreated);
    socketService.offSongUpdated(handleSongUpdated);
    socketService.offSongDeleted(handleSongDeleted);
  };

  statsCleanup = cleanup;
  return cleanup;
}

// Helper function to calculate updated stats from song changes
function calculateUpdatedStats(
  currentStats: any,
  changeType: "created" | "updated" | "deleted",
  songData: any
) {
  if (!currentStats) return null;

  const updatedStats = { ...currentStats };

  // Update totals
  if (changeType === "created") {
    updatedStats.totals = {
      ...updatedStats.totals,
      songs: (updatedStats.totals?.songs || 0) + 1,
      singleSongs:
        songData.songType === "single"
          ? (updatedStats.totals?.singleSongs || 0) + 1
          : updatedStats.totals?.singleSongs || 0,
      albumSongs:
        songData.songType === "album"
          ? (updatedStats.totals?.albumSongs || 0) + 1
          : updatedStats.totals?.albumSongs || 0,
    };
  } else if (changeType === "deleted") {
    updatedStats.totals = {
      ...updatedStats.totals,
      songs: Math.max((updatedStats.totals?.songs || 0) - 1, 0),
      singleSongs:
        songData.songType === "single"
          ? Math.max((updatedStats.totals?.singleSongs || 0) - 1, 0)
          : updatedStats.totals?.singleSongs || 0,
      albumSongs:
        songData.songType === "album"
          ? Math.max((updatedStats.totals?.albumSongs || 0) - 1, 0)
          : updatedStats.totals?.albumSongs || 0,
    };
  }

  // Update distribution data
  if (updatedStats.distribution) {
    // Update songs per genre
    if (updatedStats.distribution.songsPerGenre) {
      const genreIndex = updatedStats.distribution.songsPerGenre.findIndex(
        (g: any) => g._id === songData.genre
      );

      if (changeType === "created") {
        if (genreIndex >= 0) {
          updatedStats.distribution.songsPerGenre[genreIndex] = {
            ...updatedStats.distribution.songsPerGenre[genreIndex],
            totalCount:
              (updatedStats.distribution.songsPerGenre[genreIndex].totalCount ||
                0) + 1,
            singleCount:
              songData.songType === "single"
                ? (updatedStats.distribution.songsPerGenre[genreIndex]
                    .singleCount || 0) + 1
                : updatedStats.distribution.songsPerGenre[genreIndex]
                    .singleCount || 0,
            albumCount:
              songData.songType === "album"
                ? (updatedStats.distribution.songsPerGenre[genreIndex]
                    .albumCount || 0) + 1
                : updatedStats.distribution.songsPerGenre[genreIndex]
                    .albumCount || 0,
          };
        } else {
          // Add new genre
          updatedStats.distribution.songsPerGenre.push({
            _id: songData.genre,
            totalCount: 1,
            singleCount: songData.songType === "single" ? 1 : 0,
            albumCount: songData.songType === "album" ? 1 : 0,
          });
        }
      } else if (changeType === "deleted") {
        if (genreIndex >= 0) {
          const genre = updatedStats.distribution.songsPerGenre[genreIndex];
          genre.totalCount = Math.max((genre.totalCount || 0) - 1, 0);
          genre.singleCount =
            songData.songType === "single"
              ? Math.max((genre.singleCount || 0) - 1, 0)
              : genre.singleCount || 0;
          genre.albumCount =
            songData.songType === "album"
              ? Math.max((genre.albumCount || 0) - 1, 0)
              : genre.albumCount || 0;

          // Remove genre if no songs left
          if (genre.totalCount === 0) {
            updatedStats.distribution.songsPerGenre.splice(genreIndex, 1);
          }
        }
      }
    }

    // Update songs per artist
    if (updatedStats.distribution.songsPerArtist) {
      const artistIndex = updatedStats.distribution.songsPerArtist.findIndex(
        (a: any) => a.artist === songData.artist || a._id === songData.artist
      );

      if (changeType === "created") {
        if (artistIndex >= 0) {
          updatedStats.distribution.songsPerArtist[artistIndex] = {
            ...updatedStats.distribution.songsPerArtist[artistIndex],
            songCount:
              (updatedStats.distribution.songsPerArtist[artistIndex]
                .songCount || 0) + 1,
            singleCount:
              songData.songType === "single"
                ? (updatedStats.distribution.songsPerArtist[artistIndex]
                    .singleCount || 0) + 1
                : updatedStats.distribution.songsPerArtist[artistIndex]
                    .singleCount || 0,
            albumCount:
              songData.songType === "album"
                ? (updatedStats.distribution.songsPerArtist[artistIndex]
                    .albumCount || 0) + 1
                : updatedStats.distribution.songsPerArtist[artistIndex]
                    .albumCount || 0,
          };
        } else {
          // Add new artist
          updatedStats.distribution.songsPerArtist.push({
            _id: songData.artist,
            artist: songData.artist,
            songCount: 1,
            singleCount: songData.songType === "single" ? 1 : 0,
            albumCount: songData.songType === "album" ? 1 : 0,
          });
        }
      } else if (changeType === "deleted") {
        if (artistIndex >= 0) {
          const artist = updatedStats.distribution.songsPerArtist[artistIndex];
          artist.songCount = Math.max((artist.songCount || 0) - 1, 0);
          artist.singleCount =
            songData.songType === "single"
              ? Math.max((artist.singleCount || 0) - 1, 0)
              : artist.singleCount || 0;
          artist.albumCount =
            songData.songType === "album"
              ? Math.max((artist.albumCount || 0) - 1, 0)
              : artist.albumCount || 0;

          // Remove artist if no songs left
          if (artist.songCount === 0) {
            updatedStats.distribution.songsPerArtist.splice(artistIndex, 1);
          }
        }
      }
    }

    // Update songs per type
    if (updatedStats.distribution.songsPerType) {
      const typeIndex = updatedStats.distribution.songsPerType.findIndex(
        (t: any) => t._id === songData.songType
      );

      if (changeType === "created") {
        if (typeIndex >= 0) {
          updatedStats.distribution.songsPerType[typeIndex] = {
            ...updatedStats.distribution.songsPerType[typeIndex],
            count:
              (updatedStats.distribution.songsPerType[typeIndex].count || 0) +
              1,
          };
        } else {
          // Add new type
          updatedStats.distribution.songsPerType.push({
            _id: songData.songType,
            count: 1,
          });
        }
      } else if (changeType === "deleted") {
        if (typeIndex >= 0) {
          const type = updatedStats.distribution.songsPerType[typeIndex];
          type.count = Math.max((type.count || 0) - 1, 0);

          // Remove type if no songs left
          if (type.count === 0) {
            updatedStats.distribution.songsPerType.splice(typeIndex, 1);
          }
        }
      }
    }
  }

  // Update metadata
  updatedStats.metadata = {
    ...updatedStats.metadata,
    generatedAt: new Date().toISOString(),
  };

  return updatedStats;
}

// This function is no longer needed with the simplified approach

// Connect stats socket saga (reuses existing connection)
function* connectStatsSocketSaga(): Generator<any, void, any> {
  yield; // Add yield to satisfy require-yield rule
  try {
    console.log("📊 Setting up stats socket listeners...");

    // Check if socket is already connected
    const socket = socketService.getSocket();
    if (socket && socket.connected) {
      console.log("✅ Using existing Socket.IO connection for stats");
      // Setup direct listeners immediately
      setupStatsSocketListeners();
    } else {
      console.log("📊 Waiting for existing socket connection...");
      // Wait for existing connection to be established
      yield call(
        () =>
          new Promise((resolve) => {
            const checkConnection = setInterval(() => {
              const existingSocket = socketService.getSocket();
              if (existingSocket && existingSocket.connected) {
                clearInterval(checkConnection);
                console.log("✅ Found existing Socket.IO connection for stats");
                setupStatsSocketListeners();
                resolve(true);
              }
            }, 100);
          })
      );
    }
  } catch (error) {
    console.error("❌ Stats Socket.IO setup failed:", error);
  }
}

// Disconnect stats socket saga (only cleans up listeners, doesn't disconnect shared socket)
function* disconnectStatsSocketSaga(): Generator<any, void, any> {
  yield; // Add yield to satisfy require-yield rule
  try {
    console.log("📊 Cleaning up stats socket listeners...");
    // Clean up the direct listeners
    if (statsCleanup) {
      statsCleanup();
      statsCleanup = null;
    }
    console.log("✅ Stats socket listeners cleaned up");
  } catch (error) {
    console.error("❌ Stats socket cleanup failed:", error);
  }
}

// Root stats socket saga
export default function* statsSocketSaga(): Generator<any, void, any> {
  yield takeEvery("stats/connectStatsSocket", connectStatsSocketSaga);
  yield takeEvery("stats/disconnectStatsSocket", disconnectStatsSocketSaga);
}
