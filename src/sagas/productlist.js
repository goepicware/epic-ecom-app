/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_PRODUCT_LIST, SET_PRODUCT_LIST } from "../actions";
import { apiUrl, uniqueID } from "../components/Settings/Config";
import Axios from "axios";

export const watchGetProductList = function* () {
  yield takeEvery(GET_PRODUCT_LIST, workerGetProductList);
};

function* workerGetProductList(reqData) {
  try {
    const uri =
      apiUrl + "catalogs/listproducts?uniqueID=" + uniqueID + reqData.params;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_PRODUCT_LIST, value: resultArr });
  } catch {
    console.log("Get Product failed");
  }
}
