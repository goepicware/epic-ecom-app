/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_GLOBAL_SETTINGS, SET_GLOBAL_SETTINGS } from "../actions";
import {
  apiUrl,
  deliveryId,
  pickupId,
  uniqueID
} from "../components/Settings/Config";
import cookie from "react-cookies";
import Axios from "axios";

export const watchGetSettings = function* () {
  yield takeEvery(GET_GLOBAL_SETTINGS, workerGetSettings);
};

function* workerGetSettings() {
  try {
    var availabilityId =
      cookie.load("defaultAvilablityId") === undefined ||
      cookie.load("defaultAvilablityId") === ""
        ? ""
        : cookie.load("defaultAvilablityId");
    var orderPostalCode =
      cookie.load("orderPostalCode") === undefined ||
      cookie.load("orderPostalCode") === ""
        ? ""
        : cookie.load("orderPostalCode");
    var orderOutletId =
      cookie.load("orderOutletId") === undefined ||
      cookie.load("orderOutletId") === ""
        ? ""
        : cookie.load("orderOutletId");
    var posCdParm =
      orderPostalCode !== "" ? "&postal_code=" + orderPostalCode : "";
    var avltyParm =
      availabilityId !== "" ? "&availability=" + availabilityId : "";
    var addCond = orderOutletId !== "" ? "&outletID=" + orderOutletId : "";

    const customerID = localStorage.getItem('customerID')??'';
    if(customerID!=="") {
      addCond+=`&customerID=${customerID}`;
    }
    const uri =
      apiUrl +
      "settings/getSettings?uniqueID=" +
      uniqueID +
      avltyParm +
      posCdParm +
      addCond;

    const result = yield call(Axios.get, uri);
    cookie.save("deliveryOption", "No", {
      path: "/",
    });
    cookie.save("pickupOption", "No", {
      path: "/",
    });
    if (result.data.status === "ok") {
      var resultSet = result.data.result_set;

     /*  var availability = !("availability" in resultSet)
        ? Array()
        : resultSet.availability;
      if (Object.keys(availability).length > 0) {
        var availabilityLen = availability.length;
        for (var i = 0; i < availabilityLen; i++) {
          if (availability[i].availability_id === deliveryId) {
            cookie.save("deliveryOption", "Yes", {
              path: "/",
            });
          }
          if (availability[i].availability_id === pickupId) {
            cookie.save("pickupOption", "Yes", {
              path: "/",
            });
          }
        }
      } */
    }
   /*  availabilityId = availabilityId !== "" ? availabilityId : deliveryId;
    cookie.save("defaultAvilablityId", availabilityId, {
      path: "/",
    }); */
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_GLOBAL_SETTINGS, value: resultArr });
  } catch (e) {
    console.log(e, "Get Settings Failed");
  }
}
