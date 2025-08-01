import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";
import { format } from "date-fns";
import $ from "jquery";
import Axios from "axios";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { GET_GLOBAL_SETTINGS } from "../../actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../common/images/logo.png";
import wishlist from "../../common/images/img/wishlist.svg";
import profile from "../../common/images/img/profile.svg";
import cartbag from "../../common/images/img/cart-bag.svg";
import mapicon from "../../common/images/map-icon.svg";
import time from "../../common/images/time-quarter.svg";
import cycle from "../../common/images/cycle.svg";
import navb from "../../common/images/img/nav-icon.svg";
import closei from "../../common/images/img/close-top.svg";
import menuicon from "../../common/images/menu-icon.svg";

import Cart from "./Cart";
import {
  showLoader,
  hideLoader,
  getReferenceID,
} from "../Settings/SettingHelper";
import { uniqueID, apiUrl, deliveryId } from "../Settings/Config";
import AvilablityPopup from "./AvilablityPopup";
class Header extends Component {
  constructor(props) {
    super(props);
    const customerID = localStorage.getItem("customerID") ?? "";
    const orderDateTime = cookie.load("orderDateTime") ?? "";
    const displyDate =
      orderDateTime !== ""
        ? format(new Date(orderDateTime.replaceAll('"', "")), "do MMM yyyy")
        : "";
    const displyTime =
      orderDateTime !== ""
        ? format(new Date(orderDateTime.replaceAll('"', "")), "hh:mm a")
        : "";
    const seletedAvilablityId = cookie.load("availability") ?? "";
    const seletedAvilablityName = cookie.load("availabilityName") ?? "";
    const slotType = cookie.load("slotType") ?? "";

    this.state = {
      customerID: customerID,
      seletedAvilablityId: seletedAvilablityId,
      seletedAvilablityName: seletedAvilablityName,
      trigerCart: this.props?.trigerCart ?? false,
      openCart: false,
      totalItem: 0,
      openPopup: false,
      loginopenPopup: false,
      popupType: "guestlogin",
      email: "",
      emailError: "",
      existCustomer: false,
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: "",
      otp6: "",
      otpError: "",

      firstName: "",
      lastName: "",
      mobile: "",
      terms: false,
      allowPromotion: false,

      firstNameError: "",
      lastNameError: "",
      mobileError: "",
      termsError: "",
      allowPromotionError: "",

      displyDate: displyDate,
      displyTime: displyTime,

      openAvailPopup: this.props?.openAvailPopup ?? false,
      allowOpenCart: false,
      reloadCartPage: false,

      slotType: slotType,
      orderSlotEndTime: "",
      orderSlotStrTime: "",
      allowDefaultAvilablity:"",
      allowDefaultAvilablityName:"",
      globalSettings:"",
    };

    this.otp1Ref = React.createRef();
    this.otp2Ref = React.createRef();
    this.otp3Ref = React.createRef();
    this.otp4Ref = React.createRef();
    this.otp5Ref = React.createRef();
    this.otp6Ref = React.createRef();
  }
  componentDidMount() {
    document.body.classList.remove("nav-active");
    setTimeout(() => {
      $("body").css("overflow", "scroll !important");
    }, 1000);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const triggerLogin = cookie.load("triggerLogin") ?? "";

    if (triggerLogin === "Yes") {
      cookie.remove("triggerLogin", { path: "/" });
      this.setState({ loginopenPopup: true, popupType: "login" });
      cookie.remove("triggerLogin", { path: "/" });
    }
    const triggerOrderType = cookie.load("triggerOrderType") ?? "";
    if (triggerOrderType === "Yes") {
      cookie.remove("triggerOrderType", { path: "/" });
      this.setState({ openAvailPopup: true });
    }

    let startTime = new Date();
    if (parseInt(this.state.slotType) === 2) {
      const orderSlotStrTime = cookie.load("orderSlotStrTime") ?? "";
      if (orderSlotStrTime !== "") {
        const orderSlotStrTime_ = orderSlotStrTime.split(":");
        startTime.setHours(orderSlotStrTime_[0]);
        startTime.setMinutes(orderSlotStrTime_[1]);
        this.setState({ orderSlotStrTime: format(startTime, "hh:mm a") });
      }
    }

    let endTime = new Date();

    if (parseInt(this.state.slotType) === 2) {
      const orderSlotEndTime = cookie.load("orderSlotEndTime") ?? "";
      if (orderSlotEndTime !== "") {
        const orderSlotEndTime_ = orderSlotEndTime.split(":");
        endTime.setHours(orderSlotEndTime_[0]);
        endTime.setMinutes(orderSlotEndTime_[1]);
        this.setState({ orderSlotEndTime: format(endTime, "hh:mm a") });
      }
    }

    this.props.getSettingDetail();
  }
  componentWillReceiveProps(PropsDt) {
    if (this.state.trigerCart !== PropsDt.trigerCart) {
      this.setState({ trigerCart: PropsDt.trigerCart }, function () {
        this.props.updateStateValue("trigerCart", PropsDt.trigerCart);
      });
    }

    if (this.state.openAvailPopup !== PropsDt.openAvailPopup) {
      this.setState({ openAvailPopup: PropsDt.openAvailPopup });
    }
    if (this.state.allowDefaultAvilablity !== PropsDt.allowDefaultAvilablity) {
      this.setState({ allowDefaultAvilablity: PropsDt.allowDefaultAvilablity, allowDefaultAvilablityName:PropsDt.allowDefaultAvilablityName });
    }
    if(this.state.globalSettings!==PropsDt.globalSettings) {
      this.setState({globalSettings:PropsDt.globalSettings})
    }
   
    
    /* if(this.state.loginopenPopup!==PropsDt.loginPopup) {
      alert(this.state.loginopenPopup)
      alert()
      this.setState({loginopenPopup:PropsDt.loginPopup})
    } */
  }
  openCart(e) {
    e.preventDefault();
    if (this.props.match.path !== "/checkout") {
      if (parseInt(this.state.totalItem) > 0) {
        if (this.state.seletedAvilablityId !== "") {
          this.setState({ openCart: true });
          document.body.classList.add("cart-sidebar-open");
        } else {
          this.props.updateStateValue("openAvailPopup", true);
          this.setState({ allowOpenCart: true, openAvailPopup: true });
        }
      }
    }
  }
  updateStateValue = (field, value) => {
    this.setState({ [field]: value }, () => {
      if (field === "trigerCart") {
        this.props.updateStateValue("trigerCart", value);
      } else if (field === "openPopup") {
        this.props.updateStateValue("openAvailPopup", value);
      }  else if (field === "allowDefaultAvilablity") {
        this.props.updateStateValue("allowDefaultAvilablity", value);
      } else if (field === "reloadCartPage") {
        const customerID_ = localStorage.getItem("customerID") ?? "";
        const orderDateTime_ = cookie.load("orderDateTime") ?? "";
        const displyDate_ =
          orderDateTime_ !== ""
            ? format(
                new Date(orderDateTime_.replaceAll('"', "")),
                "do MMM yyyy"
              )
            : "";
        const displyTime_ =
          orderDateTime_ !== ""
            ? format(new Date(orderDateTime_.replaceAll('"', "")), "hh:mm a")
            : "";
        const seletedAvilablityId_ = cookie.load("availability") ?? "";
        const seletedAvilablityName_ = cookie.load("availabilityName") ?? "";
        const slotType_ = cookie.load("slotType") ?? "";
        this.setState({
          customerID: customerID_,
          seletedAvilablityId: seletedAvilablityId_,
          seletedAvilablityName: seletedAvilablityName_,
          displyDate: displyDate_,
          displyTime: displyTime_,
          slotType: slotType_,
        });

        let endTime = new Date();
        const orderSlotEndTime = cookie.load("orderSlotEndTime") ?? "";
        if (orderSlotEndTime !== "") {
          const orderSlotEndTime_ = orderSlotEndTime.split(":");
          endTime.setHours(orderSlotEndTime_[0]);
          endTime.setMinutes(orderSlotEndTime_[1]);
          this.setState({ orderSlotEndTime: format(endTime, "hh:mm a") });
        }

        let startTime = new Date();
        const orderSlotStrTime = cookie.load("orderSlotStrTime") ?? "";
        if (orderSlotStrTime !== "") {
          const orderSlotStrTime_ = orderSlotStrTime.split(":");
          startTime.setHours(orderSlotStrTime_[0]);
          startTime.setMinutes(orderSlotStrTime_[1]);
          this.setState({ orderSlotStrTime: format(startTime, "hh:mm a") });
        }
      } else if (field === "totalItem") {
        this.setState({ totalItem: value });
      }
    });
  };
  openLogin(e) {
    e.preventDefault();
    if (this.state.customerID !== "") {
      this.props.history.push("/myprofile");
    } else {
      this.setState({ loginopenPopup: true });
    }
  }
  handleChange(name, e) {
    const value = e.target.value;

    if (name.indexOf("otp") >= 0) {
      this.setState({ [name]: "" }, () => {
        this.setState({ [name]: value, [`${name}Error`]: "" });
      });
      var lastFive = name.slice(-1);

      if (lastFive === "1") {
        if (value === "") {
          this.otp1Ref.current?.focus();
        } else {
          this.otp2Ref.current?.focus();
        }
      } else if (lastFive === "2") {
        if (value === "") {
          this.otp1Ref.current?.focus();
        } else {
          this.otp3Ref.current?.focus();
        }
      } else if (lastFive === "3") {
        if (value === "") {
          this.otp2Ref.current?.focus();
        } else {
          this.otp4Ref.current?.focus();
        }
      } else if (lastFive === "4") {
        if (value === "") {
          this.otp3Ref.current?.focus();
        } else {
          this.otp5Ref.current?.focus();
        }
      } else if (lastFive === "5") {
        if (value === "") {
          this.otp4Ref.current?.focus();
        } else {
          this.otp6Ref.current?.focus();
        }
      } else if (lastFive === "6") {
        if (value === "") {
          this.otp5Ref.current?.focus();
        } else {
          this.otp6Ref.current?.focus();
        }
      }
    } else if (name === "allowPromotion" || name === "terms") {
      var checked = e.target.checked;
      this.setState({ [name]: checked, [`${name}Error`]: "" });
    } else if (name === "mobile") {
      const value_ = value.replace(/[^0-9]/g, "");
      this.setState({ [name]: value_, [`${name}Error`]: "" }, ()=> {
        if(value_.length===8) {
          this.getCustomerByPhone();
        }
      });
    } else {
      this.setState({ [name]: value, [`${name}Error`]: "" });
    }
  }
  onPasteCaptureHandler(e) {
    var clipboardData, pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData("Text");

    // Do whatever with pasteddata
    if (pastedData !== "") {
      var split = pastedData.split("");
      this.setState({ otp1: split[0] });
      this.setState({ otp2: split[1] });
      this.setState({ otp3: split[2] });
      this.setState({ otp4: split[3] });
      this.setState({ otp5: split[4] });
      this.setState({ otp6: split[5] });
    }
  }

  loginCustomer() {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (this.state.email === "") {
      this.setState({ emailError: "This field is required" });
    } else {
      if (!regex.test(this.state.email)) {
        this.setState({ emailError: "Invalid Email" });
      } else {
        this.setState({ emailError: "" });
        showLoader("login");
        const postObject = {
          uniqueID,
          email: this.state.email,
        };
        Axios.post(apiUrl + "customer/login", postObject)
          .then((res) => {
            hideLoader("login");
            if (res.data.status === "ok") {
              this.setState({
                popupType: "otpverify",
                existCustomer: res.data.existCustomer,
              });
            } else {
              toast.error(res.data.message);
            }
          })
          .catch((e) => {
            var errorMsg = e?.response?.data?.message || e.message;
            toast.error(errorMsg);
            hideLoader("login");
            console.error("Error fetching data:", e);
          });
      }
    }
  }

  confirmOTP() {
    this.setState({ emailError: "" });
    showLoader("verifyOTP");
    const otp = `${this.state.otp1}${this.state.otp2}${this.state.otp3}${this.state.otp4}${this.state.otp5}${this.state.otp6}`;
    if (otp !== "") {
      if (otp.length === 6) {
        const postObject = {
          uniqueID,
          email: this.state.email,
          otp: otp,
          existCustomer: this.state.existCustomer,
        };
        Axios.post(apiUrl + "customer/verifyOTP", postObject)
          .then((res) => {
            hideLoader("verifyOTP");
            if (res.data.status === "ok") {
              if (this.state.existCustomer === true) {
                this.setState({ loginopenPopup: false });
                const result = res.data.result;
                localStorage.setItem("customerID", result.customerID);
                localStorage.setItem("firstName", result.firstName);
                localStorage.setItem("lastName", result.lastName);
                localStorage.setItem("email", result.email);
                localStorage.setItem("mobile", result.mobile);
                localStorage.setItem("token", result.token);
                this.setState({ customerID: result.customerID }, () => {
                  this.updateCartCustomer();
                });
                toast.success("Login Success");
              } else {
                this.setState({ popupType: "register" });
              }
            } else {
              toast.error(res.data.message);
            }
          })
          .catch((e) => {
            console.log(e);
            var errorMsg = e?.response?.data?.message || e.message;
            toast.error(errorMsg);
            hideLoader("verifyOTP");
            console.error("Error fetching data:", e);
          });
      } else {
        this.setState({ otpError: "OPT must be 6 characters" });
      }
    } else {
      this.setState({ otpError: "OTP is required" });
    }
  }

  confirmRegistration() {
    let error = 0;
    if (this.state.firstName === "") {
      this.setState({ firstNameError: "This field is required" });
      error++;
    } else {
      this.setState({ firstNameError: "" });
    }

    if (this.state.mobile === "") {
      this.setState({ mobileError: "This field is required" });
      error++;
    } else {
      if (this.state.mobile.length === 8) {
        this.setState({ mobileError: "" });
      } else {
        this.setState({ mobileError: "Mobile Number not a valid" });
        error++;
      }
    }
    if (this.state.terms === false) {
      this.setState({ termsError: "This field is required" });
      error++;
    } else {
      this.setState({ termsError: "" });
    }
    if (this.state.allowPromotion === false) {
      this.setState({ allowPromotionError: "This field is required" });
      error++;
    } else {
      this.setState({ allowPromotionError: "" });
    }

    if (error === 0) {
      showLoader("registion");
      const otp = `${this.state.otp1}${this.state.otp2}${this.state.otp3}${this.state.otp4}${this.state.otp5}${this.state.otp6}`;
      if (otp !== "") {
        if (otp.length === 6) {
          const postObject = {
            uniqueID,
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            mobile: this.state.mobile,
            terms: this.state.terms,
            allowPromotion: this.state.allowPromotion,
          };
          Axios.post(apiUrl + "customer/registration", postObject)
            .then((res) => {
              hideLoader("registion");
              if (res.data.status === "ok") {
                this.setState({ loginopenPopup: false });
                const result = res.data.result;
                localStorage.setItem("customerID", result.customerID);
                localStorage.setItem("firstName", result.firstName);
                localStorage.setItem("lastName", result.lastName);
                localStorage.setItem("email", result.email);
                localStorage.setItem("mobile", result.mobile);
                localStorage.setItem("token", result.token);
                toast.success("Register Success");
                this.setState({ customerID: result.customerID }, () => {
                  this.updateCartCustomer();
                });
              } else {
                toast.error(res.data.message);
              }
            })
            .catch((e) => {
              console.log(e);
              var errorMsg = e?.response?.data?.massage || e.message;
              toast.error(errorMsg);
              hideLoader("registion");
              console.error("Error fetching data:", e);
            });
        } else {
          this.setState({ otpError: "OPT must be 6 characters" });
        }
      } else {
        this.setState({ otpError: "OTP is required" });
      }
    }
  }
  getCustomerByPhone() {
    const postObject = {
      uniqueID,
      mobile: this.state.mobile,
    };
    Axios.post(apiUrl + "customer/getCustomerByPhone", postObject)
      .then((res) => {
         if (res.data.status === "ok") {
          const result = res.data.result;
          const firstName = result?.firstName ?? '';
          this.setState({
            email:result?.email ?? '',
            firstName: result?.firstName ?? '',
            terms:  false,
            firstNameError: firstName!=="" && firstName!==null ? "": "This field is required",
          })
         }
      }).catch((e) => {
        console.error("Error fetching data:", e);
      });
  }

  confirmGustLogin() {
    let error = 0;
    if (this.state.firstName === "") {
      this.setState({ firstNameError: "This field is required" });
      error++;
    } else {
      this.setState({ firstNameError: "" });
    }

    if (this.state.mobile === "") {
      this.setState({ mobileError: "This field is required" });
      error++;
    } else {
      if (this.state.mobile.length === 8) {
        this.setState({ mobileError: "" });
      } else {
        this.setState({ mobileError: "Mobile Number not a valid" });
        error++;
      }
    }
    if (this.state.terms === false) {
      this.setState({ termsError: "This field is required" });
      error++;
    } else {
      this.setState({ termsError: "" });
    }
    
    if (error === 0) {
      showLoader("guestlogin");
      const postObject = {
        uniqueID,
        email: this.state.email,
        firstName: this.state.firstName,
        mobile: this.state.mobile,
        terms: false,
        allowPromotion: false,
        customerSource:'Ecommerce'
      };
      Axios.post(apiUrl + "customer/guestLogin", postObject)
        .then((res) => {
          hideLoader("guestlogin");
          if (res.data.status === "ok") {
            this.setState({ loginopenPopup: false });
            const result = res.data.result;
            localStorage.setItem("customerID", result.customerID);
            localStorage.setItem("firstName", result.firstName);
            localStorage.setItem("lastName", result.lastName);
            localStorage.setItem("email", result.email);
            localStorage.setItem("mobile", result.mobile);
            localStorage.setItem("token", result.token);
            toast.success("Login Success");
            this.setState({ customerID: result.customerID }, () => {
              this.updateCartCustomer();
            });
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((e) => {
          console.log(e);
          var errorMsg = e?.response?.data?.massage || e.message;
          toast.error(errorMsg);
          hideLoader("guestlogin");
          console.error("Error fetching data:", e);
        });
    }
  }
  updateCartCustomer() {
    const referenceID = getReferenceID();
    const postObject = {
      uniqueID,
      customerID: this.state.customerID,
      referenceID: referenceID,
    };
    Axios.post(apiUrl + "cart/updateCustomer", postObject)
      .then((res) => {
        this.setState({ trigerCart: true });

        const redirect = cookie.load("redirect") ?? "";
        if (redirect !== "") {
          cookie.remove("redirect", { path: "/" });
          this.props.history.push(`/${redirect}`);
        }
      })
      .catch((e) => {
        this.setState({ trigerCart: true });
        setTimeout(() => {
          const redirect = cookie.load("redirect") ?? "";
          if (redirect !== "") {
            cookie.remove("redirect", { path: "/" });
            this.props.history.push(`/${redirect}`);
          } else {
            this.props.history.push("/myprofile");
          }
        }, 300);

        console.error("Error fetching data:", e);
      });
  }

  maskEmail(email) {
    if (email !== "") {
      const [username, domain] = email.split("@"); // Split email into username & domain
      if (username.length <= 3) {
        return `${username[0]}***@${domain}`; // If username is short, show only first letter
      }
      return `${username.substring(0, 3)}******@${domain}`; // Mask after first 3 chars
    }
  }

  openAvail(e) {
    e.preventDefault();
    this.setState({ openAvailPopup: true });
  }

  render() {
    console.log(this.state.globalSettings, 'globalSettingsglobalSettings')
    return (
      <React.Fragment>
        <header>
          <div className="header-block">
            <div className="container">
              <div className="header-inner">
                <div className="res-nav-profile">
                  <div className="nav-icon">
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        document.body.classList.add("nav-active");
                      }}
                    >
                      <img src={navb} alt="Nav" />
                    </a>
                  </div>
                  <div className="nav-profile">
                    <a href="/" onClick={this.openLogin.bind(this)}>
                      <img src={profile} alt="profile" />
                    </a>
                  </div>
                </div>
                <div className="header-logo">
                  <Link to={"/"}>
                    <img src={logo} alt="logo" />
                  </Link>
                </div>
                <div className="header-rhs">
                  <div className="header-inputs">
                    {this.state.seletedAvilablityId === deliveryId && (
                      <div className="input-dl">
                        <div className="rel in-parent">
                          <div className="sdl-input">
                            {localStorage.getItem("deliveryPostalCode") ??
                              "Select delivery Location"}
                          </div>
                          <img className="sdl-map" src={mapicon} alt="map" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`input-dl ${
                        parseInt(this.state.slotType) === 2 ? "slotType" : ""
                      }`}
                    >
                      <div className="rel in-parent">
                        <div className="sdl-input">
                          {this.state.displyDate !== "" ? (
                            <React.Fragment>
                              <b>{this.state.displyDate}</b> at{" "}
                              <b>
                                {parseInt(this.state.slotType) === 1 ? (
                                  this.state.displyTime
                                ) : (
                                  <>
                                    {this.state.orderSlotStrTime} -{" "}
                                    {this.state.orderSlotEndTime}
                                  </>
                                )}
                              </b>
                            </React.Fragment>
                          ) : (
                            "Select Date & Time"
                          )}
                        </div>
                        <img className="sdl-time" src={time} alt="time" />
                      </div>
                    </div>
                    <div className="pick-item">
                      <a
                        href="/"
                        className="pick-item-link"
                        onClick={this.openAvail.bind(this)}
                      >
                        <span>
                          <img src={cycle} alt="cycle" />{" "}
                          {this.state.seletedAvilablityName !== ""
                            ? this.state.seletedAvilablityName
                            : "Order Now"}
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="header-info">
                    <div className="view-menu">
                      <Link to="/products">
                        <img src={menuicon} alt="View Menu" />
                      </Link>
                    </div>
                    <div className="header-profile">
                      <a href="/" onClick={this.openLogin.bind(this)}>
                        <img src={profile} alt="profile" />
                      </a>
                    </div>
                    <div className="header-wishlist">
                      <a href="/">
                        <img src={wishlist} alt="wishlist" />
                      </a>
                    </div>
                    <div className="header-cart">
                      <a
                        href="/"
                        className="header-cart-link"
                        onClick={this.openCart.bind(this)}
                      >
                        <img src={cartbag} className="cart-img" alt="cartbag" />
                        <span className="item-count">
                          {this.state.totalItem}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mobile-pick-item">
            <div className="mp-lhs">
              <div className="mp-lhs-iner">
                {this.state.displyDate !== "" ? (
                  <React.Fragment>
                    <b>{this.state.displyDate}</b>
                    <span>at</span>{" "}
                    <b>
                      {parseInt(this.state.slotType) === 1 ? (
                        this.state.displyTime
                      ) : (
                        <>
                          {this.state.orderSlotStrTime} -{" "}
                          {this.state.orderSlotEndTime}
                        </>
                      )}
                    </b>
                  </React.Fragment>
                ) : (
                  "Select Date & Time"
                )}
              </div>
              <img className="sdl-time" src={time} alt="time" />
            </div>
            <div className="mp-rhs">
              <a
                href="/"
                className="pick-item-link"
                onClick={this.openAvail.bind(this)}
              >
                <span>
                  <img src={cycle} alt="cycle" />{" "}
                  {this.state.seletedAvilablityName !== ""
                    ? this.state.seletedAvilablityName
                    : "Order Now"}
                </span>
              </a>
            </div>
          </div>
          <Cart
            trigerCart={this.state.trigerCart}
            openCart={this.state.openCart}
            reloadCartPage={this.state.reloadCartPage}
            updateStateValue={this.updateStateValue.bind(this)}
          />
        </header>
        <div className="nav-sidebar">
          <a
            href="/"
            className="menu-close"
            onClick={(e) => {
              e.preventDefault();
              document.body.classList.remove("nav-active");
            }}
          >
            <i class="fa fa-times" aria-hidden="true"></i>
          </a>
          <div className="nav__content">
            <ul>
              <li className="nav__list-item">
                <Link to={"/"}>Home</Link>
              </li>
              <li className="nav__list-item">
                <Link to={"/about-us"}>About Us</Link>
              </li>
              <li className="nav__list-item">
                <Link to={"/outlets"}>Our Outlets</Link>
              </li>
              <li className="nav__list-item">
                <Link to={"/contactus"}>Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
        <Popup
          open={this.state.loginopenPopup}
          onClose={() => this.setState({ loginopenPopup: false })}
          modal
          closeOnDocumentClick={false}
          className="popup-master-small"
        >
          <div className="popup-cover">
            {/* Login Popup */}
            {this.state.popupType === "login" && (
              <div className="login-region">
                <div className="pm-close">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ loginopenPopup: false });
                    }}
                  >
                    <img className="close-top" src={closei} alt="close" />
                  </a>
                </div>
                <div className="pm-header">
                  <h4>Your account</h4>
                  <span>Log in or sign up to get started. </span>
                </div>
                <div className="form-group">
                  <label class="control-label">Email</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter your mail*"
                    value={this.state.email}
                    onChange={this.handleChange.bind(this, "email")}
                  />
                  {this.state.emailError !== "" && (
                    <span className="error">{this.state.emailError}</span>
                  )}
                </div>
                <div className="guestlogin">
                <a href="/" onClick={(e) => {
                      e.preventDefault();
                      this.setState({ popupType: "guestlogin" });
                    }} >Login With Guest</a>
</div>
                <div className="pm-single-button">
                  <button
                    className="button"
                    id="guestlogin"
                    onClick={this.loginCustomer.bind(this)}
                  >
                    Log in
                  </button>
                </div>
              </div>
            )}
            {this.state.popupType === "guestlogin" && (
              <div className="create-account-region">
                <div className="pm-close">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ loginopenPopup: false });
                    }}
                  >
                    <img className="close-top" src={closei} alt="close" />
                  </a>
                </div>
                <div className="pm-header">
                  <h4>Express Login</h4>
                </div>
                <div className="create-account-form">
                  <div className="form-group">
                    <label class="control-label">Mobile Number*</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Mobile Number"
                      value={this.state.mobile}
                      maxLength={8}
                      onChange={this.handleChange.bind(this, "mobile")}
                    />
                    {this.state.mobileError !== "" && (
                      <span className="error">{this.state.mobileError}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label class="control-label">First Name*</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter First Name"
                      value={this.state.firstName}
                      onChange={this.handleChange.bind(this, "firstName")}
                    />
                    {this.state.firstNameError !== "" && (
                      <span className="error">{this.state.firstNameError}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label class="control-label">Enter your mail*</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter your mail*"
                      value={this.state.email}
                      onChange={this.handleChange.bind(this, "email")}
                    />
                    {this.state.mobileError !== "" && (
                      <span className="error">{this.state.emailError}</span>
                    )}
                  </div>
                  <div className="form-group-checkbox">
                    <input
                      type="checkbox"
                      checked={this.state.terms}
                      onChange={this.handleChange.bind(this, "terms")}
                    />
                    <span>
                      By creating an account, I agree with the,{" "}
                      <a href="/privacy-policy" target="_blank">Terms & Conditions</a> and the{" "}
                      <a href="/terms-and-conditions" target="_blank">Privacy Policy</a>
                    </span>
                  </div>
                  {this.state.termsError !== "" && (
                    <div>
                      <span className="error">{this.state.termsError}</span>
                    </div>
                  )}
                </div>
                <div className="spacer"> </div>
                <div className="pm-single-button">
                  <button
                    className="button"
                    id="registion"
                    onClick={this.confirmGustLogin.bind(this)}
                  >
                    Login
                  </button>
                </div>
              </div>
            )}

            {/* Verification Popup */}
            {this.state.popupType === "otpverify" && (
              <div className="verification-region">
                <div className="pm-close">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ loginopenPopup: false });
                    }}
                  >
                    <img className="close-top" src={closei} alt="close" />
                  </a>
                </div>
                <div className="pm-header">
                  <h4>Enter verification code</h4>
                  <span>
                    Please enter the 6-digit verification code that was sent to{" "}
                    {this.maskEmail(this.state.email)}
                  </span>
                </div>

                <div className="verfication-box-form">
                  <div className="form-group">
                    <input
                      className="form-control"
                      maxLength="1"
                      id="otp1"
                      type="text"
                      ref={this.otp1Ref}
                      value={this.state.otp1}
                      onChange={this.handleChange.bind(this, "otp1")}
                      onPasteCapture={this.onPasteCaptureHandler.bind(this)}
                      autoComplete="off"
                    />
                    <input
                      className="form-control"
                      maxLength="1"
                      id="otp2"
                      type="text"
                      ref={this.otp2Ref}
                      value={this.state.otp2}
                      onChange={this.handleChange.bind(this, "otp2")}
                      autoComplete="off"
                    />
                    <input
                      className="form-control"
                      maxLength="1"
                      id="otp3"
                      type="text"
                      ref={this.otp3Ref}
                      value={this.state.otp3}
                      onChange={this.handleChange.bind(this, "otp3")}
                      autoComplete="off"
                    />
                    <input
                      className="form-control"
                      maxLength="1"
                      id="otp4"
                      type="text"
                      ref={this.otp4Ref}
                      value={this.state.otp4}
                      onChange={this.handleChange.bind(this, "otp4")}
                      autoComplete="off"
                    />
                    <input
                      className="form-control"
                      maxLength="1"
                      id="otp5"
                      type="text"
                      ref={this.otp5Ref}
                      value={this.state.otp5}
                      onChange={this.handleChange.bind(this, "otp5")}
                      autoComplete="off"
                    />
                    <input
                      className="form-control"
                      maxLength="1"
                      id="otp6"
                      type="text"
                      ref={this.otp6Ref}
                      value={this.state.otp6}
                      onChange={this.handleChange.bind(this, "otp6")}
                      autoComplete="off"
                    />
                    {this.state.otpError !== "" && (
                      <span className="error">{this.state.otpError}</span>
                    )}
                  </div>
                  <div className="form-group-link">
                    <a href="/">I haven’t received the code </a>
                  </div>
                </div>

                <div className="pm-single-button">
                  <button
                    className="button"
                    id="verifyOTP"
                    onClick={this.confirmOTP.bind(this)}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {/* Create Account Popup */}
            {this.state.popupType === "register" && (
              <div className="create-account-region">
                <div className="pm-close">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ loginopenPopup: false });
                    }}
                  >
                    <img className="close-top" src={closei} alt="close" />
                  </a>
                </div>
                <div className="pm-header">
                  <h4>Create your account</h4>
                  <span>Update your informations and continue</span>
                </div>
                <div className="create-account-form">
                  <div className="form-group">
                    <label class="control-label">First Name*</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter First Name"
                      value={this.state.firstName}
                      onChange={this.handleChange.bind(this, "firstName")}
                    />
                    {this.state.firstNameError !== "" && (
                      <span className="error">{this.state.firstNameError}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label class="control-label">Last Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Last Name"
                      value={this.state.lastName}
                      onChange={this.handleChange.bind(this, "lastName")}
                    />
                  </div>
                  <div className="form-group">
                    <label class="control-label">Mobile Number*</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Mobile Number"
                      value={this.state.mobile}
                      maxLength={8}
                      onChange={this.handleChange.bind(this, "mobile")}
                    />
                    {this.state.mobileError !== "" && (
                      <span className="error">{this.state.mobileError}</span>
                    )}
                  </div>
                  <div className="form-group-checkbox">
                    <input
                      type="checkbox"
                      checked={this.state.terms}
                      onChange={this.handleChange.bind(this, "terms")}
                    />
                    <span>
                      By creating an account, I agree with the,{" "}
                      <a href="/privacy-policy" target="_blank">Terms & Conditions</a> and the{" "}
                      <a href="/terms-and-conditions" target="_blank">Privacy Policy</a>
                    </span>
                  </div>
                  {this.state.termsError !== "" && (
                    <div>
                      <span className="error">{this.state.termsError}</span>
                    </div>
                  )}

                  <div className="form-group-checkbox">
                    <input
                      type="checkbox"
                      checked={this.state.allowPromotion}
                      onChange={this.handleChange.bind(this, "allowPromotion")}
                    />
                    <span>
                      i agree to receive communications on email and phone
                    </span>
                  </div>
                  {this.state.allowPromotionError !== "" && (
                    <div>
                      <span className="error">
                        {this.state.allowPromotionError}
                      </span>
                    </div>
                  )}
                </div>
                <div className="spacer"> </div>
                <div className="pm-single-button">
                  <button
                    className="button"
                    id="registion"
                    onClick={this.confirmRegistration.bind(this)}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </Popup>
        <ToastContainer autoClose={3000} />
        <AvilablityPopup
          {...this.props}
          openPopup={this.state.openAvailPopup}
          openCart={this.state.allowOpenCart}
          allowDefaultAvilablity={this.state.allowDefaultAvilablity}
          allowDefaultAvilablityName={this.state.allowDefaultAvilablityName}
          updateStateValue={this.updateStateValue.bind(this)}
        />
      </React.Fragment>
    );
  }
}

const mapStateTopProps = (state) => {
  var globalSettings = "";
  if (Object.keys(state.settings).length > 0) {
    if (state.settings[0].status === "ok") {
      globalSettings = state.settings[0].result;
    }
  }
  return {
    globalSettings: globalSettings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSettingDetail: () => {
      dispatch({ type: GET_GLOBAL_SETTINGS });
    },
  };
};
export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(withRouter(Header));
