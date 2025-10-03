import { all } from "redux-saga/effects";
import songsSaga from "../features/songs/songsSaga";

// Root saga combines all feature sagas
export default function* rootSaga() {
  yield all([songsSaga()]);
}
