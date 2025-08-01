/* eslint-disable */
import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel2";
import "../../common/css/owl.carousel.css";
import "../../common/css/new-style.css";

import logo from "../../common/images/img/logo.png";
import wishlist from "../../common/images/img/wishlist.svg";
import profile from "../../common/images/img/profile.svg";
import cartbag from "../../common/images/img/cart-bag.svg";
import mapicon from "../../common/images/img/map-icon.svg";
import time from "../../common/images/img/time-quarter.svg";
import cycle from "../../common/images/img/cycle.svg";
import selficon from "../../common/images/img/self-pickup.svg";
import dineicon from "../../common/images/img/dine-in-icon.svg";
import reservation from "../../common/images/img/reservation-icon.svg";
import prothumb from "../../common/images/img/product-thumb.jpg";
import gallerybig from "../../common/images/img/gallery.jpg";
import gallerythumb from "../../common/images/img/gallery1.jpg";
import gallerythumb1 from "../../common/images/img/gallery2.jpg";
import quote from "../../common/images/img/quote.svg";
import abt from "../../common/images/img/abt-img.png";
import flogo from "../../common/images/img/footer-logo.png";
import navb from "../../common/images/img/nav-icon.svg";
import closei from "../../common/images/img/close-top.svg";

import searchi from "../../common/images/img/search-black.svg";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="cover-map">
        <div className="delivery-map-page">
          <header className="delivery-hader">
            <div className="dh-logo">
              <a href="#">
                <img src={logo} alt="logo" />{" "}
              </a>
            </div>
            <div className="dh-login-btn">
              <a href="#" className="button">
                Log in or Sign up
              </a>
            </div>
          </header>
          <div className="full-container">
            <div className="left-white-bar">
              <div className="lwb-promo-img">
                <img src={gallerythumb} alt="Gallery" />{" "}
              </div>
              <div className="lwb-button">
                <a href="#" className="button">
                  Delivery
                </a>
                <a href="#" className="button">
                  Pickup
                </a>
              </div>
              <div className="location-overflow">
                <div className="delivery-show">
                  <div className="new-location-find">
                    <h4>New address </h4>
                    <div className="nlf-form">
                      <div className="form-group">
                        <input
                          type="text"
                          className="search-input"
                          placeholder="Search your location"
                        />
                        <img
                          className="search-icon"
                          src={searchi}
                          alt="search"
                        />{" "}
                      </div>
                    </div>
                    <div className="nlf-location-link">
                      <a href="#">Current location</a>
                    </div>
                  </div>
                  <div className="your-location-save">
                    <h4>Your addresses</h4>
                    <p>You have no address created yet.</p>
                    <a href="#" className="button saved-add-btn">
                      Log in for saved addresses
                    </a>
                  </div>
                </div>

                <div className="pickup-show">
                  <div className="pickup-show-list">
                    <ul>
                      <li className="active">
                        <h5>kalzbrgr </h5>
                        <span>
                          {" "}
                          7 WALLICH ST #B2-14 GUOCO TOWER SINGAPORE 078884
                        </span>
                        <strong>Order for later</strong>
                        <a href="#" className="small-pickbtn">
                          Schedule pickup
                        </a>
                      </li>
                      <li>
                        <h5>kalzbrgr </h5>
                        <span>
                          {" "}
                          7 WALLICH ST #B2-14 GUOCO TOWER SINGAPORE 078884
                        </span>
                        <strong>Order for later</strong>
                      </li>
                      <li>
                        <h5>kalzbrgr </h5>
                        <span>
                          {" "}
                          7 WALLICH ST #B2-14 GUOCO TOWER SINGAPORE 078884
                        </span>
                        <strong>Order for later</strong>
                      </li>
                      <li>
                        <h5>kalzbrgr </h5>
                        <span>
                          {" "}
                          7 WALLICH ST #B2-14 GUOCO TOWER SINGAPORE 078884
                        </span>
                        <strong>Order for later</strong>
                      </li>
                      <li>
                        <h5>kalzbrgr </h5>
                        <span>
                          {" "}
                          7 WALLICH ST #B2-14 GUOCO TOWER SINGAPORE 078884
                        </span>
                        <strong>Order for later</strong>
                      </li>
                      <li>
                        <h5>kalzbrgr </h5>
                        <span>
                          {" "}
                          7 WALLICH ST #B2-14 GUOCO TOWER SINGAPORE 078884
                        </span>
                        <strong>Order for later</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="popup-master">
              {/* Login Popup */}

              <div className="login-region">
                <div className="pm-close">
                  <a href="#">
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
                  />
                </div>

                <div className="pm-single-button">
                  <button className="button">Log in</button>
                </div>
              </div>

              {/* Communication Method Popup */}
              <div className="method-region">
                <div className="pm-close">
                  <a href="#">
                    <img className="close-top" src={closei} alt="close" />
                  </a>
                </div>
                <div className="pm-header">
                  <h4>Select communication method</h4>
                  <span>
                    We'll send you a message with a verification code and
                    further communication on you chosen option.
                  </span>
                </div>

                <div className="send-option-form">
                  <h5>Send options </h5>
                  <div className="form-group">
                    <label>
                      {" "}
                      <input type="radio" value="Option one" /> <span>Sms</span>
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      {" "}
                      <input type="radio" value="Option one" />{" "}
                      <span>WhatsApp</span>
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      {" "}
                      <input type="radio" value="Option one" />{" "}
                      <span>Email</span>
                    </label>
                  </div>
                </div>

                <div className="pm-single-button">
                  <button className="button">Continue</button>
                </div>
              </div>

              {/* Verification Popup */}
              <div className="verification-region">
                <div className="pm-close">
                  <a href="#">
                    <img className="close-top" src={closei} alt="close" />
                  </a>
                </div>
                <div className="pm-header">
                  <h4>Enter verification code</h4>
                  <span>
                    Please enter the 5-digit verification code that was sent to
                    +65******63
                  </span>
                </div>

                <div className="verfication-box-form">
                  <div className="form-group">
                    <input className="form-control" type="text" />
                    <input className="form-control" type="text" />
                    <input className="form-control" type="text" />
                    <input className="form-control" type="text" />
                    <input className="form-control" type="text" />
                  </div>
                  <div className="form-group-link">
                    <a href="#">I haven’t received the code </a>
                  </div>
                </div>

                <div className="pm-single-button">
                  <button className="button">Confirm</button>
                </div>
              </div>

              {/* Create Account Popup */}
              <div className="create-account-region">
                <div className="pm-close">
                  <a href="#">
                    <img className="close-top" src={closei} alt="close" />
                  </a>
                </div>
                <div className="pm-header">
                  <h4>Create your account</h4>
                  <span>Update your informations and continue</span>
                </div>
                <div className="create-account-form">
                  <div className="form-group">
                    <label class="control-label">Your Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter your Name"
                    />
                  </div>
                  <div className="form-group">
                    <label class="control-label">Mobile Number</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Mobile Number"
                    />
                  </div>
                  <div className="form-group-checkbox">
                    <input type="checkbox" />
                    <span>
                      By creating an account, I agree with the,{" "}
                      <a href="#">Terms & Conditions</a> and the{" "}
                      <a href="#">Privacy Policy</a>
                    </span>
                  </div>
                  <div className="form-group-checkbox">
                    <input type="checkbox" />
                    <span>
                      i agree to receive communications on email and phone
                    </span>
                  </div>
                </div>
                <div className="spacer"> </div>
                <div className="pm-single-button">
                  <button className="button">Continue</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
