import React, { Component } from "react";
import cookie from "react-cookies";
import { Link } from "react-router-dom";
import innerbanner from "../../common/images/img/inner-banner.jpg";
import ContentLoader from "react-content-loader";
import axios from "axios";
import { format } from "date-fns";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import Sidebar from "./Sidebar";
import {
  apiUrl,
  deliveryId,
  pickupId,
  uniqueID,
  CountryName,
  mainAPIURL
} from "../Settings/Config";
import { addressFormat, showPriceDirect, showOrderTime, showLoader, hideLoader } from "../Settings/SettingHelper";

class Myorders extends Component {
  constructor(props) {
    super(props);
    const customerID = localStorage.getItem("customerID") ?? "";
    this.state = {
      trigerCart: false,
      loginPopup:false,
      activeTab: "current",
      loadCurrentOrder: true,
      currentOrderPage: 1,
      currentorderList: [],
      currentordertotalPage: 0,
      currentorderhideLoadMore: false,

      loadPastOrder: true,
      pastOrderPage: 1,
      pastorderList: [],
      pastordertotalPage: 0,
      pastorderhideLoadMore: false,
      customerID: customerID,
    };
  }

  componentDidMount() {
    if (this.state.customerID === "") {
      cookie.save("triggerLogin", "Yes", { path: "/" });
      this.props.history.push("/");
    } else {
      this.loadCurrentOrderList(1);
      this.loadPastOrderList(1);
    }
  }
  loadCurrentOrderList(page) {
    axios
      .get(
        `${apiUrl}order/myorders?uniqueID=${uniqueID}&customerID=${this.state.customerID}&limit=10&offset=${page}&orderType=current`
      )
      .then((res) => {
        if (res.data.status === "ok") {
          const result = res.data.result;
          const currentorderList_ = this.state.currentorderList;
          const currentorderList = currentorderList_.concat(result);
          this.setState({
            currentorderList: currentorderList,
            loadCurrentOrder: false,
          });
          if (page === 1) {
            this.setState({ currentordertotalPage: res.data.totalPages });
          }
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loadCurrentOrder: false });
      });
  }

  loadPastOrderList(page) {
    axios
      .get(
        `${apiUrl}order/myorders?uniqueID=${uniqueID}&customerID=${this.state.customerID}&limit=10&offset=${page}&orderType=past`
      )
      .then((res) => {
        if (res.data.status === "ok") {
          const result = res.data.result;
          const pastorderList_ = this.state.pastorderList;
          const pastorderList = pastorderList_.concat(result);
          this.setState({
            pastorderList: pastorderList,
            loadPastOrder: false,
          });
          if (page === 1) {
            this.setState({ pastordertotalPage: res.data.totalPages });
          }
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loadPastOrder: false });
      });
  }
  loadMore(type, e) {
    e.preventDefault();
    if (type === "current") {
      if (this.state.currentordertotalPage !== this.state.currentOrderPage) {
        const nexPage = parseInt(this.state.currentOrderPage) + 1;
        if (this.state.currentordertotalPage === nexPage) {
          this.setState({ currentorderhideLoadMore: true });
        }
        this.setState({ currentOrderPage: nexPage }, () => {
          this.loadCurrentOrderList(nexPage);
        });
      }
    } else if (type === "past") {
      if (this.state.pastordertotalPage !== this.state.pastOrderPage) {
        const nexPage = parseInt(this.state.pastOrderPage) + 1;
        if (this.state.pastordertotalPage === nexPage) {
          this.setState({ pastorderhideLoadMore: true });
        }
        this.setState({ pastOrderPage: nexPage }, () => {
          this.loadPastOrderList(nexPage);
        });
      }
    }
  }

  updateStateValue = (field, value) => {
    this.setState({ [field]: value });
  };
  loadorderDisply(orderList) {
    return orderList.map((item, index) => {
      let displyDate =
        item.orderDate !== ""
          ? format(new Date(item.orderDate.replaceAll('"', "")), "do MMM yyyy")
          : "";
      return (
        <div className="da-orders-row" key={index}>
          <div className="da-order-no"> ORDER NO - {item.orderNumber} </div>
          <div className={`ribbon-top ${(() => {
                  if (item.orderStatus === 1) {
                    return "msg-recieved";
                  } else if (item.orderStatus === 2) {
                    return "msg-process";
                  } else if (item.orderStatus === 3) {
                    return "msg-delivering";
                  } else if (item.orderStatus === 4) {
                    return "msg-completed";
                  } else if (item.orderStatus === 5) {
                    return "msg-canceled";
                  }
                })()}`}>
            {item.orderAvailabilityID === pickupId && item.orderStatus === 3
                ? "Ready to Eat"
                : (() => {
                  if (item.orderStatus === 1) {
                    return "Received";
                  } else if (item.orderStatus === 2) {
                    return "Processing";
                  } else if (item.orderStatus === 3) {
                    return "Delivering";
                  } else if (item.orderStatus === 4) {
                    return "Completed";
                  } else if (item.orderStatus === 5) {
                    return "Cancelled";
                  }
                })()}
          </div>

          <div className="da-order-merge-parent">
            <div className="da-order-merge-column">
              <div className="da-order-time-status">
                <span>
                  Order placed at :{" "}
                  {item.createdAt !== ""
                    ? format(
                        new Date(item.createdAt.replaceAll('"', "")),
                        "do MMM yyyy hh:mm a"
                      )
                    : ""}
                </span>{" "}
                <span>Pay by : {item.orderPaymentMode}</span>
              </div>
              <div className={`da-order-two-handling ${
                              item.orderAvailabilityID === deliveryId
                                ? "delivery-outlet"
                                : "pickup-outlet da-order-single-handling-outlet"
                            }`}>
                <div className="da-order-two-handling-lhs">
                  <h5>
                    {" "}
                    {item.orderAvailabilityID === pickupId ? "Pickup " : ""}
                    Outlet
                  </h5>
                  <p>
                    {item.outlet?.outletName}
                    <br />
                    {addressFormat(
                      item.outlet?.outletUnitNumber,
                      item.outlet?.outletFloorNumber,
                      item.outlet?.outletAddress,
                      item.outlet?.outletPostalCode,
                      CountryName
                    )}
                  </p>
                </div>
                <div className="da-order-two-handling-rhs">
                  {item.orderAvailabilityID === deliveryId && (
                    <React.Fragment>
                      <h5>Delivery Location</h5>
                      <p>
                        {addressFormat(
                          item.orderDeliveryUnitNumber,
                          item.orderDeliveryFloorNumber,
                          item.orderDeliveryAddress,
                          item.orderDeliveryPostalCode,
                          CountryName
                        )}
                      </p>
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className="da-order-date-time">
                <div className="da-order-date-time-lhs">
                  <h5>{item.orderAvailabilityName} Date </h5>
                  <p>{displyDate}</p>
                </div>
                <div className="da-order-date-time-rhs">
                  <h5>{item.orderAvailabilityName} Time </h5>
                  <p>{showOrderTime(item.orderDate, item.orderSlotStart, item.orderSlotEnd,	item.orderDateType)}</p>
                </div>
              </div>
              {item.orderAdditionalInformation!==null && item.orderAdditionalInformation!=="" && (
                <div>
                  <strong>Note:</strong>{item.orderAdditionalInformation}
                </div>)}
              {parseFloat(item.orderGrandTotal) > 0 && (
                <div className="da-order-amount">
                  <span>Order Amount</span>
                  <span>{showPriceDirect(item.orderGrandTotal)}</span>
                </div>
              )}
            </div>
            <div className="da-order-action">
              <Link
                to={`/myorders/${item.orderNumber}`}
                className="button doa-button-print"
              >
                Print Invoice
              </Link>
              <a
                href="/"
                onClick={this.downloadInvoice.bind(this, item._id)}
                className="button doa-button-view"
                id={`invoice-${item._id}`}
              >
                View Receipt
              </a>
            </div>
          </div>
        </div>
      );
    });
  }
  setTab(activeTab, e) {
    e.preventDefault();
    this.setState({ activeTab });
  }

  downloadInvoice(orderID, e) {
    e.preventDefault();
    showLoader(`invoice-${orderID}`)
    axios
      .get(
        `${apiUrl}order/generatepdf?orderID=${orderID}&uniqueID=${uniqueID}&customerID=${this.state.customerID}`
      )
      .then((res) => {
        if (res.data.status === "ok") {
          const url = `${mainAPIURL}invoice/${res.data.pdfName}`;
          window.open(url, '_blank');
          /* const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', res.data.pdfName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); */
          hideLoader(`invoice-${orderID}`)
        }
      })
      .catch((error) => {
        console.log(error);
        hideLoader(`invoice-${orderID}`)
      });

    
  }




  render() {
    return (
      <div className="cover">
        <Header
          trigerCart={this.state.trigerCart}
          updateStateValue={this.updateStateValue.bind(this)}
          loginPopup={this.state.loginPopup}
        />
        <div className="inner-banner">
          <img src={innerbanner} alt="image" />
          <div className="inner-caption">My Orders</div>
        </div>
        <div className="innerpage myaccount-pages">
          <div className="container">
            <div className="dashboard-main">
              <Sidebar {...this.props} active="myorders" />
              <div className="dashboard-aside">
                {/* Order  Start  */}
                <div className="da-orders-info">
                  <div className="da-orders-nav">
                    <ul>
                      <li
                        className={
                          this.state.activeTab === "current" ? "active" : ""
                        }
                      >
                        <a href="/" onClick={this.setTab.bind(this, "current")}>
                          Current Orders
                        </a>
                      </li>
                      <li
                        className={
                          this.state.activeTab === "past" ? "active" : ""
                        }
                      >
                        <a href="#" onClick={this.setTab.bind(this, "past")}>
                          Past Orders
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="da-orders-tab-panel-parent">
                    {this.state.activeTab === "current" && (
                      <div className="da-orders-tab-panel da-orders-current">
                        {this.state.loadCurrentOrder === true ? (
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
                            <rect
                              x="20"
                              y="20"
                              rx="5"
                              ry="5"
                              width="200"
                              height="20"
                            />

                            {/* Order ID */}
                            <rect
                              x="20"
                              y="50"
                              rx="5"
                              ry="5"
                              width="150"
                              height="15"
                            />

                            {/* Customer Name */}
                            <rect
                              x="20"
                              y="80"
                              rx="5"
                              ry="5"
                              width="180"
                              height="15"
                            />

                            {/* Delivery Address */}
                            <rect
                              x="20"
                              y="110"
                              rx="5"
                              ry="5"
                              width="300"
                              height="15"
                            />
                            <rect
                              x="20"
                              y="130"
                              rx="5"
                              ry="5"
                              width="250"
                              height="15"
                            />

                            {/* Contact Number */}
                            <rect
                              x="20"
                              y="160"
                              rx="5"
                              ry="5"
                              width="180"
                              height="15"
                            />

                            {/* Status Indicator */}
                            <rect
                              x="20"
                              y="190"
                              rx="5"
                              ry="5"
                              width="100"
                              height="15"
                            />
                          </ContentLoader>
                        ) : this.state.currentorderList.length > 0 ? (
                          <React.Fragment>
                            {this.loadorderDisply(this.state.currentorderList)}
                            {this.state.currentorderhideLoadMore === false && (
                              <div className="loadMore">
                                <a
                                  href="/"
                                  onClick={this.loadMore.bind(this, "current")}
                                >
                                  Load More
                                </a>
                              </div>
                            )}
                          </React.Fragment>
                        ) : (
                          "No Order Found"
                        )}
                      </div>
                    )}
                    {this.state.activeTab === "past" && (
                      <div className="da-orders-tab-panel da-orders-past">
                        {this.state.loadPastOrder === true ? (
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
                            <rect
                              x="20"
                              y="20"
                              rx="5"
                              ry="5"
                              width="200"
                              height="20"
                            />

                            {/* Order ID */}
                            <rect
                              x="20"
                              y="50"
                              rx="5"
                              ry="5"
                              width="150"
                              height="15"
                            />

                            {/* Customer Name */}
                            <rect
                              x="20"
                              y="80"
                              rx="5"
                              ry="5"
                              width="180"
                              height="15"
                            />

                            {/* Delivery Address */}
                            <rect
                              x="20"
                              y="110"
                              rx="5"
                              ry="5"
                              width="300"
                              height="15"
                            />
                            <rect
                              x="20"
                              y="130"
                              rx="5"
                              ry="5"
                              width="250"
                              height="15"
                            />

                            {/* Contact Number */}
                            <rect
                              x="20"
                              y="160"
                              rx="5"
                              ry="5"
                              width="180"
                              height="15"
                            />

                            {/* Status Indicator */}
                            <rect
                              x="20"
                              y="190"
                              rx="5"
                              ry="5"
                              width="100"
                              height="15"
                            />
                          </ContentLoader>
                        ) : this.state.pastorderList.length > 0 ? (
                          <React.Fragment>
                            {this.loadorderDisply(this.state.pastorderList)}
                            {this.state.pastorderhideLoadMore === false && (
                              <div className="loadMore">
                                <a
                                  href="/"
                                  onClick={this.loadMore.bind(this, "past")}
                                >
                                  Load More
                                </a>
                              </div>
                            )}
                          </React.Fragment>
                        ) : (
                          "No Order Found"
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Order  End */}
              </div>
            </div>
          </div>
        </div>
        <Footer {...this.props} updateStateValue={this.updateStateValue.bind(this)} />
      </div>
    );
  }
}
export default Myorders;
