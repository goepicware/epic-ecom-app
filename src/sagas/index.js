/* eslint-disable */
import { all } from "redux-saga/effects";
import { watchGetStoreList } from "./storelist";
import { watchGetStoreDetails } from "./storedetails";
import { watchGetCategoryList } from "./categorylist";
import { watchGetProductList } from "./productlist";
import { watchGetProductDetail } from "./productdetail";
import { watchGetCartDetails } from "./cartdetails";
import { watchGetSettings } from "./settings";
import { watchGetListData } from "./listdata";
import { watchGetDetailData } from "./detaildata";
import { watchGetFormPost } from "./formpost";

export default function* () {
  yield all([
    watchGetStoreList(),
    watchGetStoreDetails(),
    watchGetCategoryList(),
    watchGetProductList(),
    watchGetProductDetail(),
    watchGetCartDetails(),
    watchGetSettings(),
    watchGetListData(),
    watchGetDetailData(),
    watchGetFormPost(),
  ]);
}
