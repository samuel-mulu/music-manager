import { call, put, takeEvery } from "redux-saga/effects";
import { statsApi } from "./statsApi";
import { SongStats, RecentSong } from "../../types/stats.types";

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
function* fetchStatsSaga() {
  try {
    console.log("📊 Fetching statistics...");
    const response: { data: SongStats } = yield call(statsApi.getStats);

    console.log("📊 Statistics fetched successfully:", response.data);
    yield put({
      type: "stats/fetchStatsSuccess",
      payload: response.data,
    });
  } catch (error: any) {
    console.error("📊 Error fetching statistics:", error);
    const errorMessage = getErrorMessage(error);

    yield put({
      type: "stats/fetchStatsFailure",
      payload: errorMessage,
    });
  }
}

// Fetch recent songs saga
function* fetchRecentSongsSaga() {
  try {
    console.log("🎵 Fetching recent songs...");
    const response: { data: RecentSong[] } = yield call(
      statsApi.getRecentSongs
    );

    console.log("🎵 Recent songs fetched successfully:", response.data);

    yield put({
      type: "stats/fetchRecentSongsSuccess",
      payload: response.data,
    });
  } catch (error: any) {
    console.error("🎵 Error fetching recent songs:", error);
    const errorMessage = getErrorMessage(error);

    yield put({
      type: "stats/fetchRecentSongsFailure",
      payload: errorMessage,
    });
  }
}

// Root stats saga
export default function* statsSaga() {
  yield takeEvery("stats/fetchStatsRequest", fetchStatsSaga);
  yield takeEvery("stats/fetchRecentSongsRequest", fetchRecentSongsSaga);
}
