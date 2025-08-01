/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { apiUrl, uniqueID } from "../Settings/Config";
import Swal from "sweetalert2";
import cookie from "react-cookies";
import loadingImage from "../../common/images/loading_popup.gif";
var Parser = require("html-react-parser");
var qs = require("qs");
class Placeorder extends Component {
  constructor(props) {
    super(props);
    console.log(this.props, "this.props");
    var paymentrefID = this.props.match.params?.refID || "";
    var UserId =
      cookie.load("UserId") !== "" &&
      typeof cookie.load("UserId") !== undefined &&
      typeof cookie.load("UserId") !== "undefined"
        ? cookie.load("UserId")
        : "";
    this.state = {
      loginPopup: false,
      paymentrefID: paymentrefID,
      payment_attempt: 0,
      validateimage: loadingImage,
      processingText: "We are processing your order",
      UserId: UserId,
      checkoutType: "",
    };
  }
  componentDidMount() {
    this.placeOrder();
  }

  placeOrder() {
    var history = this.props.history;
    var urlParams = new URLSearchParams(this.props.location.search);
    var rapydTransactionID = urlParams.get("rapydTransactionID") || "";
    var stripeTransactionID = urlParams.get("stripeTransactionID") || "";
    if (rapydTransactionID !== "") {
      const customerID = localStorage.getItem("customerID") ?? "";
      const postObject = {
        uniqueID: uniqueID,
        payment_refID: rapydTransactionID,
        customerID: customerID,
      };
      axios
        .post(apiUrl + "payment/checkStatusRapyd", qs.stringify(postObject), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          $.magnificPopup.close();
          if (res.data.status === "ok") {
            this.setState({ checkoutType: res.data.payment_type });
            var msg = "Order has been successfully placed.";
            Swal.fire({
              title: "Success",
              html: msg,
              icon: "success",
              customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
              },
              buttonsStyling: false,
            });

            this.props.history.push(`/thankyou/${res.data.orderNumber}`);
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
            this.props.history.push("/");
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
          console.error("Error fetching data:", e);
        });
    } else if (stripeTransactionID !== "") {
      const customerID = localStorage.getItem("customerID") ?? "";
      const postObject = {
        uniqueID: uniqueID,
        payment_refID: stripeTransactionID,
        customerID: customerID,
      };
      axios
        .post(apiUrl + "payment/checkStatusstripe", qs.stringify(postObject), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          $.magnificPopup.close();
          if (res.data.status === "ok") {
            this.setState({ checkoutType: res.data.payment_type });
            var msg = "Order has been successfully placed.";
            Swal.fire({
              title: "Success",
              html: msg,
              icon: "success",
              customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
              },
              buttonsStyling: false,
            });

            this.props.history.push(`/thankyou/${res.data.orderNumber}`);
          } else if (res.data.status === "waiting") {
            setTimeout(() => {
              this.placeOrder();
            }, 3000);
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
             this.props.history.push("/");
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
          console.error("Error fetching data:", e);
        });
    } else if (urlParams.get("status") == "failure") {
      setTimeout(
        function () {
          this.setState({
            processingText:
              "Please check in myaccount, to get <br/>order details.",
          });
        }.bind(this),
        300
      );
      setTimeout(function () {
        history.push("/checkout");
      }, 3000);
    } else {
      setTimeout(
        function () {
          Swal.fire({
            title: "Error",
            html: "Please check in myaccount, to get <br/>order details.",
            icon: "error",
            customClass: {
              confirmButton: "btn btn-primary waves-effect waves-light",
            },
            buttonsStyling: false,
          });
          history.push("/");
        }.bind(this),
        300
      );
    }
  }

  updateStateValue = (field, value) => {
    this.setState({ [field]: value });
  };

   onAction = (data) => {
    //this.props.history.push(data);
  };

  render() {
    return (
      <div className="main-div">
        <Header
          mainpagestate={this.state}
          prntPagePrps={this.props}
          updateStateValue={this.updateStateValue.bind(this)}
          loginPopup={this.state.loginPopup}
        />

        <div className="rel">
          <div className="container">
            <div className="bluebar">
              <div class="status-prarent">
                <div class="status-container">
                  <div id="statusContent">
                    <div class="loader ripple-loader">
                      <div></div>
                      <div></div>
                    </div>
                    <div class="message">Checking payment status...</div>
                  </div>
                </div>
              </div>

              <div
                id="processing-popup"
                className="white-popup mfp-hide popup_sec processing"
              >
                <div className="pouup_in">
                  <h3 className="title1 text-center">
                    {this.state.processingText !== ""
                      ? Parser(this.state.processingText)
                      : ""}
                  </h3>
                  <div className="process_inner">
                    <div className="process_col">
                      <div className="process_left">
                        <img src={this.state.validateimage} />
                      </div>
                      <div className="process_right">
                        <h5>Waiting for Payment Confirmation</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer section */}
        <Footer
          {...this.props}
          updateStateValue={this.updateStateValue.bind(this)}
        />
        {/* Donate popup - end */}
      </div>
    );
  }
}

export default Placeorder;
