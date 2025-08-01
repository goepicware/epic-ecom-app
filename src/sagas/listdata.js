/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_LISTDATA, SET_LISTDATA } from "../actions";
import Axios from "axios";

export const watchGetListData = function* () {
  yield takeEvery(GET_LISTDATA, workerGetListData);
};

function* workerGetListData(reqData) {
  try {
    const uri = reqData.datas.url + "?" + reqData.datas.params;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_LISTDATA, value: resultArr });
  } catch {
    console.log("Get data failed");
  }
}
