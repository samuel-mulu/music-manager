import { call, put, takeLatest, select } from "redux-saga/effects";
import { songsApi } from "./songsApi";
import {
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
} from "./songsSlice";
import { RootState } from "../../store";

// Helper function to extract error message
function getErrorMessage(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
}

// Worker sagas
function* fetchSongsSaga(
  action: ReturnType<typeof fetchSongsRequest>
): Generator<any, any, any> {
  try {
    const params = action.payload || {};
    const response = yield call(songsApi.fetchAll, params);

    yield put(
      fetchSongsSuccess({
        songs: response.data,
        pagination: response.pagination,
      })
    );
  } catch (error: any) {
    const errorMessage = getErrorMessage(error);
    yield put(fetchSongsFailure(errorMessage));
  }
}

function* createSongSaga(
  action: ReturnType<typeof createSongRequest>
): Generator<any, any, any> {
  try {
    const response = yield call(songsApi.create, action.payload);
    yield put(createSongSuccess(response.data));
  } catch (error: any) {
    const errorMessage = getErrorMessage(error);
    yield put(createSongFailure(errorMessage));
  }
}

function* updateSongSaga(
  action: ReturnType<typeof updateSongRequest>
): Generator<any, any, any> {
  try {
    const { id, data } = action.payload;
    const response = yield call(songsApi.update, id, data);
    yield put(updateSongSuccess(response.data));
  } catch (error: any) {
    const errorMessage = getErrorMessage(error);
    yield put(updateSongFailure(errorMessage));
  }
}

function* deleteSongSaga(
  action: ReturnType<typeof deleteSongRequest>
): Generator<any, any, any> {
  try {
    yield call(songsApi.delete, action.payload);
    yield put(deleteSongSuccess(action.payload));
  } catch (error: any) {
    const errorMessage = getErrorMessage(error);
    yield put(deleteSongFailure(errorMessage));
  }
}

function* getSongByIdSaga(
  action: ReturnType<typeof getSongByIdRequest>
): Generator<any, any, any> {
  try {
    const response = yield call(songsApi.getById, action.payload);
    yield put(getSongByIdSuccess(response.data));
  } catch (error: any) {
    const errorMessage = getErrorMessage(error);
    yield put(getSongByIdFailure(errorMessage));
  }
}

// Watcher saga
function* songsSaga() {
  yield takeLatest(fetchSongsRequest.type, fetchSongsSaga);
  yield takeLatest(createSongRequest.type, createSongSaga);
  yield takeLatest(updateSongRequest.type, updateSongSaga);
  yield takeLatest(deleteSongRequest.type, deleteSongSaga);
  yield takeLatest(getSongByIdRequest.type, getSongByIdSaga);
}

export default songsSaga;
