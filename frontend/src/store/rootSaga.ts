import { all } from "redux-saga/effects";
import songsSaga from "../features/songs/songsSaga";
import statsSaga from "../features/stats/statsSaga";

// Root saga combines all feature sagas
export default function* rootSaga() {
  yield all([songsSaga(), statsSaga()]);
}
