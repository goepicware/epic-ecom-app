import React, { Component } from "react";
import ContentLoader from "react-content-loader";
import { Link } from "react-router-dom";
import axios from "axios";
import cookie from "react-cookies";
import { format } from "date-fns";
import cartplaceholder from "../../common/images/placeholder.jpg";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import SpinWheel from "../SpinWheel/SpinWheel.tsx";
import {
  apiUrl,
  deliveryId,
  pickupId,
  uniqueID,
  CountryName,
} from "../Settings/Config";
import {
  addressFormat,
  showPriceDirect,
  showOrderTime,
} from "../Settings/SettingHelper";

class Thankyou extends Component {
  constructor(props) {
    super(props);
    console.log(this.props, "this.props");
    const path = this.props.match.path;
    const customerID = localStorage.getItem("customerID") ?? "";
    const orderNumber = this.props.match.params?.orderNumber ?? "";
    this.state = {
      path: path,
      orderNumber: orderNumber,
      loginPopup: false,
      trigerCart: false,
      loading: true,
      orderDetails: "",
      customerID: customerID,
    };
  }
  componentDidMount() {
    if (this.state.customerID === "") {
      cookie.save("triggerLogin", "Yes", { path: "/" });
      this.props.history.push("/");
    } else {
      if (this.state.orderNumber !== "") {
        if (this.state.path !== "/myorders/:orderNumber") {
          cookie.remove("discountApplied", { path: "/" });
          cookie.remove("promoFreeDelivery", { path: "/" });
          cookie.remove("discount", { path: "/" });
          cookie.remove("promoCode", { path: "/" });

          cookie.remove("redeemPoint", { path: "/" });
          cookie.remove("redeemPointAmount", { path: "/" });

          cookie.remove("availability", { path: "/" });
          cookie.remove("availabilityName", { path: "/" });
          cookie.remove("deliveryDate", { path: "/" });
          cookie.remove("deliveryOption", { path: "/" });
          cookie.remove("deliveryTime", { path: "/" });
          cookie.remove("isAdvanced", { path: "/" });
          cookie.remove("orderDateTime", { path: "/" });
          cookie.remove("orderHandledOutlet", { path: "/" });
          cookie.remove("orderSlotEndTime", { path: "/" });
          cookie.remove("orderSlotStrTime", { path: "/" });
          cookie.remove("orderSlotTxt", { path: "/" });
          cookie.remove("orderSlotVal", { path: "/" });
          cookie.remove("outletID", { path: "/" });
          cookie.remove("slotType", { path: "/" });
          localStorage.removeItem("deliveryAddress");
          localStorage.removeItem("deliveryPostalCode");
          localStorage.removeItem("deliveryUnitNumber");
          localStorage.removeItem("deliveryFloorNumber");
          localStorage.removeItem("zoneID");
          localStorage.removeItem("zoneName");
          /* this.props.updateStateValue('reloadCartPage', 'yes') */
        }
        this.loadOrderDetails();
      } else {
        this.props.history.push("/myorders");
      }
    }
  }
  updateStateValue = (field, value) => {
    this.setState({ [field]: value });
  };
  loadOrderDetails() {
    axios
      .get(
        `${apiUrl}order/myorder-detail?uniqueID=${uniqueID}&customerID=${this.state.customerID}&orderNumber=${this.state.orderNumber}`
      )
      .then((res) => {
        if (res.data.status === "ok") {
          const result = res.data.result;
          this.setState({ orderDetails: result, loading: false });
        }
      })
      .catch((error) => {
        console.log(error);
        // this.props.history.push("./");
      });
  }
  render() {
    let displyDate = "";
    let displyTime = "";
    if (this.state.orderDetails !== "") {
      displyDate =
        this.state.orderDetails.orderDate !== ""
          ? format(
              new Date(this.state.orderDetails.orderDate.replaceAll('"', "")),
              "do MMM yyyy"
            )
          : "";
    }

    return (
      <div className="cover">
        <Header
          trigerCart={this.state.trigerCart}
          updateStateValue={this.updateStateValue.bind(this)}
        />

        <div className="innerpage">
          <div className="container thank-full-page">
            {this.state.path === "/myorders/:orderNumber" && (
              <div className="continue-link cl-top">
                <Link to={"/myorders"}>Back to my orders</Link>
              </div>
            )}
            <div className="thankbook-rhs">
              {this.state.loading ? (
                <ContentLoader
                  speed={2}
                  width={400}
                  height={250}
                  viewBox="0 0 400 250"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                  {...this.props}
                >
                  {/* Title */}
                  <rect x="20" y="20" rx="5" ry="5" width="200" height="20" />

                  {/* Order ID */}
                  <rect x="20" y="50" rx="5" ry="5" width="150" height="15" />

                  {/* Customer Name */}
                  <rect x="20" y="80" rx="5" ry="5" width="180" height="15" />

                  {/* Delivery Address */}
                  <rect x="20" y="110" rx="5" ry="5" width="300" height="15" />
                  <rect x="20" y="130" rx="5" ry="5" width="250" height="15" />

                  {/* Contact Number */}
                  <rect x="20" y="160" rx="5" ry="5" width="180" height="15" />

                  {/* Status Indicator */}
                  <rect x="20" y="190" rx="5" ry="5" width="100" height="15" />
                </ContentLoader>
              ) : (
                <React.Fragment>
                  {this.state.path !== "/myorders/:orderNumber" && (
                    <div className="thanks-words">
                      <h1>Thank you for your order</h1>
                      <p>Your order has been placed successfully</p>
                    </div>
                  )}
                  <div className="da-orders-reciept">
                    <div className="da-order-no">
                      {" "}
                      ORDER NO - {this.state.orderDetails.orderNumber}{" "}
                    </div>
                    <div
                      className={`ribbon-top ${(() => {
                        if (this.state.orderDetails.orderStatus === 1) {
                          return "msg-recieved";
                        } else if (this.state.orderDetails.orderStatus === 2) {
                          return "msg-process";
                        } else if (this.state.orderDetails.orderStatus === 3) {
                          return "msg-delivering";
                        } else if (this.state.orderDetails.orderStatus === 4) {
                          return "msg-completed";
                        } else if (this.state.orderDetails.orderStatus === 5) {
                          return "msg-canceled";
                        }
                      })()}`}
                    >
                      {this.state.orderDetails.orderAvailabilityID ===
                        pickupId && this.state.orderDetails.orderStatus === 3
                        ? "Ready to Eat"
                        : (() => {
                            if (this.state.orderDetails.orderStatus === 1) {
                              return "Received";
                            } else if (
                              this.state.orderDetails.orderStatus === 2
                            ) {
                              return "Processing";
                            } else if (
                              this.state.orderDetails.orderStatus === 3
                            ) {
                              return "Delivering";
                            } else if (
                              this.state.orderDetails.orderStatus === 4
                            ) {
                              return "Completed";
                            } else if (
                              this.state.orderDetails.orderStatus === 5
                            ) {
                              return "Cancelled";
                            }
                          })()}
                    </div>

                    <div className="da-order-merge-parent">
                      <div className="da-order-merge-column">
                        <div className="da-order-time-status">
                          <span>
                            Order placed at :{" "}
                            {this.state.orderDetails.createdAt !== ""
                              ? format(
                                  new Date(
                                    this.state.orderDetails.createdAt.replaceAll(
                                      '"',
                                      ""
                                    )
                                  ),
                                  "do MMM yyyy hh:mm a"
                                )
                              : ""}
                          </span>{" "}
                          <span>
                            Pay by : {this.state.orderDetails.orderPaymentMode}
                          </span>
                        </div>
                        <div
                          className={`da-order-two-handling ${
                            this.state.orderDetails.orderAvailabilityID ===
                            deliveryId
                              ? "delivery-outlet"
                              : "pickup-outlet da-order-single-handling-outlet"
                          }`}
                        >
                          <div className="da-order-two-handling-lhs">
                            <h5>
                              {this.state.orderDetails.orderAvailabilityID ===
                              pickupId
                                ? "Pickup "
                                : ""}
                              Outlet
                            </h5>
                            <p>
                              {this.state.orderDetails.outlet?.outletName}
                              <br />
                              {addressFormat(
                                this.state.orderDetails.outlet
                                  ?.outletUnitNumber,
                                this.state.orderDetails.outlet
                                  ?.outletFloorNumber,
                                this.state.orderDetails.outlet?.outletAddress,
                                this.state.orderDetails.outlet
                                  ?.outletPostalCode,
                                CountryName
                              )}
                            </p>
                          </div>
                          <div className="da-order-two-handling-rhs">
                            {this.state.orderDetails.orderAvailabilityID ===
                              deliveryId && (
                              <React.Fragment>
                                <h5>Delivery Location</h5>
                                <p>
                                  {addressFormat(
                                    this.state.orderDetails
                                      .orderDeliveryUnitNumber,
                                    this.state.orderDetails
                                      .orderDeliveryFloorNumber,
                                    this.state.orderDetails
                                      .orderDeliveryAddress,
                                    this.state.orderDetails
                                      .orderDeliveryPostalCode,
                                    CountryName
                                  )}
                                </p>
                              </React.Fragment>
                            )}
                          </div>
                        </div>
                        <div className="da-order-date-time">
                          <div className="da-order-date-time-lhs">
                            <h5>
                              {this.state.orderDetails.orderAvailabilityName}{" "}
                              Date{" "}
                            </h5>
                            <p>{displyDate}</p>
                          </div>
                          <div className="da-order-date-time-rhs">
                            <h5>
                              {this.state.orderDetails.orderAvailabilityName}{" "}
                              Time{" "}
                            </h5>
                            <p>
                              {showOrderTime(
                                this.state.orderDetails.orderDate,
                                this.state.orderDetails.orderSlotStart,
                                this.state.orderDetails.orderSlotEnd,
                                this.state.orderDetails.orderDateType
                              )}
                            </p>
                          </div>
                        </div>
                        {this.state.orderDetails.orderAdditionalInformation !==
                          null &&
                          this.state.orderDetails.orderAdditionalInformation !==
                            "" && (
                            <div>
                              <strong>Note:</strong>
                              {
                                this.state.orderDetails
                                  .orderAdditionalInformation
                              }
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="checkout-sidebar-header">
                      <span>Items</span>
                    </div>
                    {this.state.orderDetails.orderItem.length > 0 && (
                      <div className="items-scroll">
                        {this.state.orderDetails.orderItem.map(
                          (item, index) => {
                            return (
                              <div className="items-row" key={index}>
                                <div className="item-img-container">
                                  <img
                                    src={
                                      item.orderItemProductImage !== ""
                                        ? item.orderItemProductImage
                                        : cartplaceholder
                                    }
                                    alt={item.orderItemProductName}
                                  />
                                </div>
                                <div className="item-info-container">
                                  <div className="item-info-title">
                                    <h6>{item.orderItemProductName}</h6>
                                    <div className="item-extrainfo-options">
                                      {item.orderItemComboSet.length > 0 &&
                                        item.orderItemComboSet.map(
                                          (citem, cindex) => {
                                            return (
                                              <React.Fragment>
                                                <p>
                                                  <b>{citem.comboName}:</b>{" "}
                                                </p>
                                                {citem.products.length > 0 &&
                                                  citem.products.map(
                                                    (cpItem, cpindex) => {
                                                      return (
                                                        <p key={cpindex}>
                                                          {
                                                            cpItem.productQuantity
                                                          }{" "}
                                                          X {cpItem.productName}{" "}
                                                          {parseFloat(
                                                            cpItem.productPrice
                                                          ) > 0
                                                            ? `( +$${cpItem.productPrice} )`
                                                            : ""}
                                                        </p>
                                                      );
                                                    }
                                                  )}
                                              </React.Fragment>
                                            );
                                          }
                                        )}
                                    </div>
                                  </div>
                                </div>
                                <div className="item-price-action">
                                  <div className="item-price-end">
                                    {item.orderItemQuantity} X{" "}
                                    {showPriceDirect(item.orderItemTotalPrice)}{" "}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                    <div className="items-footer">
                      {parseFloat(this.state.orderDetails.orderSubTotal) >
                        0 && (
                        <div className="item-price-row">
                          <p className="text-uppercase">SUBTOTAL</p>
                          <span>
                            {showPriceDirect(
                              this.state.orderDetails.orderSubTotal
                            )}
                          </span>
                        </div>
                      )}
                      {parseFloat(
                        this.state.orderDetails.orderUsedPointAmounts
                      ) > 0 && (
                        <div className="item-price-row">
                          <p className="text-uppercase">
                            Redeemed Points(
                            {this.state.orderDetails.orderUsedPoints})
                          </p>
                          <span>
                            -
                            {showPriceDirect(
                              this.state.orderDetails.orderUsedPointAmounts
                            )}
                          </span>
                        </div>
                      )}
                      {this.state.orderDetails.orderDiscountApplied ===
                        true && (
                        <div className="item-price-row">
                          <p className="text-uppercase">
                            Discount({this.state.orderDetails.orderPromoCode})
                          </p>
                          <span>
                            {parseFloat(this.state.orderDetails.orderDiscount) >
                              0 &&
                              showPriceDirect(
                                this.state.orderDetails.orderDiscount
                              )}
                            {this.state.orderDetails.orderPromoFreeDelivery ===
                            "Yes"
                              ? "Free Delivery"
                              : ""}
                          </span>
                        </div>
                      )}

                      {parseFloat(this.state.orderDetails.orderDeliveryCharge) >
                        0 && (
                        <div className="item-price-row">
                          <p className="text-uppercase">Delivery</p>
                          <span>
                            {showPriceDirect(
                              this.state.orderDetails.orderDeliveryCharge
                            )}{" "}
                          </span>
                        </div>
                      )}
                      {parseFloat(this.state.orderDetails.orderTaxAmount) >
                        0 && (
                        <div className="item-price-row">
                          <p className="text-uppercase">
                            GST ({this.state.orderDetails.orderTaxPercentage} %)
                          </p>{" "}
                          <span>
                            {showPriceDirect(
                              this.state.orderDetails.orderTaxAmount
                            )}
                          </span>
                        </div>
                      )}
                      {parseFloat(this.state.orderDetails.orderGrandTotal) >
                        0 && (
                        <div className="item-price-row item-grantprice-row ">
                          <p className="text-uppercase">Total</p>{" "}
                          <span>
                            {showPriceDirect(
                              this.state.orderDetails.orderGrandTotal
                            )}
                          </span>
                        </div>
                      )}
                      {this.state.path !== "/myorders/:orderNumber" && (
                        <div className="thankyou-staus">
                          <Link className="button" to="/myorders">
                            Check Your Order Status
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* this.state.path !== "/myorders/:orderNumber" && ( */
                    <div className="items-center justify-center gap-8 px-4 pb-8 mt-4">
                      <p>You Have Earned : 10 Points on this order</p>
                      <br/>
                      {/* Spin wheel - center */}
                      <div className="order-2 lg:order-2 spinwheel-parent pament-success myaccv1">
                        <SpinWheel onAction={this.onAction} />
                      </div>
                    </div>
                  /* ) */}
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
        <Footer updateStateValue={this.updateStateValue.bind(this)} />
      </div>
    );
  }
}
export default Thankyou;
