import storelist from "./storelist";
import storedetails from "./storedetails";
import categorylist from "./categorylist";
import productlist from "./productlist";
import productdetail from "./productdetail";
import cartdetails from "./cartdetails";
import voucherlist from "./voucherlist";
import settings from "./settings";

import listdata from "./listdata";
import detaildata from "./detaildata";
import formpost from "./formpost";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  storelist: storelist,
  storedetails: storedetails,
  categorylist: categorylist,
  productlist: productlist,
  productdetail: productdetail,
  cartdetails: cartdetails,
  voucherlist: voucherlist,
  listdata: listdata,
  detaildata: detaildata,
  formpost: formpost,
  settings: settings,
});

export default rootReducer;
