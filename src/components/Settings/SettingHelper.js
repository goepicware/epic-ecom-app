/* eslint-disable */
import React from "react";
import cookie from "react-cookies";
import { format } from "date-fns";
import { deliveryId, apiUrl } from "./Config";
import $ from "jquery";
import Axios from "axios";
var qs = require("qs");
var base64 = require("base-64");
import Parser from "html-react-parser";

/* stripslashes  */
export const stripslashes = function (str) {
  if (
    str !== "" &&
    str !== null &&
    typeof str !== undefined &&
    typeof str !== "undefined"
  ) {
    str = str.replace(/\\'/g, "'");
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\0/g, "\0");
    str = str.replace(/\\\\/g, "\\");
    return str;
  }
};

/* Random ID  */
export const randomId = function () {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 50; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

/* sample funtion */
export const showSubTotalValue = function (price) {
  price = price !== "" ? parseFloat(price) : 0.0;
  var priceTxt = price.toFixed(2);
  return priceTxt;
};

/*Reference ID Generate*/
export const getReferenceID = function () {
  if (typeof cookie.load("referenceId") === "undefined") {
    var randomKey = randomId();
    cookie.save("referenceId", randomKey, { path: "/" });
    return randomKey;
  } else {
    return cookie.load("referenceId");
  }
};

/*remove promotion value*/
export const removePromoCkValue = function () {
  cookie.remove("reedemPointVal", { path: "/" });
  cookie.remove("promoCodeVal", { path: "/" });
  cookie.remove("promotionApplied", { path: "/" });
  cookie.remove("promotionType", { path: "/" });
  cookie.remove("promotionAmount", { path: "/" });
  cookie.remove("promotionSource", { path: "/" });
  cookie.remove("promoIsDelivery", { path: "/" });
  cookie.remove("usedPoints", { path: "/" });
};

/*remove order date time*/
export const removeOrderDateTime = function () {
  cookie.remove("orderDateTime", { path: "/" });
  cookie.remove("deliveryDate", { path: "/" });
  cookie.remove("deliveryTime", { path: "/" });
};

/*remove promotion value*/
export const getPromoCkValue = function () {
  var reedemPointVal =
    typeof cookie.load("reedemPointVal") === "undefined"
      ? ""
      : cookie.load("reedemPointVal");
  var promoCodeVal =
    typeof cookie.load("promoCodeVal") === "undefined"
      ? ""
      : cookie.load("promoCodeVal");
  var promotionApplied =
    typeof cookie.load("promotionApplied") === "undefined"
      ? ""
      : cookie.load("promotionApplied");
  var promotionType =
    typeof cookie.load("promotionType") === "undefined"
      ? ""
      : cookie.load("promotionType");
  var promotionAmount =
    typeof cookie.load("promotionAmount") === "undefined"
      ? ""
      : cookie.load("promotionAmount");
  var promotionSource =
    typeof cookie.load("promotionSource") === "undefined"
      ? ""
      : cookie.load("promotionSource");
  var promoIsDelivery =
    typeof cookie.load("promoIsDelivery") === "undefined"
      ? ""
      : cookie.load("promoIsDelivery");
  var usedPoints =
    typeof cookie.load("usedPoints") === "undefined"
      ? 0
      : cookie.load("usedPoints");

  var resultArr = [];
  resultArr["reedemPointVal"] = reedemPointVal;
  resultArr["promoCodeVal"] = promoCodeVal;
  resultArr["promotionApplied"] = promotionApplied;
  resultArr["promotionType"] = promotionType;
  resultArr["promotionAmount"] = promotionAmount;
  resultArr["promotionSource"] = promotionSource;
  resultArr["promoIsDelivery"] = promoIsDelivery;
  resultArr["usedPoints"] = usedPoints;

  return resultArr;
};

/* address format */
export const addressFormat = function (
  unitTwo,
  unitOne,
  addressOne,
  postCode,
  country = ""
) {
  var countryName = country !== "" ? country : "";
  var unit =
    unitTwo !== "" && unitOne !== "" && unitTwo !== null && unitOne !== null
      ? "#" + unitOne + "-" + unitTwo + ", "
      : unitOne !== "" && unitOne !== null
      ? "#" + unitOne + ", "
      : "";
  unit = addressOne !== "" ? unit + addressOne + ", " : unit;
  unit = postCode !== "" ? unit + "" + countryName + " " + postCode : unit;

  return unit !== "" ? unit.replace(/,\s*$/, "") : "N/A";
};

/* delivery charge */
export const getCalculatedAmount = function (
  cartDetailsArr,
  deliveryPartner,
  zoneDetails
) {
  var resultArr = [];
  var subTotal = 0;
  var totalItem = 0;
  var deliveryCharge = 0;

  if (Object.keys(cartDetailsArr).length > 0) {
    if (cartDetailsArr.store.length > 0) {
      cartDetailsArr.store.map((store) => {
        if (store.item.length > 0) {
          store.item.map((ProItem) => {
            totalItem = parseInt(totalItem) + parseInt(ProItem.itemQuantity);
          });
        }
      });
    }
    subTotal = cartDetailsArr.subTotal;
  }
  if (deliveryPartner !== "") {
    deliveryCharge = deliveryPartner.amount;
  }

  var discountDetails =
    cookie.load("discountDetails") !== "" &&
    typeof cookie.load("discountDetails") !== undefined &&
    typeof cookie.load("discountDetails") !== "undefined"
      ? cookie.load("discountDetails")
      : [];
  var totalDiscount = 0;
  if (discountDetails.length > 0) {
    discountDetails.map((item) => {
      totalDiscount =
        parseFloat(totalDiscount) + parseFloat(item.promotion_amount);
    });
  }
  var additional_charge = 0;
  if (zoneDetails?.zone_additional_charge) {
    additional_charge = zoneDetails?.zone_additional_charge;
  }

  var grandTotal =
    parseFloat(subTotal) +
    parseFloat(deliveryCharge) +
    parseFloat(additional_charge) -
    parseFloat(totalDiscount);

  resultArr["subTotal"] = subTotal;
  resultArr["grandTotal"] = grandTotal;
  resultArr["deliveryCharge"] = deliveryCharge;
  resultArr["additional_charge"] = additional_charge;
  resultArr["totalDiscount"] = totalDiscount;
  resultArr["discountDetails"] = discountDetails;

  resultArr["totalItem"] = totalItem;

  return resultArr;
};

/* show Alert */
export const showAlert = function (type, message) {
  if (type === "success") {
    $("body")
      .addClass("message-overlay")
      .append('<div class="message-overlay-light">' + message + "</div>");
  } else {
    $("body")
      .addClass("message-overlay")
      .append(
        '<div class="message-overlay-light overlay-error-msg">' +
          message +
          "</div>"
      );
  }

  setTimeout(function () {
    $("body").removeClass("message-overlay");
    $(".message-overlay-light").remove();
  }, 1000);
};

/* smooth Scroll */
export const smoothScroll = function (limit, value) {
  var limitTxt = limit !== "" ? parseInt(limit) : 0;
  var valueTxt = value !== "" ? parseInt(value) : 0;

  var stickyTop = $(window).scrollTop();
  if (stickyTop > limitTxt) {
    var i = 10;
    var int = setInterval(function () {
      window.scrollTo(0, i);
      i += 10;
      if (i >= valueTxt) clearInterval(int);
    }, 20);
  }
};

/* show Custom Alert */
export const showCustomAlert = function (type, message) {
  var clsIdTxt = type === "success" ? "jquery-success-msg" : "jquery-error-msg";
  $(".custom_alertcls").hide();
  $("." + clsIdTxt).html(message);
  $("#" + clsIdTxt).fadeIn();
  setTimeout(function () {
    $(".custom_alertcls").hide();
  }, 6000);
};

/* show Custom Center Alert */
export const showCustomCenterAlert = function (type, message) {
  var clsIdTxt =
    type === "success"
      ? "jquery-common-success-msg"
      : "jquery-common-error-msg";
  $(".custom_center_alertcls").hide();
  $("." + clsIdTxt).html(message);
  $("#" + clsIdTxt).fadeIn();
  setTimeout(function () {
    $(".custom_center_alertcls").hide();
  }, 6000);
};

/* show Cart Count */
export const showCartItemCount = function (cartDetail) {
  var itemCount =
    Object.keys(cartDetail).length > 0 ? cartDetail.cart_total_items : 0;
  var subTotal =
    Object.keys(cartDetail).length > 0 ? cartDetail.cart_sub_total : 0;
  cookie.save("cartTotalItems", itemCount, { path: "/" });
  $(".hcart_round").html(itemCount);
  if (parseFloat(subTotal) > 0) {
    $(".crttotl_amt").show();
  } else {
    $(".crttotl_amt").hide();
  }
  var subTotalHtml = "$" + subTotal;
  $(".crttotl_amt").html(subTotalHtml);
};

/* show Loader */
export const showLoader = function (divRef, type) {
  var btnType = type === "class" ? "." : "#";
  $(btnType + divRef)
    .addClass("overlay-loader")
    .append('<div class="custom-loader"></div>');
};

/* hide Loader */
export const hideLoader = function (divRef, type) {
  var btnType = type === "class" ? "." : "#";
  $(btnType + divRef)
    .find(".custom-loader")
    .remove();
  $(btnType + divRef).removeClass("overlay-loader");
};

/* show Loader */
export const showBtnLoader = function (divRef, type) {
  var btnType = type === "class" ? "." : "#";
  $(btnType + divRef)
    .addClass("overlay-loader")
    .append('<div class="btn-orange-custom-loader"></div>');
};

/* hide Loader */
export const hideBtnLoader = function (divRef, type) {
  var btnType = type === "class" ? "." : "#";
  $(btnType + divRef)
    .find(".btn-orange-custom-loader")
    .remove();

  $(btnType + divRef).removeClass("overlay-loader");
};

/* get subtotal value  */
export const getsubTotal = function (
  subTotal,
  OriginalAmount,
  promotionApplied,
  redeemptionApplied = null
) {
  if (promotionApplied === "Yes") {
    return subTotal;
  } else if (redeemptionApplied === "Yes") {
    return subTotal;
  } else {
    return OriginalAmount;
  }
};

/* get subtotal value  */
export const getDeliveryCharge = function (
  promotionApplied,
  deliveryEnabled,
  OriginalAmount,
  isFreeDelivery = null
) {
  if (
    (promotionApplied === "Yes" && deliveryEnabled === "Yes") ||
    isFreeDelivery === "Yes"
  ) {
    return 0;
  } else {
    return OriginalAmount;
  }
};

/* sample funtion */
export const showPrice = function (price) {
  price = price !== "" ? parseFloat(price) : 0.0;
  var priceTxt = (
    <>
      ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
    </>
  );
  return priceTxt;
};
export const showPriceDirect = function (price, digit=2) {
  price = price !== "" ? parseFloat(price) : 0.0;
  var priceTxt = (
    <>${price.toFixed(digit).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</>
  );
  return priceTxt;
};

/* int to str funtion */
export const cnvrtStr = function (d) {
  return d < 10 ? "0" + d.toString() : d.toString();
};

/* sample funtion */
export const getGstValue = function (gst, subtotal, format) {
  gst = parseFloat(gst);
  subtotal = parseFloat(subtotal);
  var gstResult = 0;

  if (gst > 0) {
    gstResult = (gst / 100) * subtotal;
  }

  if (format === "format") {
    return gstResult.toFixed(2);
  } else {
    return gstResult;
  }
};

/* GST Reverse Calculation funtion */
export const getReverseGST = function (gst, total) {
  var vatDivisor = 1 + parseFloat(gst) / 100;
  var gstpercentage = parseFloat(gst) / 100;
  var productvalue = total / vatDivisor;
  var gst = productvalue * gstpercentage;
  return  gst.toFixed(2);
};

/* time conversion  */
export const timeToConv12 = function (time24) {
  var ts = time24;
  if (ts !== "" && typeof ts !== "undefined") {
    var H = +ts.substr(0, 2);
    var h = H % 12 || 12;
    h = h < 10 ? "0" + h : h;
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
  }
  return ts;
};

/* Date conversion  */
export const getOrderDateTime = function (dateTxt, TatTxt) {
  var dateStr = new Date();
  var TatTxtVl =
    TatTxt !== "" && typeof TatTxt !== "undefined" ? parseInt(TatTxt) : 0;
  var deliveryTime =
    typeof cookie.load("deliveryTime") === "undefined"
      ? ""
      : cookie.load("deliveryTime");
  if (dateTxt !== "" && typeof dateTxt !== "undefined" && deliveryTime !== "") {
    dateTxt = dateTxt.replace(/\"/g, "");
    var dateTxtArr = dateTxt.split("T");
    var selectTmArr = deliveryTime.split(":");
    var seletedDate = new Date(dateTxtArr[0]);
    seletedDate.setHours(parseInt(selectTmArr[0]));
    seletedDate.setMinutes(parseInt(selectTmArr[1]));
    seletedDate.setSeconds(0);
    dateStr = seletedDate;
  } else {
    var CurrentDate = new Date();
    CurrentDate.setMinutes(CurrentDate.getMinutes() + TatTxtVl);
    dateStr = CurrentDate;
  }

  return dateStr;
};

/* Date conversion  */
export const dateConvFun = function (dateTxt, type) {
  var dateStr = dateTxt;
  if (dateStr !== "" && typeof dateStr !== "undefined") {
    var newDateTxtone = dateTxt.replace(/-/g, "/");
    var todayTime = new Date(newDateTxtone);
    var month = todayTime.getMonth() + 1;
    month = month > 9 ? month : "0" + month;
    var day = todayTime.getDate();
    day = day > 9 ? day : "0" + day;
    var year = todayTime.getFullYear();

    if (type === 1) {
      dateStr = day + "/" + month + "/" + year;
    } else if (type === 2) {
      dateStr = day + "-" + month + "-" + year;
    }
  }

  return dateStr;
};

/* Date conversion  */
export const getTimeFrmDate = function (timeTxt, type) {
  var timeStr = timeTxt;
  if (timeStr !== "" && typeof timeStr !== "undefined") {
    var newtimeStr = timeStr.replace(/-/g, "/");
    var todayTime = new Date(newtimeStr);
    var hours = todayTime.getHours();
    var minut = todayTime.getMinutes();

    hours = parseInt(hours) < 10 ? "0" + hours : hours;
    minut = parseInt(minut) < 10 ? "0" + minut : minut;

    if (type === 1) {
      timeStr = hours + " : " + minut;
    } else if (type === 2) {
      timeStr = hours + ":" + minut;
      timeStr = timeToConv12(timeStr);
    }
  }

  return timeStr;
};

/* Date conversion  */
export const getCurrentDateTm = function () {
  var dateTimeStr = "";
  var todayTime = new Date();

  var month = todayTime.getMonth() + 1;
  month = month > 9 ? month : "0" + month;
  var day = todayTime.getDate();
  day = day > 9 ? day : "0" + day;
  var year = todayTime.getFullYear();

  var hours = todayTime.getHours();
  var minut = todayTime.getMinutes();
  var second = todayTime.getSeconds();

  hours = parseInt(hours) < 10 ? "0" + hours : hours;
  minut = parseInt(minut) < 10 ? "0" + minut : minut;
  second = parseInt(minut) < 10 ? "0" + second : second;

  dateTimeStr =
    year + "-" + month + "-" + day + " " + hours + ":" + minut + ":" + second;

  return dateTimeStr;
};

/* sample funtion */
export const validateEmailFun = function (mailIdVal) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mailIdVal)) {
    return true;
  }

  return false;
};

/* sample funtion */
export const showCartLst = function () {
  setTimeout(function () {
    $(".hcart_dropdown").toggleClass("open");
    $(".hcartdd_trigger").toggleClass("active");
  }, 1000);
};

/* sample funtion */
export const resetCrtStyle = function () {
  $(".cart_body").find(".cart_row").removeAttr("style");
};

/* sample funtion */
export const getAliasName = function (alias, productName) {
  return alias !== "" ? alias : productName;
};

/* Uc first funtion */
export const jsUcfirstFun = function (string) {
  if (string !== "") {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return "";
  }
};

/* surcharge splitup */
export const getSurchargesplitup = function (surcharge, surlog) {
  let sur_deliverysetup_fee = 0;
  let sur_ear_deliverysetup_fee = 0;
  let sur_lat_teardown_fee = 0;

  let sur_deliverysetup_fee_name = "";
  let sur_ear_deliverysetup_fee_name = "";

  if (surcharge > 0) {
    sur_deliverysetup_fee = parseFloat(surlog.OrderPax.charge);
    sur_deliverysetup_fee += parseFloat(surlog.OrderAmount.charge);
    sur_deliverysetup_fee += parseFloat(surlog.Surcharge.charge);

    /*Pax value*/
    if (surlog.OrderPax.conditions.catering.amount_range_from !== undefined) {
      sur_deliverysetup_fee_name =
        "(" +
        surlog.OrderPax.conditions.catering.amount_range_from +
        " pax - " +
        surlog.OrderPax.conditions.catering.amount_range_to +
        " pax)";
    }

    /*Surchare based on date,time and day settings*/
    let sur_ear_deliverysetup_fee_time = 0;

    if (surlog.Surcharge.conditions !== undefined) {
      let basetimeArr = surlog.Surcharge.conditions.filter(
        (condobj) => condobj.surchage_based_on === "Time"
      );

      basetimeArr.forEach((item, i) => {
        sur_ear_deliverysetup_fee_time += parseFloat(item.price_value);

        sur_ear_deliverysetup_fee_name =
          "(" + item.subchr_from_time + " - " + item.subchr_to_time + ")";
      });

      if (basetimeArr.length != 1) {
        sur_ear_deliverysetup_fee_name = "";
      }

      sur_deliverysetup_fee =
        sur_deliverysetup_fee - sur_ear_deliverysetup_fee_time;
      sur_ear_deliverysetup_fee = sur_ear_deliverysetup_fee_time;
    }

    sur_lat_teardown_fee = surlog.After9pm.charge;
  }

  return {
    sur_deliverysetup_fee: sur_deliverysetup_fee.toFixed(2),
    sur_ear_deliverysetup_fee: sur_ear_deliverysetup_fee.toFixed(2),
    sur_lat_teardown_fee: sur_lat_teardown_fee.toFixed(2),
    sur_deliverysetup_fee_name: sur_deliverysetup_fee_name,
    sur_ear_deliverysetup_fee_name: sur_ear_deliverysetup_fee_name,
  };
};

export const getTimeobject = [
  { value: "", label: "Select" },
  { value: "01:00", label: "01:00 AM" },
  { value: "01:30", label: "01:30 AM" },
  { value: "02:00", label: "02:00 AM" },
  { value: "02:30", label: "02:30 AM" },
  { value: "03:00", label: "03:00 AM" },
  { value: "03:30", label: "03:30 AM" },
  { value: "04:00", label: "04:00 AM" },
  { value: "04:30", label: "04:30 AM" },
  { value: "05:00", label: "05:00 AM" },
  { value: "05:30", label: "05:30 AM" },
  { value: "06:00", label: "06:00 AM" },
  { value: "06:30", label: "06:30 AM" },
  { value: "07:00", label: "07:00 AM" },
  { value: "07:30", label: "07:30 AM" },
  { value: "08:00", label: "08:00 AM" },
  { value: "08:30", label: "08:30 AM" },
  { value: "09:00", label: "09:00 AM" },
  { value: "09:30", label: "09:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "01:00 PM" },
  { value: "13:30", label: "01:30 PM" },
  { value: "14:00", label: "02:00 PM" },
  { value: "14:30", label: "02:30 PM" },
  { value: "15:00", label: "03:00 PM" },
  { value: "15:30", label: "03:30 PM" },
  { value: "16:00", label: "04:00 PM" },
  { value: "16:30", label: "04:30 PM" },
  { value: "17:00", label: "05:00 PM" },
  { value: "17:30", label: "05:30 PM" },
  { value: "18:00", label: "06:00 PM" },
  { value: "18:30", label: "06:30 PM" },
  { value: "19:00", label: "07:00 PM" },
  { value: "19:30", label: "07:30 PM" },
  { value: "20:00", label: "08:00 PM" },
  { value: "20:30", label: "08:30 PM" },
  { value: "21:00", label: "09:00 PM" },
  { value: "21:30", label: "09.30 PM" },
  { value: "22:00", label: "10.00 PM" },
  { value: "22:30", label: "10.30 PM" },
  { value: "23:00", label: "11.00 PM" },
  { value: "23:30", label: "11.30 PM" },
  { value: "24:00", label: "12.00 PM" },
];

export const formatCreditCardNumber = function (value) {
  if (!value) {
    return value;
  }

  const issuer = Payment.fns.cardType(value);
  const clearValue = clearNumber(value);
  let nextValue;
  switch (issuer) {
    case "visa":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 16)}`;

    case "mastercard":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 16)}`;

    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 16)}`;
      break;
  }

  return nextValue.trim();
};

export const formatCVC = function (value, prevValue, allValues = {}) {
  const clearValue = clearNumber(value);
  let maxLength = 3;
  if (allValues.number) {
    const issuer = Payment.fns.cardType(allValues.number);
    maxLength = issuer === "visa" ? 3 : 3;
  }
  return clearValue.slice(0, maxLength);
};

export const formatExpirationDate = function (value) {
  const clearValue = clearNumber(value);

  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
  }

  return clearValue;
};

export const formatFormData = function (data) {
  return Object.keys(data).map((d) => `${d}: ${data[d]}`);
};

/* Validate Int Value */
export const validateIntval = function (e) {
  const re = /[0-9]+/g;
  if (!re.test(e.key)) {
    e.preventDefault();
  }
};

/* Show Time Meridiem */
export const meridiem = function (time) {
  if (time !== "" && time !== null) {
    var timeSplit = time.split(":");
    var merid = "am";
    if (timeSplit[0] >= 12) {
      merid = "pm";
    }
    var result = "";

    var finaTime = "";
    if (timeSplit[0] > 12) {
      var Fonttime = timeSplit[0] / 2;
      finaTime = Math.floor(Fonttime);
    } else {
      finaTime = timeSplit[0];
    }
    result = finaTime + "" + merid;
    return result;
  }
};

export const showStatus = function (status) {
  if (status === "A") {
    return <span className="badge bg-label-success me-1">Active</span>;
  } else if (status === "I") {
    return <span className="badge bg-label-danger me-1">InActive</span>;
  }
};

export const userID = function () {
  return cookie.load("loginID");
};
export const CompanyID = function () {
  return cookie.load("companyID");
};
export const clientID = function () {
  return cookie.load("clientID");
};

export const encodeValue = function (value) {
  if (value !== "") {
    return base64.encode(value);
  }
};
export const decodeValue = function (value) {
  if (value !== "") {
    return base64.decode(value);
  }
};

export const showDateTime = function (date) {
  if (date !== "") {
    return format(new Date(date), "MM/dd/yyyy hh:mm a");
  }
};
export const showDate = function (date) {
  if (date !== "") {
    return format(new Date(date), "MM/dd/yyyy");
  }
};
export const capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const convertTimestamptoTime = function (unixTimestamp) {
  if (
    unixTimestamp !== "" &&
    unixTimestamp !== null &&
    typeof unixTimestamp !== undefined &&
    typeof unixTimestamp !== "undefined"
  ) {
    // Convert to milliseconds and
    // then create a new Date object
    let dateObj = new Date(unixTimestamp * 1000);
    let utcString = dateObj.toUTCString();

    let time = utcString.slice(-11, -4);
    return time;
  }
};

export const showOrderTime = function (orderTime, orderSlotStrTime, orderSlotEndTime, slotType) {
  let displayTime = '';
  if(orderTime!=="") {
    if (parseInt(slotType) === 2) {
      let startTime = new Date();
      if (orderSlotStrTime !== "") {
        const orderSlotStrTime_ = orderSlotStrTime.split(":");
        startTime.setHours(orderSlotStrTime_[0]);
        startTime.setMinutes(orderSlotStrTime_[1]);
      }
      let endTime = new Date();
      if (orderSlotEndTime !== "") {
        const orderSlotEndTime_ = orderSlotEndTime.split(":");
        endTime.setHours(orderSlotEndTime_[0]);
        endTime.setMinutes(orderSlotEndTime_[1]);
      }
      displayTime = `${format(startTime, "hh:mm a")} - ${format(endTime, "hh:mm a") }`;
    }else {
      displayTime =format(new Date(orderTime.replaceAll('"', "")), "hh:mm a")
    }
    return displayTime;
  }
}

export const  calculateDays =  function(startDate, endDate) {
  // Convert the dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);
  if(start < end) {
    const differenceInMs = end - start;
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
    return `${Math.ceil(differenceInDays)} days left`; 
  }else {
    return 'Expired';
  }
}

export const setOutletID = function (value) {
  value = value ?? '';
  if(value!=="" && value!==null) {
    cookie.save('outletID', value, { path: "/" });
  }
  return '';
};

export const getOutletID = function () {
  return cookie.load('outletID') ?? '';
};