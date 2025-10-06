import { call, put, takeEvery } from "redux-saga/effects";
import { statsApi } from "./statsApi";
import { RecentSong } from "../../types/stats.types";

// Helper function to get error message
function getErrorMessage(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
}

// Fetch statistics saga
function* fetchStatsSaga(): Generator<any, void, any> {
  try {
    const response: any = yield call(statsApi.getStats);

    // Extract the actual data from the response
    // Based on your backend response: { success: true, data: { totals: {...}, distribution: { songsPerGenre: [...], ... } } }
    const statsData = response.data;

    if (!statsData) {
      throw new Error("No data received from statistics API");
    }

    yield put({
      type: "stats/fetchStatsSuccess",
      payload: statsData,
    });
  } catch (error: any) {
    const errorMessage = getErrorMessage(error);

    yield put({
      type: "stats/fetchStatsFailure",
      payload: errorMessage,
    });
  }
}

// Fetch recent songs saga
function* fetchRecentSongsSaga(): Generator<any, void, any> {
  try {
    console.log("🎵 Fetching recent songs...");
    const response: { data: RecentSong[] } = yield call(
      statsApi.getRecentSongs
    );

    console.log(
      "📊 Recent songs received:",
      response.data.map((song) => ({
        title: song.title,
        artist: song.artist,
        hasDuration: !!song.duration,
        duration: song.duration,
      }))
    );

    yield put({
      type: "stats/fetchRecentSongsSuccess",
      payload: response.data,
    });
  } catch (error: any) {
    const errorMessage = getErrorMessage(error);
    console.error("❌ Fetch recent songs failed:", errorMessage);

    yield put({
      type: "stats/fetchRecentSongsFailure",
      payload: errorMessage,
    });
  }
}

// Silent fetch statistics saga (no loading state)
function* fetchStatsSilentSaga(): Generator<any, void, any> {
  try {
    const response: any = yield call(statsApi.getStats);
    const statsData = response.data;

    if (!statsData) {
      throw new Error("No data received from statistics API");
    }

    yield put({
      type: "stats/fetchStatsSuccess",
      payload: statsData,
    });
  } catch (error: any) {
    const errorMessage = getErrorMessage(error);
    console.error("Silent stats fetch failed:", errorMessage);
    // Don't dispatch error for silent fetch to avoid UI disruption
  }
}

// Root stats saga
export default function* statsSaga(): Generator<any, void, any> {
  yield takeEvery("stats/fetchStatsRequest", fetchStatsSaga);
  yield takeEvery("stats/fetchStatsRequestSilent", fetchStatsSilentSaga);
  yield takeEvery("stats/fetchRecentSongsRequest", fetchRecentSongsSaga);
}
