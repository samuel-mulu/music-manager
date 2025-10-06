import { call, put, takeEvery, fork, take, select } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";
import socketService from "../../services/socketService";
import {
  createSongSuccess,
  updateSongSuccess,
  deleteSongSuccess,
  connectSocket,
  disconnectSocket,
} from "./songsSlice";

// Create event channel for socket events
function createSocketChannel() {
  return eventChannel((emit) => {
    // Connect to socket
    const socket = socketService.connect();

    // Join songs room
    socketService.joinSongsRoom();

    // Set up event listeners
    const handleSongCreated = (data: any) => {
      console.log("🎵 Socket: Song created", data);
      emit({ type: "SOCKET_SONG_CREATED", payload: data });
    };

    const handleSongUpdated = (data: any) => {
      console.log("🎵 Socket: Song updated", data);
      emit({ type: "SOCKET_SONG_UPDATED", payload: data });
    };

    const handleSongDeleted = (data: any) => {
      console.log("🎵 Socket: Song deleted", data);
      emit({ type: "SOCKET_SONG_DELETED", payload: data });
    };

    const handleDisconnect = () => {
      console.log("🔌 Socket: Disconnected");
      emit(END);
    };

    // Register event listeners
    socketService.onSongCreated(handleSongCreated);
    socketService.onSongUpdated(handleSongUpdated);
    socketService.onSongDeleted(handleSongDeleted);

    socket.on("disconnect", handleDisconnect);

    // Cleanup function
    return () => {
      socketService.offSongCreated(handleSongCreated);
      socketService.offSongUpdated(handleSongUpdated);
      socketService.offSongDeleted(handleSongDeleted);
      socket.off("disconnect", handleDisconnect);
      socketService.leaveSongsRoom();
    };
  });
}

// Handle socket events
function* handleSocketEvents(): Generator<any, void, any> {
  const socketChannel = yield call(createSocketChannel);

  try {
    while (true) {
      const event = yield take(socketChannel);

      switch (event.type) {
        case "SOCKET_SONG_CREATED":
          // Check if song already exists to prevent duplicates
          // This handles both API-created songs and socket-created songs
          const existingSong = yield select((state: any) =>
            state.songs.list.find(
              (song: any) => song._id === event.payload.song._id
            )
          );

          if (!existingSong) {
            console.log(
              "📝 Adding new song from socket:",
              event.payload.song.title
            );
            yield put(createSongSuccess(event.payload.song));
          } else {
            console.log(
              "⚠️ Song already exists, skipping socket creation:",
              event.payload.song.title
            );
          }
          break;

        case "SOCKET_SONG_UPDATED":
          // Only update song if it exists in our list (prevents duplicates)
          const existingUpdatedSong = yield select((state: any) =>
            state.songs.list.find(
              (song: any) => song._id === event.payload.song._id
            )
          );
          if (existingUpdatedSong) {
            yield put(updateSongSuccess(event.payload.song));
          }
          break;

        case "SOCKET_SONG_DELETED":
          // Only delete song if it exists in our list (prevents errors)
          const existingDeletedSong = yield select((state: any) =>
            state.songs.list.find(
              (song: any) => song._id === event.payload.songId
            )
          );
          if (existingDeletedSong) {
            yield put(deleteSongSuccess(event.payload.songId));
          }
          break;

        default:
          console.log("Unknown socket event:", event.type);
      }
    }
  } finally {
    socketChannel.close();
  }
}

// Connect socket saga
function* connectSocketSaga(): Generator<any, void, any> {
  try {
    console.log("🔌 Connecting to Socket.IO...");
    const socket = socketService.connect();

    // Wait for connection
    yield call(
      () =>
        new Promise((resolve) => {
          if (socket.connected) {
            resolve(true);
          } else {
            socket.on("connect", () => resolve(true));
          }
        })
    );

    console.log("✅ Socket.IO connected successfully");

    // Start listening for events
    yield fork(handleSocketEvents);
  } catch (error) {
    console.error("❌ Socket.IO connection failed:", error);
  }
}

// Disconnect socket saga
function* disconnectSocketSaga(): Generator<any, void, any> {
  try {
    console.log("🔌 Disconnecting from Socket.IO...");
    socketService.disconnect();
    console.log("✅ Socket.IO disconnected successfully");
    yield; // Add yield to satisfy require-yield rule
  } catch (error) {
    console.error("❌ Socket.IO disconnection failed:", error);
  }
}

// Root socket saga
export default function* songsSocketSaga(): Generator<any, void, any> {
  yield takeEvery(connectSocket.type, connectSocketSaga);
  yield takeEvery(disconnectSocket.type, disconnectSocketSaga);
}
