import React, { Component, createRef } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";
import { toast } from "react-toastify";
import { GET_CART_DETAIL } from "../../actions";
import Axios from "axios";
import { IonFooter } from "@ionic/react";
import "@ionic/react/css/core.css";
import { format } from "date-fns";
import closei from "../../common/images/img/close-top.svg";
import cartplaceholder from "../../common/images/placeholder.jpg";
import {
  showPriceDirect,
  encodeValue,
  showLoader,
  hideLoader,
  getReferenceID,
  addressFormat,
  getGstValue,
  getReverseGST
} from "../Settings/SettingHelper";
import {
  apiUrl,
  CountryName,
  deliveryId,
  pickupId,
  uniqueID,
} from "../Settings/Config";
/* import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
if (Capacitor.getPlatform() !== 'web') {
  Keyboard.setResizeMode({ mode: 'none' });
}
 */
class Cart extends Component {
  constructor(props) {
    super(props);
    const seletedAvilablityId = cookie.load("availability") ?? "";
    const orderHandledOutlet = cookie.load("orderHandledOutlet") ?? "";
    const outletName = cookie.load("outletName") ?? "";
    const deliveryUnitNumber = localStorage.getItem("deliveryUnitNumber") ?? "";
    const deliveryFloorNumber =
      localStorage.getItem("deliveryFloorNumber") ?? "";
    const slotType = cookie.load("slotType") ?? "";

    this.state = {
      seletedAvilablityId: seletedAvilablityId,
      orderHandledOutlet: orderHandledOutlet,
      outletName: outletName,
      deliveryUnitNumber: deliveryUnitNumber,
      deliveryFloorNumber: deliveryFloorNumber,
      deliveryUnitNumberError: "",
      trigerCart: false,
      cartDetails: "",
      totalItem: 0,
      subtotal: 0,
      taxType:"",
      taxAmount: 0,
      taxPercentage: 0,
      grandTotal: 0,
      cartstatus: "",
      globalSettings: "",
      reloadCartPage: false,

      slotType: slotType,
      orderSlotEndTime: "",
      orderSlotStrTime: "",
      firstTime:false,

      isAddressBarVisible: true,
      initialHeight: window.innerHeight,
    };
    this.wrapperRef = createRef();
  }
  componentDidMount() {
    let startTime = new Date();
    if (parseInt(this.state.slotType) === 2) {
      const orderSlotStrTime = cookie.load("orderSlotStrTime") ?? "";
      if (orderSlotStrTime !== "") {
        const orderSlotStrTime_ = orderSlotStrTime.split(":");
        startTime.setHours(orderSlotStrTime_[0]);
        startTime.setMinutes(orderSlotStrTime_[1]);
      }
      this.setState({ orderSlotStrTime: format(startTime, "hh:mm a") });
    }

    let endTime = new Date();

    if (parseInt(this.state.slotType) === 2) {
      const orderSlotEndTime = cookie.load("orderSlotEndTime") ?? "";
      if (orderSlotEndTime !== "") {
        const orderSlotEndTime_ = orderSlotEndTime.split(":");
        endTime.setHours(orderSlotEndTime_[0]);
        endTime.setMinutes(orderSlotEndTime_[1]);
      }
      this.setState({ orderSlotEndTime: format(endTime, "hh:mm a") });
    }

    this.props.getCartDetail();
   
    if (this.props.openCart) {
      document.addEventListener('click', this.handleClickOutside);
    }
    this.handleResize();
    window.addEventListener('resize', this.handleResize);

  }
  componentDidUpdate(prevProps) {
    // If openCart changed
    if (!prevProps.openCart && this.props.openCart) {
      // Cart just opened
      document.addEventListener('click', this.handleClickOutside);
    } else if (prevProps.openCart && !this.props.openCart) {
      // Cart just closed
      document.removeEventListener('click', this.handleClickOutside);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);

    window.removeEventListener('resize', this.handleResize);
  }
  

  componentWillReceiveProps(PropsDt) {
    if (this.state.trigerCart !== PropsDt.trigerCart) {
      this.setState({ trigerCart: PropsDt.trigerCart }, function () {
        if (this.state.trigerCart === true) {
          this.props.getCartDetail();
          this.props.updateStateValue("trigerCart", false);
        }
      });
    }
    if (this.state.cartDetails !== PropsDt.cartDetails) {
      this.setState(
        { cartDetails: PropsDt.cartDetails, totalItem: PropsDt.totalItem },
        () => {
          if(PropsDt.totalItem===0) {
            this.closeCart()
            this.setState({firstTime:false})
          }
          this.props.updateStateValue("totalItem", PropsDt.totalItem);
          this.calculatePrice();
        }
      );
    }
    if (this.state.globalSettings !== PropsDt.settingsArr) {
      this.setState(
        {
          globalSettings: PropsDt.settingsArr,
        },
        () => {
          this.calculatePrice();
        }
      );
    }

    if (this.state.reloadCartPage !== PropsDt.reloadCartPage) {
      this.setState({ reloadCartPage: PropsDt.reloadCartPage }, () => {
        if (PropsDt.reloadCartPage === true) {
          setTimeout(() => {
            const seletedAvilablityId = cookie.load("availability") ?? "";
            const orderHandledOutlet = cookie.load("orderHandledOutlet") ?? "";
            const outletName = cookie.load("outletName") ?? "";
            const deliveryUnitNumber =
              localStorage.getItem("deliveryUnitNumber") ?? "";
            const deliveryFloorNumber =
              localStorage.getItem("deliveryFloorNumber") ?? "";
            this.setState(
              {
                seletedAvilablityId: seletedAvilablityId,
                orderHandledOutlet: orderHandledOutlet,
                outletName: outletName,
                deliveryUnitNumber: deliveryUnitNumber,
                deliveryFloorNumber: deliveryFloorNumber,
              },
              () => {
                this.props.updateStateValue("reloadCartPage", false);
              }
            );
          }, 500);
        }
      });
    }
  }
  handleResize = () => {
    const currentHeight = window.innerHeight;
    const { initialHeight } = this.state;
    const heightDiff = initialHeight - currentHeight;

    // Heuristic: if height drops more than 100px, assume address bar is showing
    this.setState({
      isAddressBarVisible: heightDiff > 100,
    });
  };

  handleClickOutside = (event) => {
    if(this.state.firstTime===true) {
      
    if (this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      this.closeCart();
    } 
    }else {
      this.setState({firstTime:true})
    }
  };
  calculatePrice() {
    const cartItem_ = this.state.cartDetails?.cartItem ?? [];
    const subtotal = cartItem_.reduce(
      (sum, item) => sum + item.cartItemTotalPrice,
      0
    );

    const globalSettings = this.state.globalSettings;
    const companyEnableTax = globalSettings?.companyEnableTax ?? false;
    let taxAmount = 0;
    let taxPercentage = 0;
    let taxType = "";
    if (companyEnableTax === true) {
      const companyEnableTaxPercentage =
        globalSettings?.companyEnableTaxPercentage ?? 0;
      taxType = globalSettings?.companyTaxType ?? "";
      if (parseFloat(companyEnableTaxPercentage) > 0) {
        taxAmount = (taxType==="Inclusive")?getReverseGST(companyEnableTaxPercentage, subtotal):getGstValue(companyEnableTaxPercentage, subtotal, "format");
        taxPercentage = companyEnableTaxPercentage;
      }
    }

    let grandTotal = parseFloat(subtotal) + parseFloat(taxAmount);
    if(taxType==="Inclusive") {
      grandTotal = parseFloat(subtotal);
    }
    this.setState({
      subtotal: parseFloat(subtotal).toFixed('2'),
      taxAmount: parseFloat(taxAmount).toFixed('2'),
      taxPercentage: taxPercentage,
      taxType:taxType,
      grandTotal: parseFloat(grandTotal).toFixed('2'),
    });
  }

  closeCart(e) {
    const event = e ?? '';
    if(event!=="") {
      e.preventDefault();
    }
    this.setState({firstTime:false})
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
    const customerID = localStorage.getItem("customerID") ?? "";
    const referenceID = customerID === "" ? getReferenceID() : "";
    const postObject = {
      uniqueID: uniqueID,
      customerID: customerID,
      referenceID: referenceID,
      itemQuantity: cartItemQuantity,
    };

    Axios.put(`${apiUrl}cart/${encodeValue(itemID)}`, postObject)
      .then((res) => {
        hideLoader("citem" + index);
        if (res.data.status === "ok") {
          this.props.getCartDetail();
          toast.success(res.data.message);
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
        }
      })
      .catch((e) => {
        var errorMsg = e?.response?.data?.message || e.message;
        toast.error(errorMsg);
      });
  }
  clearAll(e) {
    e.preventDefault();
    Axios.delete(`${apiUrl}cart/${encodeValue(this.state.cartDetails._id)}`)
      .then((res) => {
        if (res.data.status === "ok") {
          this.props.getCartDetail();
          toast.success(res.data.message);
        }
      })
      .catch((e) => {
        var errorMsg = e?.response?.data?.message || e.message;
        toast.error(errorMsg);
      });
  }

  

  handleChange(name, e) {
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      if (name === "deliveryUnitNumber") {
        this.setState({ deliveryUnitNumberError: "" });
      }
    });
  }

  gotoCheckout(e) {
    e.preventDefault();
    if (this.state.seletedAvilablityId === deliveryId) {
      if (this.state.deliveryUnitNumber !== "") {
        localStorage.setItem(
          "deliveryUnitNumber",
          this.state.deliveryUnitNumber
        );
        localStorage.setItem(
          "deliveryFloorNumber",
          this.state.deliveryFloorNumber
        );
        this.props.updateStateValue("openCart", false);
        this.setState({firstTime:false})
        document.querySelector("body").classList.remove("cart-sidebar-open");
        this.props.history.push("/checkout");
      } else {
        this.setState({ deliveryUnitNumberError: "Unit Number is required" });
      }
    } else {
      this.props.updateStateValue("openCart", false);
      document.querySelector("body").classList.remove("cart-sidebar-open");
      this.props.history.push("/checkout");
    }
  }

  render() {
    const cartItem = this.state.cartDetails?.cartItem ?? [];
    const orderDateTime = cookie.load("orderDateTime") ?? "";
    return (
      <div className={`cart-sidebar ${this.props.openCart ? `open` : ""}`} ref={this.wrapperRef}>
        <div className="cart-sidebar-header">
          <div className="cart-close">
            <a href="/" onClick={this.closeCart.bind(this)}>
              <img src={closei} alt="Close" />
            </a>
          </div>
          <h3>Your Cart Details</h3>
        </div>
        <div className="cart-sidebar-parent">
          <div className="da-order-merge-column">
            <div
              className={`da-order-two-handling ${
                this.state.seletedAvilablityId === deliveryId
                  ? "delivery-outlet"
                  : "pickup-outlet da-order-single-handling-outlet"
              }`}
            >
              <div
                className={`da-order-two-handling-lhs`}
              >
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
                        this.state.deliveryUnitNumber,
                        this.state.deliveryFloorNumber,
                        localStorage.getItem("deliveryAddress"),
                        localStorage.getItem("deliveryPostalCode"),
                        CountryName
                      )}
                    </p>
                    <div className="single-grid">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Floor #"
                          value={this.state.deliveryFloorNumber}
                          onChange={this.handleChange.bind(
                            this,
                            "deliveryFloorNumber"
                          )}
                        />
                      </div>
                    </div>
                    <div className="single-grid">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Unit #"
                          value={this.state.deliveryUnitNumber}
                          onChange={this.handleChange.bind(
                            this,
                            "deliveryUnitNumber"
                          )}
                        />
                        {this.state.deliveryUnitNumberError !== "" && (
                          <span className="error">
                            {this.state.deliveryUnitNumberError}
                          </span>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
            <div className="da-order-date-time">
              <div className="da-order-date-time-lhs">
                <h5>
                  {this.state.seletedAvilablityId === deliveryId
                    ? "Delivery"
                    : "Pickup"}{" "}
                  Date{" "}
                </h5>
                <p>{cookie.load("deliveryDate")}</p>
              </div>
              <div className="da-order-date-time-rhs">
                <h5>
                  {this.state.seletedAvilablityId === deliveryId
                    ? "Delivery"
                    : "Pickup"}{" "}
                  Time{" "}
                </h5>
                <p>
                  {parseInt(this.state.slotType) === 1
                    ? orderDateTime !== ""
                      ? format(
                          new Date(orderDateTime.replaceAll('"', "")),
                          "HH:MM a"
                        )
                      : ""
                    : this.state.orderSlotStrTime !== "" &&
                      this.state.orderSlotEndTime !== "" && (
                        <>
                          {this.state.orderSlotStrTime} -{" "}
                          {this.state.orderSlotEndTime}
                        </>
                      )}
                </p>
              </div>
            </div>
          </div>
          {cartItem.length > 0 && (
            <React.Fragment>
              <div className="checkout-sidebar-header">
                <span>Items</span>
                <a href="/" onClick={this.clearAll.bind(this)}>Clear Items</a>
              </div>
              <div className="items-scroll">
                {cartItem.map((item, index) => {
                  return (
                    <div className="items-row" key={index} id={`citem${index}`}>
                      <div className="item-img-container">
                        <img
                          src={
                            item.cartItemProductImage !== ""
                              ? item.cartItemProductImage
                              : cartplaceholder
                          }
                          alt={item.cartItemProductName}
                        />
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
                                          (comboProItem, comboProIndex) => {
                                            return (
                                              <p key={comboProIndex}>
                                                {comboProItem.productQuantity} X{" "}
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
                            <i className="fa fa-trash-o" aria-hidden="true"></i>{" "}
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
            {parseFloat(this.state.taxAmount) > 0 && (
              <div className="item-price-row">
                <p className="text-uppercase">
                  {this.state.taxType==="Inclusive"?'Inclusive':''} GST ({this.state.taxPercentage}%)
                </p>{" "}
                <span>{showPriceDirect(this.state.taxAmount)}</span>
              </div>
            )}
            <div className="item-price-row item-grantprice-row ">
              <p className="text-uppercase">Total</p>{" "}
              <span>{showPriceDirect(this.state.grandTotal)}</span>
            </div>
          </div>
        </div>
        <div className="fixed-footer">
          <IonFooter>
            <Link
              to="/checkout"
              className="button"
              onClick={this.gotoCheckout.bind(this)}
            >
              Proceed To Checkout
            </Link>
          </IonFooter>
        </div>
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  let cartDetails = "";
  let totalItem = 0;
  if (Object.keys(state.cartdetails).length > 0) {
    if (state.cartdetails[0].status === "ok") {
      cartDetails = state.cartdetails[0].result;
      totalItem = state.cartdetails[0].totalItem;
    }
  }
  var globalSettings = "";
  if (Object.keys(state.settings).length > 0) {
    if (state.settings[0].status === "ok") {
      globalSettings = state.settings[0].result;
    }
  }

  return {
    cartDetails: cartDetails,
    totalItem: totalItem,
    settingsArr: globalSettings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCartDetail: () => {
      dispatch({ type: GET_CART_DETAIL });
    },
  };
};
export default connect(mapStateTopProps, mapDispatchToProps)(withRouter(Cart));
