/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_CART_DETAIL, SET_CART_DETAIL } from "../actions";
import { apiUrl, uniqueID } from "../components/Settings/Config";
import { getReferenceID } from "../components/Settings/SettingHelper";

import Axios from "axios";
import cookie from "react-cookies";
export const watchGetCartDetails = function* () {
  yield takeEvery(GET_CART_DETAIL, workerGetCartDetails);
};

function* workerGetCartDetails() {
  const seletedAvilablityId = cookie.load("availability") ?? "";
  const customerID = localStorage.getItem('customerID') ?? '';
  const referenceID = (customerID==="") ? getReferenceID() : '';  
  try {
    const uri = `${apiUrl}cart?uniqueID=${uniqueID}&customerID=${customerID}&referenceID=${referenceID}&availabilityID=${seletedAvilablityId}`;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_CART_DETAIL, value: resultArr });
  } catch {
    yield put({ type: SET_CART_DETAIL, value: [{'status':'error'}] });
    console.log("Get category failed");
  }
}
