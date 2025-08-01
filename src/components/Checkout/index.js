import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import $ from "jquery";
import cookie from "react-cookies";
import { toast } from "react-toastify";
import Axios from "axios";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { GET_CART_DETAIL, GET_GLOBAL_SETTINGS } from "../../actions";
import {
  showPriceDirect,
  encodeValue,
  showLoader,
  hideLoader,
  getGstValue,
  addressFormat,
  getReverseGST,
  showOrderTime,
} from "../Settings/SettingHelper";
import {
  apiUrl,
  deliveryId,
  mainUrl,
  pickupId,
  uniqueID,
  CountryName,
} from "../Settings/Config";
import cartplaceholder from "../../common/images/placeholder.jpg";
import Header from "../Layout/Header";
import OrderAdvancedDatetimeSlot from "../Layout/OrderAdvancedDatetimeSlot";
import logo from "../../common/images/logo.png";

var parse = require("html-react-parser");
class Checkout extends Component {
  constructor(props) {
    super(props);
    const seletedAvilablityId = cookie.load("availability") ?? "";
    const seletedAvilablityName = cookie.load("availabilityName") ?? "";

    const outletID = cookie.load("outletID") ?? "";
    const orderHandledOutlet = cookie.load("orderHandledOutlet") ?? "";
    const outletName = cookie.load("outletName") ?? "";
    const zoneID = localStorage.getItem("zoneID") ?? "";

    const orderDateTime = cookie.load("orderDateTime") ?? "";
    console.log(orderDateTime, "orderDateTimeorderDateTime");
    const displyDate =
      orderDateTime !== ""
        ? format(new Date(orderDateTime.replaceAll('"', "")), "do MMM yyyy")
        : "";
    const displyTime =
      orderDateTime !== ""
        ? format(new Date(orderDateTime.replaceAll('"', "")), "hh:mm a")
        : "";

    var isAdvanced =
      typeof cookie.load("isAdvanced") === "undefined"
        ? ""
        : cookie.load("isAdvanced");
    const customerID = localStorage.getItem("customerID") ?? "";

    const discountApplied = cookie.load("discountApplied") ?? "No";
    const promoFreeDelivery = cookie.load("promoFreeDelivery") ?? "No";
    const discount = cookie.load("discount") ?? 0;
    const promoCode = cookie.load("promoCode") ?? "";

    const deliveryTime = cookie.load("deliveryTime") ?? "";
    const slotType = cookie.load("slotType") ?? "";
    const orderSlotEndTime = cookie.load("orderSlotEndTime") ?? "";
    const orderSlotStrTime = cookie.load("orderSlotStrTime") ?? "";

    const redeemPoint = cookie.load("redeemPoint") ?? "";
    const redeemPointAmount = cookie.load("redeemPointAmount") ?? 0;

    const unitNumber = localStorage.getItem("deliveryUnitNumber") ?? "";
    const floorNumber = localStorage.getItem("deliveryFloorNumber") ?? "";
    this.state = {
      loginPopup:false,
      seletedAvilablityId: seletedAvilablityId,
      seletedAvilablityName: seletedAvilablityName,
      customerID: customerID,
      outletID: outletID,
      zoneID: zoneID,
      orderHandledOutlet: orderHandledOutlet,
      outletName: outletName,
      unitNumber: unitNumber,
      floorNumber: floorNumber,
      cartDetails: "",
      totalItem: 0,
      cartstatus: "",
      subtotal: 0,
      promoCode: promoCode,
      discount: discount,
      redeemPoint: redeemPoint,
      redeemPointAmount: redeemPointAmount,
      deliveryCharge: 0,
      taxAmount: 0,
      taxPercentage: 0,
      taxType: "",
      grandTotal: 0,
      globalSettings: [],
      companyEnableRapyd: false,
      discountApplied: discountApplied,
      promoFreeDelivery: promoFreeDelivery,
      paymentMode: "Stripe",

      /* For Advanced Slot */
      slotType: slotType,
      getDateTimeFlg: "",
      seleted_ord_date: orderDateTime,
      seleted_ord_time: "",
      seleted_ord_slot: "",
      seleted_ord_slotTxt: "",
      seleted_ord_slot_str: "",
      seleted_ord_slot_end: "",
      order_tat_time: "",
      orderDateTime: orderDateTime,
      orderSlotVal: "",
      orderSlotTxt: "",
      orderSlotStrTime: "",
      orderSlotEndTime: "",
      labelDateName: seletedAvilablityName,
      labelTimeName: seletedAvilablityName,
      isAdvanced: isAdvanced,
      deliveryTime: deliveryTime,

      displyDate: displyDate,
      displyTime: displyTime,

      deliveryDatas: "",
      deliveryCharegLoadingStatus: false,

      deliveryIntitalLoad: false,

      updateTimes: "",
      additionalInformation: "",

      open:false
    };
  }
  componentDidMount() {
    $("body").css("overflow", "auto");
    if (this.state.customerID === "") {
      cookie.save("triggerLogin", "Yes", { path: "/" });
      cookie.save("redirect", "checkout", { path: "/" });
      this.props.history.push("/");
    } else if (
      this.state.seletedAvilablityId === "" ||
      this.state.outletID === ""
    ) {
      cookie.save("triggerOrderType", "Yes", { path: "/" });
      cookie.save("redirect", "checkout", { path: "/" });
      this.props.history.push("/");
    } else if (this.state.outletID !== "") {
      if (
        this.state.seletedAvilablityId === deliveryId &&
        this.state.zoneID === ""
      ) {
        cookie.save("triggerOrderType", "Yes", { path: "/" });
        cookie.save("redirect", "checkout", { path: "/" });
        this.props.history.push("/");
      } else {
        this.setState({ getDateTimeFlg: "yes" });
      }
    } else {
      this.setState({ getDateTimeFlg: "yes" });
    }
  }
  componentDidUpdate() {
    var sltdOrdDate = this.state.seleted_ord_date;
    var sltdOrdTime = this.state.seleted_ord_time;
    if (sltdOrdDate !== "" && sltdOrdTime !== "") {
      this.updateOrderDateTimeCookie();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.cartDetails !== nextProps.cartDetails) {
      this.setState(
        { cartDetails: nextProps.cartDetails, totalItem: nextProps.totalItem },
        () => {
          this.calculatePrice();
        }
      );
    }
    if (this.state.cartstatus !== nextProps.cartstatus) {
      if (nextProps.cartstatus === "faild") {
        this.props.history.push("/");
      }
    }

    if (this.state.globalSettings !== nextProps.settingsArr) {
      console.log(nextProps.settingsArr, "nextProps.settingsArr");
      var tampStArr = nextProps.settingsArr;
      var paymentmode = "Stripe";
      var codPayment = 0;
      var offlinePayment = 0;
      var stripePayment = 0;
      var omisePayment = 0;
      /*   if (Object.keys(tampStArr).length > 0) {
        if (
          tampStArr.client_cod_enable == 1 &&
          tampStArr.client_cod_availability == 1
        ) {
          codPayment = 1;
          paymentmode = "Cash";
        }

        if (
          tampStArr.client_offline_enable == 1 &&
          tampStArr.client_offline_availability == 1
        ) {
          offlinePayment = 1;
          paymentmode = "Offline";
        }

        if (
          tampStArr.client_stripe_enable == 1 &&
          tampStArr.client_stripe_availability == 1
        ) {
          stripePayment = 1;
        }

        if (
          tampStArr.client_omise_enable == 1 &&
          tampStArr.client_omise_availability == 1
        ) {
          omisePayment = 1;
          if (paymentmode !== "Cash") {
            paymentmode = "Omise";
          }
        }
      } */
      const settingsArr = nextProps.settingsArr;
      let companyEnableRapyd = settingsArr?.companyEnableRapyd ?? false;
      this.setState(
        {
          globalSettings: nextProps.settingsArr,
          companyEnableRapyd: companyEnableRapyd,
          paymentMode: "Stripe",
          /*    cod_payment_enable: codPayment,
        offline_payment_enable: offlinePayment,
        stripe_payment_enable: stripePayment,
        omise_payment_enable: omisePayment,
        paymentmodevalue: paymentmode, */
        },
        () => {
          this.calculatePrice();
        }
      );
    }
  }
  loadDeliveryCharge(ordDateTime) {
    console.log(ordDateTime, "orderDateTimeorderDateTimeorderDateTime");
    this.setState(
      {
        deliveryCharegLoadingStatus: false,
      },
      () => {
        this.calculatePrice();
      }
    );
    if (ordDateTime !== "") {
      this.setState({ deliveryCharegLoadingStatus: true }, () => {
        const postObject = {
          uniqueID,
          postalCode: localStorage.getItem("deliveryPostalCode"),
          unitNumber: this.state.unitNumber,
          floorNumber: this.state.floorNumber,
          outletID: this.state.outletID,
          orderDateTime: new Date(ordDateTime),
        };

        Axios.post(`${apiUrl}delivery/getLalamoveQuote`, postObject)
          .then((res) => {
            if (res.data.status === "ok") {
              this.setState(
                {
                  deliveryCharegLoadingStatus: false,
                  deliveryDatas: res.data.result,
                },
                () => {
                  this.calculatePrice();
                }
              );
            }
          })
          .catch((e) => {
            var errorMsg = e?.response?.data?.message || e.message;
            toast.error(errorMsg);
          });
      });
    }
  }

  /* For Advanced Slot */
  updateOrderDateTimeCookie() {
    var sltdOrdDate = this.state.seleted_ord_date;
    var sltdOrdTime = this.state.seleted_ord_time;
    console.log(sltdOrdDate, sltdOrdTime, "sltdOrdTimesltdOrdTimesltdOrdTime");

    var OrdDate = format(sltdOrdDate, "yyyy-MM-dd");
    var OrdHours = sltdOrdTime.getHours();
    var OrdMunts = sltdOrdTime.getMinutes();
    var OrdSecnd = sltdOrdTime.getSeconds();
    var ordDateTime = new Date(OrdDate);
    ordDateTime.setHours(OrdHours);
    ordDateTime.setMinutes(OrdMunts);
    ordDateTime.setSeconds(OrdSecnd);

    var deliveryDate = format(sltdOrdDate, "dd/MM/yyyy");
    var deliveryTime =
      this.pad(OrdHours) + ":" + this.pad(OrdMunts) + ":" + this.pad(OrdSecnd);

    cookie.save("orderDateTime", ordDateTime, { path: "/" });
    cookie.save("deliveryDate", deliveryDate, { path: "/" });
    cookie.save("deliveryTime", deliveryTime, { path: "/" });
    if (this.state.seletedAvilablityId === deliveryId) {
      setTimeout(() => {
        const oldDateTime = this.state.updateTimes;
        const oldDateTime__ =
          oldDateTime !== ""
            ? format(new Date(oldDateTime), "yyyy-MM-dd HH:mm")
            : "";

        const updateDateTime = ordDateTime;
        const updateDateTime__ =
          updateDateTime !== ""
            ? format(new Date(updateDateTime), "yyyy-MM-dd HH:mm")
            : "";

        if (
          updateDateTime__ !== oldDateTime__ &&
          this.state.deliveryIntitalLoad === true
        ) {
          this.setState({ updateTimes: ordDateTime }, () => {
            this.loadDeliveryCharge(ordDateTime);
          });
        }

        if (this.state.deliveryIntitalLoad === false && oldDateTime === "") {
          this.setState(
            { deliveryIntitalLoad: true, updateTimes: ordDateTime },
            () => {
              this.loadDeliveryCharge(ordDateTime);
            }
          );
        }
      }, 1000);
    }

    var isAdvanced = this.state.isAdvanced;
    var slotType = this.state.slotType;
    var orderSlotVal = "",
      orderSlotTxt = "",
      orderSlotStrTime = "",
      orderSlotEndTime = "";
    if (slotType === "2") {
      orderSlotVal = this.state.seleted_ord_slot;
      orderSlotTxt = this.state.seleted_ord_slotTxt;
      orderSlotStrTime = this.state.seleted_ord_slot_str;
      orderSlotEndTime = this.state.seleted_ord_slot_end;
      console.log(
        slotType,
        this.state.seleted_ord_slot_str,
        this.state.seleted_ord_slot_end,
        orderSlotStrTime,
        orderSlotEndTime,
        "orderSlotStrTime"
      );
    }

    cookie.save("orderSlotVal", orderSlotVal, { path: "/" });
    cookie.save("orderSlotTxt", orderSlotTxt, { path: "/" });
    cookie.save("orderSlotStrTime", orderSlotStrTime, { path: "/" });
    cookie.save("orderSlotEndTime", orderSlotEndTime, { path: "/" });
  }

  pad(d) {
    return d < 10 ? "0" + d.toString() : d.toString();
  }

  calculatePrice() {
    const cartItem_ = this.state.cartDetails?.cartItem ?? [];
    const subtotal = cartItem_.reduce(
      (sum, item) => sum + item.cartItemTotalPrice,
      0
    );

    const globalSettings = this.state.globalSettings;
    const companyEnableTax = globalSettings?.companyEnableTax ?? false;
    let deliveryCharge = 0;

    if (this.state.deliveryDatas !== "") {
      deliveryCharge =
        this.state.deliveryDatas?.data?.priceBreakdown?.total ?? 0;
    }

    let taxAmount = 0;
    let taxPercentage = 0;
    let taxType = "";
    if (companyEnableTax === true) {
      const companyEnableTaxPercentage =
        globalSettings?.companyEnableTaxPercentage ?? 0;
      taxType = globalSettings?.companyTaxType ?? "";
      if (parseFloat(companyEnableTaxPercentage) > 0) {
        taxAmount =
          taxType === "Inclusive"
            ? getReverseGST(companyEnableTaxPercentage, subtotal)
            : getGstValue(companyEnableTaxPercentage, subtotal, "format");
        taxPercentage = companyEnableTaxPercentage;
      }
    }

    const discount = this.state.discount;
    const redeemPointAmount =
      this.state.redeemPointAmount !== ""
        ? this.state.redeemPointAmount ?? 0
        : 0;
    console.log(
      subtotal,
      discount,
      redeemPointAmount,
      deliveryCharge,
      "deliveryCharge"
    );
    let grandTotal =
      parseFloat(subtotal) -
      parseFloat(discount) -
      parseFloat(redeemPointAmount) +
      parseFloat(deliveryCharge);
    if (taxType === "Exclusive") {
      grandTotal = parseFloat(grandTotal) + parseFloat(taxAmount);
    }

    this.setState({
      subtotal: parseFloat(subtotal).toFixed("2"),
      deliveryCharge: parseFloat(deliveryCharge).toFixed("2"),
      taxAmount: parseFloat(taxAmount).toFixed("2"),
      taxPercentage: parseFloat(taxPercentage),
      grandTotal: parseFloat(grandTotal).toFixed("2"),
      taxType: taxType,
    });
  }
  updateStateValue = (field, value) => {
    this.setState({ [field]: value });
  };
  closeCart(e) {
    e.preventDefault();
    this.props.updateStateValue("openCart", false);
    document.querySelector("body").classList.remove("cart-sidebar-open");
  }
  incDecQty(cartItemQuantity, qtyType, index, itemID) {
    showLoader("citem-" + index);
    if (qtyType === "dec") {
      cartItemQuantity = parseInt(cartItemQuantity) - 1;
    } else {
      cartItemQuantity = parseInt(cartItemQuantity) + 1;
    }

    const postObject = {
      uniqueID: uniqueID,
      customerID: this.state.customerID,
      referenceID: "",
      itemQuantity: cartItemQuantity,
    };

    Axios.put(`${apiUrl}cart/${encodeValue(itemID)}`, postObject)
      .then((res) => {
        hideLoader("citem" + index);
        if (res.data.status === "ok") {
          this.props.getCartDetail();
          toast.success(res.data.message);
          this.removePromoItems();
        }
      })
      .catch((e) => {
        hideLoader("citem" + index);
        var errorMsg = e?.response?.data?.message || e.message;
        toast.error(errorMsg);
      });
  }
  removeItem(itemID, e) {
    e.preventDefault();

    Axios.delete(`${apiUrl}cart/removeItem/${encodeValue(itemID)}`)
      .then((res) => {
        if (res.data.status === "ok") {
          this.props.getCartDetail();
          toast.success(res.data.message);
          this.removePromoItems();
        }
      })
      .catch((e) => {
        var errorMsg = e?.response?.data?.message || e.message;
        toast.error(errorMsg);
      });
  }

  continueProcess = async (e) => {
    e.preventDefault();

    let postObject = this.loadOrderData( "Yes");
    showLoader("placeOrder");
    Axios.post(`${apiUrl}order/placeOrder`, postObject, {
      headers: {
        Authorization: `Bearer ${cookie.load("clientAccessToken")}`,
      },
    }).then((res) => {
      if (res.data.status === "ok") {
        this.placeOrder();
      }
    })
    .catch((e) => {
      hideLoader("placeOrder");
      var errorMsg = e?.response?.data?.message || e.message;
      toast.error(parse(errorMsg));
    });
  }

  loadOrderData(validate = "No") {
    /* if  merge order date */
    var orderDate = "";
    var seletedOrdDate = this.state.seleted_ord_date;
    var seletedOrdTime = this.state.seleted_ord_time;

    /* For Advanced Slot */
    var order_is_timeslot = "No",
      ordSlotStrTm = "",
      ordSlotEndTm = "";
    if (seletedOrdDate !== "" && seletedOrdTime !== "") {
      var formatedDate = format(seletedOrdDate, "yyyy-MM-dd");
      var OrderHours = seletedOrdTime.getHours();
      var OrderMunts = seletedOrdTime.getMinutes();
      var OrderSecnd = seletedOrdTime.getSeconds();

      var orderTime = this.pad(OrderHours) + ":" + this.pad(OrderMunts);

      orderDate = formatedDate + " " + orderTime;
      console.log(this.state.isAdvanced);
      console.log(this.state.slotType);

      if (this.state.order_is_timeslot === "Yes") {
        order_is_timeslot = "Yes";
        ordSlotStrTm = this.state.seleted_ord_slot_str;
        ordSlotEndTm = this.state.seleted_ord_slot_end;
      }
    }

    if (seletedOrdDate !== "" && seletedOrdTime !== "") {
      var formatedDate = format(seletedOrdDate, "yyyy-MM-dd");
      var OrderHours = seletedOrdTime.getHours();
      var OrderMunts = seletedOrdTime.getMinutes();
      var OrderSecnd = seletedOrdTime.getSeconds();

      var orderTime = this.pad(OrderHours) + ":" + this.pad(OrderMunts);

      orderDate = formatedDate + " " + orderTime;
    } else {
      orderDate = cookie.load("orderDateTime");
    }

    if (orderDate === "") {
      toast.error("Please select order date and time.");
      return false;
    }
    let postObject = {
      uniqueID: uniqueID,
      customerID: this.state.customerID,
      outletID: this.state.outletID,
      cartID: this.state.cartDetails._id,
      zoneID: this.state.zoneID,
      availabilityID: this.state.seletedAvilablityId,
      availabilityName: this.state.seletedAvilablityName,
      additionalInformation: this.state.additionalInformation,
      deliveryUnitNumber:this.state.unitNumber,
      deliveryFloorNumber:this.state.floorNumber,
      deliveryAddress:
        this.state.seletedAvilablityId === deliveryId
          ? localStorage.getItem("deliveryAddress") ?? ""
          : "",
      deliveryPostalCode:
        this.state.seletedAvilablityId === deliveryId
          ? localStorage.getItem("deliveryPostalCode") ?? ""
          : "",
      billingUnitNumber:this.state.unitNumber,
      billingFloorNumber:this.state.floorNumber,
      billingAddress:
        this.state.seletedAvilablityId === deliveryId
          ? localStorage.getItem("deliveryAddress") ?? ""
          : "",
      billingPostalCode:
        this.state.seletedAvilablityId === deliveryId
          ? localStorage.getItem("deliveryPostalCode") ?? ""
          : "",
      orderDate: orderDate,
      orderDateType: this.state.slotType,
      orderSlotStart: this.state.seleted_ord_slot_str,
      orderSlotEnd: this.state.seleted_ord_slot_end,
      subTotal: this.state.subtotal,
      deliveryCharge: this.state.deliveryCharge,
      grandTotal: this.state.grandTotal,
      discountApplied: this.state.discountApplied,
      promoCode: this.state.promoCode,
      promoFreeDelivery: this.state.promoFreeDelivery,
      discount: this.state.discount,
      redeemPoint:
        parseFloat(this.state.redeemPointAmount) > 0
          ? this.state.redeemPoint
          : "",
      redeemPointAmount:
        parseFloat(this.state.redeemPointAmount) > 0
          ? this.state.redeemPointAmount
          : 0,
      paymentMode: this.state.paymentMode,
      paymentGetwayName: "",
      orderSource: "Web",
      validate: validate,
      deliveryDatas:
        this.state.deliveryDatas !== ""
          ? JSON.stringify(this.state.deliveryDatas)
          : "",
    };
    if (this.state.paymentMode === "Rapyd" || this.state.paymentMode === "Stripe") {
      //postObject.callbackurl = "https://ecomfront.goepicware.com/";
      postObject.callbackurl = mainUrl;
    }
    return postObject;
  }

  placeOrder= async (e) => {
    let postObject = this.loadOrderData();
    console.log(postObject, "postObjectpostObject");
   
    showLoader("placeOrder");
    if (this.state.paymentMode === "Rapyd") {
      Axios.post(apiUrl + "payment/processRapydPayment", postObject, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          hideLoader("placeOrder");
          console.log(res.data, "res.data");
          if (res.data.status === "ok") {
            localStorage.setItem(
              "paymentRequestIdRapyd",
              res.data.payment_requestId
            );
            window.location.href = res.data.redirectURL;
          } else {
            Swal.fire({
              title: "Error",
              html: res.data.message,
              icon: "error",
              customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
              },
              buttonsStyling: false,
            });
          }
        })
        .catch((e) => {
          var errorMsg = e?.response?.data?.message || e.message;
          Swal.fire({
            title: "Error",
            html: errorMsg,
            icon: "error",
            customClass: {
              confirmButton: "btn btn-primary waves-effect waves-light",
            },
            buttonsStyling: false,
          });
          hideLoader("placeOrder");
          console.error("Error fetching data:", e);
        });
    } else if (this.state.paymentMode === "Stripe") {

      Axios.post(`${apiUrl}payment/createpaymentintent`, postObject, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
            hideLoader("placeOrder");
            if (res.data.status === "ok") {
              localStorage.setItem(
                "paymentRequestIdStripe",
                res.data.payment_requestId
              );
              window.location.href = res.data.redirectURL;
            } else {
              Swal.fire({
                title: "Error",
                html: res.data.message,
                icon: "error",
                customClass: {
                  confirmButton: "btn btn-primary waves-effect waves-light",
                },
                buttonsStyling: false,
              });
            }
        })
        .catch((e) => {
          hideLoader("placeOrder");
          var errorMsg = e?.response?.data?.message || e.message;
          toast.error(errorMsg);
        });
    } else {
      Axios.post(`${apiUrl}order/placeOrder`, postObject, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.data.status === "ok") {
            this.props.getCartDetail();
            toast.success(res.data.message);
          }
        })
        .catch((e) => {
          hideLoader("placeOrder");
          var errorMsg = e?.response?.data?.message || e.message;
          toast.error(errorMsg);
        });
    }
  }

  /* For Advanced Slot */
  setdateTimeFlg = (field, value) => {
    if (field == "tmflg") {
      this.setState({ getDateTimeFlg: value });
    } else if (field == "ordDate") {
      var ordTime = "";
      $(".ordrdatetime_error").html("");
      this.setState({
        seleted_ord_date: value,
        seleted_ord_time: ordTime,
        seleted_ord_slot: ordTime,
        seleted_ord_slotTxt: ordTime,
        seleted_ord_slot_str: ordTime,
        seleted_ord_slot_end: ordTime,
      });
    } else if (field == "ordTime") {
      var tmSltArr = value;
      var ordTime = "";
      $(".ordrdatetime_error").html("");
      this.setState({
        seleted_ord_time: tmSltArr["startTime"],
        seleted_ord_slot: ordTime,
        seleted_ord_slotTxt: ordTime,
        seleted_ord_slot_str: ordTime,
        seleted_ord_slot_end: ordTime,
      });
      var OrdDateTimeArr = Array();
      OrdDateTimeArr["OrdDate"] = tmSltArr["sldorddate"];
      OrdDateTimeArr["OrdTime"] = tmSltArr["sldordtime"];
    } else if (field == "ordSlotDate") {
      var ordTime = "";
      $(".ordrdatetime_error").html("");
      this.setState({
        seleted_ord_date: value,
        seleted_ord_time: ordTime,
        seleted_ord_slot: ordTime,
        seleted_ord_slotTxt: ordTime,
        seleted_ord_slot_str: ordTime,
        seleted_ord_slot_end: ordTime,
      });
    } else if (field == "ordSlotTime") {
      var tmSltArr = value;
      $(".ordrdatetime_error").html("");
      this.setState({
        seleted_ord_time: tmSltArr["startTime"],
        seleted_ord_slot: tmSltArr["ordSlotVal"],
        seleted_ord_slotTxt: tmSltArr["ordSlotLbl"],
        seleted_ord_slot_str: tmSltArr["ordSlotStr"],
        seleted_ord_slot_end: tmSltArr["ordSlotEnd"],
      });
      var OrdDateTimeArr = Array();
      OrdDateTimeArr["OrdDate"] = tmSltArr["sldorddate"];
      OrdDateTimeArr["OrdTime"] = tmSltArr["sldordtime"];
    }
  };
  updateStateValue = (field, value) => {
    this.setState({ [field]: value });
  };

  handleChange(name, e) {
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  applyPromoCode() {
    if (this.state.discountApplied === "Yes") {
      this.removePromoItems();
    } else {
      showLoader("applyPromo");
      const postObject = {
        uniqueID,
        customerID: this.state.customerID,
        promoCode: this.state.promoCode,
        subTotal: this.state.subtotal,
        availabilityID:this.state.seletedAvilablityId,
        cartID: this.state.cartDetails._id,
      };

      Axios.post(`${apiUrl}promotion/applypromo`, postObject)
        .then((res) => {
          hideLoader("applyPromo");
          if (res.data.status === "ok") {
            toast.success(res.data.message);
            this.setState(
              {
                discountApplied: "Yes",
                discount: res.data.promotionAmount,
                promoFreeDelivery:
                  res.data.promoFreeDelivery === true ? "Yes" : "No",
                redeemPoint: "",
                redeemPointAmount: "",
              },
              () => {
                cookie.save("discountApplied", "Yes", { path: "/" });
                cookie.save(
                  "promoFreeDelivery",
                  res.data.promoFreeDelivery === true ? "Yes" : "No",
                  { path: "/" }
                );
                cookie.save("discount", res.data.promotionAmount, {
                  path: "/",
                });
                cookie.save("promoCode", this.state.promoCode, { path: "/" });

                cookie.remove("redeemPoint", { path: "/" });
                cookie.remove("redeemPointAmount", { path: "/" });
                this.calculatePrice();
              }
            );
          }
        })
        .catch((e) => {
          hideLoader("applyPromo");
          var errorMsg = e?.response?.data?.massage ?? e.message;
          toast.error(errorMsg);
          this.calculatePrice();
        });
    }
  }

  applyRedeemPoints() {
    if (parseFloat(this.state.redeemPointAmount) > 0) {
      this.setState({ redeemPoint: "", redeemPointAmount: "" }, () => {
        cookie.remove("redeemPoint", { path: "/" });
        cookie.remove("redeemPointAmount", { path: "/" });
      });
    } else {
      showLoader("applyRedeemPoints");
      const postObject = {
        uniqueID,
        customerID: this.state.customerID,
        redeemPoint: this.state.redeemPoint,
      };

      Axios.post(`${apiUrl}order/redeemPoint`, postObject)
        .then((res) => {
          hideLoader("applyRedeemPoints");
          if (res.data.status === "ok") {
            toast.success(res.data.message);
            const result = res.data.result;
            this.removePromoItems();
            this.setState(
              {
                redeemPoint: result.applicablePoints,
                redeemPointAmount: result.redeemAmount,
              },
              () => {
                cookie.save("redeemPoint", result.applicablePoints, {
                  path: "/",
                });
                cookie.save("redeemPointAmount", result.redeemAmount, {
                  path: "/",
                });
                this.calculatePrice();
              }
            );
          }
        })
        .catch((e) => {
          hideLoader("applyRedeemPoints");
          var errorMsg = e?.response?.data?.message || e.message;
          toast.error(errorMsg);
        });
    }
  }

  removePromoItems() {
    this.setState(
      { discountApplied: "No", discount: 0, promoFreeDelivery: "No", promoCode:'' },
      () => {
        cookie.remove("discountApplied", { path: "/" });
        cookie.remove("promoCode", { path: "/" });
        cookie.remove("promoFreeDelivery", { path: "/" });
        cookie.remove("discount", { path: "/" });
        this.calculatePrice();
      }
    );
  }
  setOpen(open) {
    this.setState({open})
  }

  render() {
    const cartItem = this.state.cartDetails?.cartItem ?? [];
    return (
      <div className="cover">
        <Header
          trigerCart={this.state.trigerCart}
          updateStateValue={this.updateStateValue.bind(this)}
          loginPopup={this.state.loginPopup}
        />
        <div className="checkout-blankpage">
          <div className="container">
            <div className="continue-link cl-top">
              <Link to={"/products"}>Continue Shopping</Link>
            </div>

            <div className="checkout-grid">
              <div className="checkout-lhs">
                {this.state.deliveryCharegLoadingStatus === true && (
                  <div class="overlay" id="loaderOverlay">
                    <div className="delivery-loader-main">
                      <div class="loader-container">
                        <div class="box">
                          <img src={logo} alt="logo" />
                        </div>
                        <div class="progress-bar">
                          <div class="progress"></div>
                        </div>
                        <p class="text">Checking delivery charges...</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="appendix textcenter">
                  <h5>You're placing an order from</h5>
                  <p>
                    <b>{this.state.outletName}</b> for{" "}
                    <b>{this.state.seletedAvilablityName}</b> on{" "}
                    <b>{this.state.displyDate}</b> at{" "}
                    <b>
                      {showOrderTime(
                        this.state.seleted_ord_date,
                        this.state.seleted_ord_slot_str,
                        this.state.seleted_ord_slot_end,
                        this.state.slotType
                      )}
                    </b>
                  </p>
                </div>

                <div className="checkout-index">
                  {this.state.seletedAvilablityId === deliveryId ? (
                    <div className="checkout-index-top">
                      <h4>Delivery Details</h4>
                      <div className="da-order-merge-column">
                        <div
                          className={`da-order-two-handling ${
                            this.state.seletedAvilablityId === deliveryId
                              ? "delivery-outlet"
                              : "pickup-outlet da-order-single-handling-outlet"
                          }`}
                        >
                          <div className={`da-order-two-handling-lhs`}>
                            <h5>
                              {this.state.seletedAvilablityId === pickupId
                                ? "Pickup Outlet"
                                : "Outlet"}
                            </h5>
                            <strong>{this.state.outletName}</strong>
                            <p>{this.state.orderHandledOutlet}</p>
                          </div>
                          <div className="da-order-two-handling-rhs">
                            {this.state.seletedAvilablityId === deliveryId && (
                              <React.Fragment>
                                <h5>Delivery Location</h5>
                                <p>
                                  {addressFormat(
                                    this.state.unitNumber,
                                    this.state.floorNumber,
                                    localStorage.getItem("deliveryAddress"),
                                    localStorage.getItem("deliveryPostalCode"),
                                    CountryName
                                  )}
                                </p>
                              </React.Fragment>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="checkout-index-top">
                      <h4>Pickup Store Address</h4>
                      <div className="checkout-pickup-store-merge">
                        <div className="checkout-pickup-store-name">
                          <span>Store Name </span>
                          <h4>{this.state.outletName}</h4>
                        </div>
                        <div className="checkout-pickup-store-address">
                          <span>Store Address</span>

                          <p>{this.state.orderHandledOutlet}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="checkout-index-center">
                    <div className="checkout-contact-form">
                      <div className="select-delivery-slot-header">
                        <h3>Choose Date & Time</h3>
                      </div>
                      <OrderAdvancedDatetimeSlot
                        {...this.props}
                        hdrState={this.state}
                        setdateTimeFlg={this.setdateTimeFlg.bind(this)}
                        indutualText={true}
                        labelDateName={`${this.state.labelDateName} Date`}
                        labelTimeName={`${this.state.labelTimeName} Time`}
                        outletID={this.state.outletID}
                      />
                    </div>

                    {/* <div className="checkout-contact-form">
                      <h3>Contact Details</h3>
                      <div className="single-grid">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                          />
                        </div>
                      </div>
                      <div className="two-col-grid">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Email"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Phone Number"
                          />
                        </div>
                      </div>
                      <div className="single-grid">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Organisation Name"
                          />
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="checkout-recipient-form">
                      <h4>Recipients</h4>
                      <div className="single-grid">
                        <div className="form-group">
                          <input type="checkbox" className="checkbox-control" />
                          <label>This is for my friends or family</label>
                        </div>
                      </div>
                      <div className="two-col-grid">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Recipient Name"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Recipient Phone"
                          />
                        </div>
                      </div>
                    </div> */}
                  </div>
                  <div className="checkout-index-btm">
                    <h3>Additional Information</h3>

                    <div className="single-grid">
                      <div className="form-group">
                        <textarea
                          placeholder="Enter any order related instructions here"
                          value={this.state.additionalInformation}
                          onChange={this.handleChange.bind(
                            this,
                            "additionalInformation"
                          )}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="redeem-promo-together">
                    {this.state.globalSettings?.companyEnableLoyalty===true &&
                    <div className="checkout-reddeem-area">
                      <h6>Redeem Points </h6>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Points"
                          value={this.state.redeemPoint}
                          onChange={this.handleChange.bind(this, "redeemPoint")}
                          readOnly={
                            parseFloat(this.state.redeemPointAmount) > 0
                              ? true
                              : false
                          }
                        />
                        <button
                          className="button"
                          id="applyRedeemPoints"
                          onClick={this.applyRedeemPoints.bind(this)}
                        >
                          {parseFloat(this.state.redeemPointAmount) > 0
                            ? "Remove"
                            : "Apply"}
                        </button>
                      </div>
                      <div className="you-have">
                        You have <strong>{this.state.globalSettings?.customer?.customerAvailablePoints ?? 0}</strong> points
                      </div>
                      <div className="you-have-note">
                        <em>
                          Note: <strong>{this.state.globalSettings?.companyLoyaltyRedeemPoints ?? ''}</strong> points ={" "}
                          <strong>{showPriceDirect(this.state.globalSettings?.companyLoyaltyRedeemAmount ?? '')}</strong>
                        </em>
                      </div>
                    </div>}
                    <div className="checkout-promo-area">
                      <h6>Promo Code</h6>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Promo Code"
                          value={this.state.promoCode}
                          onChange={this.handleChange.bind(this, "promoCode")}
                          readOnly={
                            this.state.discountApplied === "Yes" ? true : false
                          }
                        />
                        <button
                          className="button"
                          onClick={this.applyPromoCode.bind(this)}
                          id="applyPromo"
                        >
                          {this.state.discountApplied === "Yes"
                            ? "Remove"
                            : "Apply"}
                        </button>
                      </div>
                      {/* <div className="you-have">
                        You have <strong>2</strong> Promotions
                      </div> */}
                    </div>
                  </div>
                  <div className="checkout-payment-area">
                    <h3>Payment method</h3>
                    <ul>
                      {this.state.companyEnableRapyd === true && (
                        <li className="active">
                          <div className="radio-round"></div>
                          <span>Credit card or Debit Card</span>
                        </li>
                      )}
                      {/* <li>
                        <div className="radio-round"></div>
                        <span>Pay by Cash</span>
                      </li> */}
                    </ul>
                  </div>
                  <div className="single-button-grid final-button">
                    <a
                      href="/"
                      className="button"
                      id="placeOrder"
                      onClick={this.continueProcess.bind(this)}
                    >
                      Checkout Now
                    </a>
                  </div>
                </div>
              </div>
              <div className="checkout-sidebar">
                {cartItem.length > 0 && (
                  <React.Fragment>
                    <div className="checkout-sidebar-header">
                      <span>Items</span>
                      <a href="/">Clear Items</a>
                    </div>
                    <div className="items-scroll">
                      {cartItem.map((item, index) => {
                        return (
                          <div
                            className="items-row"
                            key={index}
                            id={`citem${index}`}
                          >
                            <div className="item-img-container">
                              <img src={cartplaceholder} />
                            </div>
                            <div className="item-info-container">
                              <div className="item-info-title">
                                <h6>{item.cartItemProductName}</h6>
                                <div className="item-extrainfo-options">
                                  {item.cartItemProductComboSet.length > 0 &&
                                    item.cartItemProductComboSet.map(
                                      (comboitem, comboindex) => {
                                        return (
                                          <React.Fragment key={comboindex}>
                                            <p>
                                              <b>{comboitem.comboName}:</b>{" "}
                                            </p>
                                            {comboitem.products.length > 0 &&
                                              comboitem.products.map(
                                                (
                                                  comboProItem,
                                                  comboProIndex
                                                ) => {
                                                  return (
                                                    <p key={comboProIndex}>
                                                      {
                                                        comboProItem.productQuantity
                                                      }{" "}
                                                      X{" "}
                                                      {comboProItem.productName}{" "}
                                                      {parseFloat(
                                                        comboProItem.productPrice
                                                      ) > 0 ? (
                                                        <>
                                                          (+$
                                                          {parseFloat(
                                                            comboProItem.productPrice
                                                          )}
                                                          )
                                                        </>
                                                      ) : (
                                                        ""
                                                      )}
                                                    </p>
                                                  );
                                                }
                                              )}
                                          </React.Fragment>
                                        );
                                      }
                                    )}
                                  {item.cartItemNote !== "" && (
                                    <p>
                                      <strong>Note:</strong>
                                      {item.cartItemNote}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="item-quantity-box">
                                <span
                                  className="item-qty-inc"
                                  onClick={this.incDecQty.bind(
                                    this,
                                    item.cartItemQuantity,
                                    "dec",
                                    index,
                                    item._id
                                  )}
                                ></span>
                                <input
                                  type="text"
                                  value={item.cartItemQuantity}
                                  onChange={() => {}}
                                  className="item-count-box"
                                />
                                <span
                                  className="item-qty-dec"
                                  onClick={this.incDecQty.bind(
                                    this,
                                    item.cartItemQuantity,
                                    "inc",
                                    index,
                                    item._id
                                  )}
                                ></span>
                              </div>
                            </div>
                            <div className="item-price-action">
                              <div className="item-delete-action">
                                <a
                                  href="/"
                                  onClick={this.removeItem.bind(this, item._id)}
                                >
                                  <i
                                    className="fa fa-trash-o"
                                    aria-hidden="true"
                                  ></i>{" "}
                                </a>
                              </div>
                              <div className="item-price-end">
                                {" "}
                                {showPriceDirect(item.cartItemTotalPrice)}{" "}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </React.Fragment>
                )}
                <div className="items-footer">
                  <div className="item-price-row">
                    <p className="text-uppercase">SUBTOTAL</p>
                    <span>{showPriceDirect(this.state.subtotal)}</span>
                  </div>
                  {this.state.seletedAvilablityId === deliveryId &&
                    parseFloat(this.state.deliveryCharge) > 0 && (
                      <div className="item-price-row">
                        <p className="text-uppercase">Delivery</p>
                        <span>
                          {showPriceDirect(this.state.deliveryCharge)}{" "}
                        </span>
                      </div>
                    )}
                  {parseFloat(this.state.discount) > 0 && (
                    <div className="item-price-row">
                      <p className="text-uppercase">
                        Discount({this.state.promoCode})
                      </p>
                      <span>-{showPriceDirect(this.state.discount)} </span>
                    </div>
                  )}
                  {parseFloat(this.state.redeemPointAmount) > 0 && (
                    <div className="item-price-row">
                      <p className="text-uppercase">
                        Redeem Points ({this.state.redeemPoint})
                      </p>
                      <span>
                        -{showPriceDirect(this.state.redeemPointAmount)}{" "}
                      </span>
                    </div>
                  )}
                  {parseFloat(this.state.taxAmount) > 0 && (
                    <div className="item-price-row">
                      <p className="text-uppercase">
                        {this.state.taxType === "Inclusive" ? "Inclusive" : ""}{" "}
                        GST ({this.state.taxPercentage}%)
                      </p>{" "}
                      <span>{showPriceDirect(this.state.taxAmount)}</span>
                    </div>
                  )}
                  <div className="item-price-row item-grantprice-row ">
                    <p className="text-uppercase">Total</p>{" "}
                    <span>{showPriceDirect(this.state.grandTotal)}</span>
                  </div>
                  <div className="item-price-row">
                      <p className="text-uppercase">
                        You will Earn
                      </p>
                      <span>
                        10 Points
                      </span>
                    </div>
                </div>
                {/* this.state.seletedAvilablityId === deliveryId && (
                  <div className="progress-bar-main">
                    <div className="indication">
                      <div className="indication_progress">
                        <span className="hor-progress-bar"></span>
                      </div>
                      <p className="help-block">
                        S$145.50 more to FREE delivery!
                      </p>
                    </div>
                  </div>
                ) */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateTopProps = (state) => {
  let cartDetails = "";
  let totalItem = 0;
  let cartstatus = "";
  if (Object.keys(state.cartdetails).length > 0) {
    if (state.cartdetails[0].status === "ok") {
      cartDetails = state.cartdetails[0].result;
      totalItem = state.cartdetails[0].totalItem;
    } else {
      cartstatus = "faild";
    }
  }
  var globalSettings = [];
  if (Object.keys(state.settings).length > 0) {
    if (state.settings[0].status === "ok") {
      globalSettings = state.settings[0].result;
    }
  }

  return {
    cartDetails: cartDetails,
    totalItem: totalItem,
    cartstatus: cartstatus,
    settingsArr: globalSettings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCartDetail: () => {
      dispatch({ type: GET_CART_DETAIL });
    },
    getGlobalSettings: () => {
      dispatch({ type: GET_GLOBAL_SETTINGS });
    },
  };
};
export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(withRouter(Checkout));
