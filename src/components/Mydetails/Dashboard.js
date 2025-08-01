
import React, { Component } from "react";
import $ from "jquery";
import OwlCarousel from "react-owl-carousel2";
import "../../common/css/owl.carousel.css";
import "../../common/css/new-style.css";

import innerbanner from "../../common/images/img/inner-banner.jpg";

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
import cartplaceholder from "../../common/images/img/placeholder.jpg";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
   /*  $.magnificPopup.open({
      items: {
        src: "#view-recipt-popup",
      },
      type: "inline",
    });
    $.magnificPopup.open({
      items: {
        src: "#change-popup-master",
      },
      type: "inline",
    }); */
  }

  render() {
    return (
      <div className="cover">
        <header>
          <div className="container">
            <div className="header-inner">
              <div className="res-nav-profile">
                <div className="nav-icon">
                  <a href="#">
                    <img src={navb} alt="Nav" />
                  </a>
                </div>
                <div className="nav-profile">
                  <a href="#">
                    <img src={profile} alt="profile" />
                  </a>
                </div>
              </div>
              <div className="header-logo">
                <img src={logo} alt="logo" />
              </div>
              <div className="header-rhs">
                <div className="header-inputs">
                  <div className="input-dl">
                    <div className="rel in-parent">
                      <input
                        type="text"
                        className="sdl-input"
                        placeholder="Select delivery Location"
                      />
                      <img className="sdl-map" src={mapicon} alt="map" />
                    </div>
                  </div>
                  <div className="input-dl">
                    <div className="rel in-parent">
                      <input
                        type="text"
                        className="sdl-input"
                        placeholder="Select Date & Time"
                      />
                      <img className="sdl-time" src={time} alt="time" />
                    </div>
                  </div>
                  <div className="pick-item">
                    <a href="#" className="pick-item-link">
                      <span>
                        <img src={cycle} alt="cycle" /> Delivery
                      </span>
                    </a>
                  </div>
                </div>
                <div className="header-info">
                  <div className="header-profile">
                    <a href="#">
                      <img src={profile} alt="profile" />
                    </a>
                  </div>
                  <div className="header-wishlist">
                    <a href="#">
                      <img src={wishlist} alt="wishlist" />
                    </a>
                  </div>
                  <div className="header-cart">
                    <a href="#" className="header-cart-link">
                      <img src={cartbag} className="cart-img" alt="cartbag" />
                      <span class="item-count">0</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="inner-banner">
          <img src={innerbanner} alt="image" />
          <div className="inner-caption">Dashboard</div>
        </div>
        <div className="innerpage myaccount-pages">
          <div className="container">
            <div className="dashboard-main">
              <div className="dashboard-sidebar">
                <ul>
                  <li>
                    <a href="#">Account Details</a>
                  </li>
                  <li>
                    <a href="#">Address Book</a>
                  </li>
                  <li>
                    <a href="#">Orders</a>
                  </li>
                  <li>
                    <a href="#">Vouchers</a>
                  </li>
                  <li>
                    <a href="#">Change Password</a>
                  </li>
                  <li>
                    <a href="#">Logout</a>
                  </li>
                </ul>
              </div>
              <div className="dashboard-aside">
                {/* Account Information Start  */}
                <div className="da-acc-info">
                  <h4>Account Information</h4>

                  <div className="form-group">
                    <label className="control-label">Name</label>
                    <div className="controls">
                      <input
                        type="text"
                        placeholder="placeholder"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label">Last Name</label>
                    <div className="controls">
                      <input
                        type="text"
                        placeholder="placeholder"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label">Email Address</label>
                    <div className="controls">
                      <input
                        type="text"
                        placeholder="placeholder"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label">Mobile Number</label>
                    <div className="controls">
                      <input
                        type="text"
                        placeholder="placeholder"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="two-column-form">
                    <div className="form-group">
                      <label className="control-label">Birthday</label>
                      <div className="controls">
                        <input
                          type="text"
                          placeholder="placeholder"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label">Gender</label>
                      <div className="controls">
                        <select>
                          <option>Option one</option>
                          <option>Option two</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="single-center-btn">
                    <button className="button">Update</button>
                  </div>
                </div>
                {/* Account Information End  */}

                {/* Address Book Start  */}
                <div className="da-address-info">
                  <h4>Address Book</h4>

                  <div className="address-group-list">
                    <div className="address-gl-row active">
                      <div className="address-gl">
                        <div className="address-radio"></div>
                        <div className="address-txt">
                          501 TAMPINES CENTRAL 1 TAMPINES HEART, Singapore,
                          520501
                        </div>
                        <div className="address-action">
                          <a href="#" className="address-edit">
                            {" "}
                            <i
                              class="fa fa-pencil-square-o"
                              aria-hidden="true"
                            ></i>
                          </a>
                          <a href="#" className="address-delete">
                            {" "}
                            <i class="fa fa-trash-o" aria-hidden="true"></i>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="address-gl-row">
                      <div className="default-marker">Default</div>
                      <div className="address-gl">
                        <div className="address-radio"></div>
                        <div className="address-txt">
                          501 TAMPINES CENTRAL 1 TAMPINES HEART, Singapore,
                          520501
                        </div>
                        <div className="address-action">
                          <a href="#" className="address-edit">
                            {" "}
                            <i
                              class="fa fa-pencil-square-o"
                              aria-hidden="true"
                            ></i>
                          </a>
                          <a href="#" className="address-delete">
                            {" "}
                            <i class="fa fa-trash-o" aria-hidden="true"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="address-gl-row">
                      <div className="address-gl">
                        <div className="address-radio"></div>
                        <div className="address-txt">
                          501 TAMPINES CENTRAL 1 TAMPINES HEART, Singapore,
                          520501
                        </div>
                        <div className="address-action">
                          <a href="#" className="address-edit">
                            {" "}
                            <i
                              class="fa fa-pencil-square-o"
                              aria-hidden="true"
                            ></i>
                          </a>
                          <a href="#" className="address-delete">
                            {" "}
                            <i class="fa fa-trash-o" aria-hidden="true"></i>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="single-center-btn">
                      <a href="#" className="button">
                        Add Address
                      </a>
                    </div>
                  </div>
                </div>
                {/* Address Book End  */}

                {/* Order  Start  */}
                <div className="da-orders-info">
                  <div className="da-orders-nav">
                    <ul>
                      <li className="active">
                        <a href="#">Current Orders</a>
                      </li>
                      <li>
                        <a href="#">Past Orders</a>
                      </li>
                    </ul>
                  </div>
                  <div className="da-orders-tab-panel-parent">
                    <div className="da-orders-tab-panel da-orders-current">
                      <div className="da-orders-row">
                        <div className="da-order-no">
                          {" "}
                          ORDER NO - 250320.E1002{" "}
                        </div>

                        <div className="da-order-merge-parent">
                          <div className="da-order-merge-column">
                            <div className="da-order-time-status">
                              <span>Order placed at : 20/03/2025 3:26 PM</span>{" "}
                              <span>Pay by : Cash</span>
                            </div>
                            <div className="da-order-two-handling">
                              <div className="da-order-two-handling-lhs">
                                <h5>Outlet</h5>
                                <p>
                                  #123-111,10, PAYA LEBAR ROAD,PLQ
                                  MALL,Singapore 409057
                                </p>
                              </div>
                              <div className="da-order-two-handling-rhs">
                                <h5>Delivery Location</h5>
                                <p>
                                  #3-4,334 Serangoon Avenue 3,Singapore 550334
                                </p>
                              </div>
                            </div>
                            <div className="da-order-date-time">
                              <div className="da-order-date-time-lhs">
                                <h5>Delivery Date </h5>
                                <p>20/03/2025</p>
                              </div>
                              <div className="da-order-date-time-rhs">
                                <h5>Delivery Time </h5>
                                <p>7:00 PM - 11:00 PM</p>
                              </div>
                            </div>
                            <div className="da-order-amount">
                              <span>Order Amount</span>
                              <span>S$22.56</span>
                            </div>
                          </div>
                          <div className="da-order-action">
                            <a href="#" className="button doa-button-print">
                              Print Invoice
                            </a>
                            <a href="#" className="button doa-button-view">
                              View Receipt
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="da-orders-row">
                        <div className="da-order-no">
                          {" "}
                          ORDER NO - 250320.E1002{" "}
                        </div>

                        <div className="da-order-merge-parent">
                          <div className="da-order-merge-column">
                            <div className="da-order-time-status">
                              <span>Order placed at : 20/03/2025 3:26 PM</span>{" "}
                              <span>Pay by : Cash</span>
                            </div>
                            <div className="da-order-two-handling">
                              <div className="da-order-two-handling-lhs">
                                <h5>Outlet</h5>
                                <p>
                                  #123-111,10, PAYA LEBAR ROAD,PLQ
                                  MALL,Singapore 409057
                                </p>
                              </div>
                              <div className="da-order-two-handling-rhs">
                                <h5>Delivery Location</h5>
                                <p>
                                  #3-4,334 Serangoon Avenue 3,Singapore 550334
                                </p>
                              </div>
                            </div>
                            <div className="da-order-date-time">
                              <div className="da-order-date-time-lhs">
                                <h5>Delivery Date </h5>
                                <p>20/03/2025</p>
                              </div>
                              <div className="da-order-date-time-rhs">
                                <h5>Delivery Time </h5>
                                <p>7:00 PM - 11:00 PM</p>
                              </div>
                            </div>
                            <div className="da-order-amount">
                              <span>Order Amount</span>
                              <span>S$22.56</span>
                            </div>
                          </div>
                          <div className="da-order-action">
                            <a href="#" className="button doa-button-print">
                              Print Invoice
                            </a>
                            <a href="#" className="button doa-button-view">
                              View Receipt
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="da-orders-row">
                        <div className="da-order-no">
                          {" "}
                          ORDER NO - 250320.E1002{" "}
                        </div>

                        <div className="da-order-merge-parent">
                          <div className="da-order-merge-column">
                            <div className="da-order-time-status">
                              <span>Order placed at : 20/03/2025 3:26 PM</span>{" "}
                              <span>Pay by : Cash</span>
                            </div>
                            <div className="da-order-two-handling">
                              <div className="da-order-two-handling-lhs">
                                <h5>Outlet</h5>
                                <p>
                                  #123-111,10, PAYA LEBAR ROAD,PLQ
                                  MALL,Singapore 409057
                                </p>
                              </div>
                              <div className="da-order-two-handling-rhs">
                                <h5>Delivery Location</h5>
                                <p>
                                  #3-4,334 Serangoon Avenue 3,Singapore 550334
                                </p>
                              </div>
                            </div>
                            <div className="da-order-date-time">
                              <div className="da-order-date-time-lhs">
                                <h5>Delivery Date </h5>
                                <p>20/03/2025</p>
                              </div>
                              <div className="da-order-date-time-rhs">
                                <h5>Delivery Time </h5>
                                <p>7:00 PM - 11:00 PM</p>
                              </div>
                            </div>
                            <div className="da-order-amount">
                              <span>Order Amount</span>
                              <span>S$22.56</span>
                            </div>
                          </div>
                          <div className="da-order-action">
                            <a href="#" className="button doa-button-print">
                              Print Invoice
                            </a>
                            <a href="#" className="button doa-button-view">
                              View Receipt
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="da-orders-tab-panel da-orders-past"></div>
                  </div>
                </div>
                {/* Order  End */}

                {/* Vouchers  Start  */}

                <div className="da-orders-nav">
                  <ul>
                    <li className="active">
                      <a href="#">Available Voucher</a>
                    </li>
                    <li>
                      <a href="#">Redeemed Voucher</a>
                    </li>
                  </ul>
                </div>

                <div className="da-orders-tab-panel-parent">
                  <div className="da-orders-tab-panel da-vouchers-avilable">
                    <div className="coupon-card">
                      <img className="coupon-logo" src={logo} alt="logo" />
                      <h3>
                        20% flat off on all rides within the city
                        <br />
                        using HDFC Credit Card
                      </h3>
                      <di className="coupon-row">
                        <span id="cpnCode">STEALDEAL20</span>
                        <span id="cpnBtn">Copy Code</span>
                      </di>
                      <p>Valid Till: 20Dec, 2021</p>
                    </div>
                    <div className="coupon-card">
                      <img className="coupon-logo" src={logo} alt="logo" />
                      <h3>
                        20% flat off on all rides within the city
                        <br />
                        using HDFC Credit Card
                      </h3>
                      <di className="coupon-row">
                        <span id="cpnCode">STEALDEAL20</span>
                        <span id="cpnBtn">Copy Code</span>
                      </di>
                      <p>Valid Till: 20Dec, 2021</p>
                    </div>
                  </div>
                  <div className="da-orders-tab-panel da-vouchers-expired"></div>
                </div>
                {/* Vouchers  End  */}
              </div>
            </div>
          </div>
        </div>
        <footer className="fbg">
          <div className="container">
            <div className="footer-wrapper">
              <div className="footer-nav">
                <div className="footer-nav-inner">
                  <h5>About</h5>
                  <ul>
                    <li>
                      <a href="#">Home</a>
                    </li>
                    <li>
                      <a href="#">About Us</a>
                    </li>
                    <li>
                      <a href="#">Our Outlets</a>
                    </li>
                    <li>
                      <a href="#">Contact Us</a>
                    </li>
                  </ul>
                </div>
                <div className="footer-nav-inner">
                  <h5>Other</h5>
                  <ul>
                    <li>
                      <a href="#">Privacy Policy</a>
                    </li>
                    <li>
                      <a href="#">Terms & Conditions</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="footer-logo textcenter">
                <a href="#">
                  <img src={flogo} alt="logo" />{" "}
                </a>
              </div>
              <div className="footer-newsletter">
                <h4>Subscribe and stay Updated</h4>
                <p>
                  Join our email newsletter for exclusive offers, Blue Bottle
                  news, events, and first access to our most exciting releases.
                  Plus, get complimentary shipping on your first purchase when
                  you sign up.
                </p>
                <div class="f-newletter-form">
                  <input type="text" placeholder="Enter Your Email Address" />
                  <button type="submit" class="button">
                    Subscribe
                  </button>
                </div>
                <div className="footer-copyright">
                  © 2022 BLUE BOTTLE COFFEE INC., ALL RIGHTS RESERVED
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Reciept Popup */}
        {/* <div id="view-recipt-popup" className="mfp-hide view-recipt-big">
          <div className="da-orders-reciept">
            <div className="da-order-no"> ORDER NO - 250320.E1002 </div>

            <div className="da-order-merge-parent">
              <div className="da-order-merge-column">
                <div className="da-order-time-status">
                  <span>Order placed at : 20/03/2025 3:26 PM</span>{" "}
                  <span>Pay by : Cash</span>
                </div>
                <div className="da-order-two-handling">
                  <div className="da-order-two-handling-lhs">
                    <h5>Outlet</h5>
                    <p>
                      #123-111,10, PAYA LEBAR ROAD,PLQ MALL,Singapore 409057
                    </p>
                  </div>
                  <div className="da-order-two-handling-rhs">
                    <h5>Delivery Location</h5>
                    <p>#3-4,334 Serangoon Avenue 3,Singapore 550334</p>
                  </div>
                </div>
                <div className="da-order-date-time">
                  <div className="da-order-date-time-lhs">
                    <h5>Delivery Date </h5>
                    <p>20/03/2025</p>
                  </div>
                  <div className="da-order-date-time-rhs">
                    <h5>Delivery Time </h5>
                    <p>7:00 PM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="checkout-sidebar-header">
              <span>Items</span>
            </div>
            <div className="items-scroll">
              <div className="items-row">
                <div className="item-img-container">
                  <img src={cartplaceholder} />
                </div>
                <div className="item-info-container">
                  <div className="item-info-title">
                    <h6>Deep Fried Prawn in Thai Sauce</h6>
                    <div className="item-extrainfo-options">
                      <p>
                        <b>Optional:</b>{" "}
                      </p>
                      <p>6 X Request for Server </p>
                    </div>
                  </div>
                </div>
                <div className="item-price-action">
                  <div className="item-price-end"> S$54.50 </div>
                </div>
              </div>
              <div className="items-row">
                <div className="item-img-container">
                  <img src={cartplaceholder} />
                </div>
                <div className="item-info-container">
                  <div className="item-info-title">
                    <h6>Deep Fried Prawn in Thai Sauce</h6>
                    <div className="item-extrainfo-options">
                      <p>
                        <b>Optional:</b>{" "}
                      </p>
                      <p>6 X Request for Server </p>
                    </div>
                  </div>
                </div>
                <div className="item-price-action">
                  <div className="item-price-end"> S$24.50 </div>
                </div>
              </div>
              <div className="items-row">
                <div className="item-img-container">
                  <img src={cartplaceholder} />
                </div>
                <div className="item-info-container">
                  <div className="item-info-title">
                    <h6>Test Voucher</h6>
                  </div>
                </div>
                <div className="item-price-action">
                  <div className="item-price-end"> S$34.50 </div>
                </div>
              </div>
            </div>
            <div className="items-footer">
              <div className="item-price-row">
                <p class="text-uppercase">SUBTOTAL</p>
                <span>S$143.60</span>
              </div>
              <div className="item-price-row">
                <p class="text-uppercase">Delivery</p>
                <span>S$10.00 </span>
              </div>
              <div className="item-price-row">
                <p class="text-uppercase">GST (8 %)</p> <span>S$12.29</span>
              </div>
              <div className="item-price-row item-grantprice-row ">
                <p class="text-uppercase">Total</p> <span>S$165.89</span>
              </div>
            </div>
          </div>
        </div> */}

        {/* Password Change Popup */}
        <div
          id="change-popup-master"
          className="mfp-hide popup-master change-popup-section"
        >
          {/* <div className="password-change-region"> 
                <div className="pm-header">
                    <h4>Change Password</h4>
                </div>
                <div className="form-group">
                    <label class="control-label">Current Password</label>
                    <input
                    className="form-control"
                    type="password"
                    placeholder="Current Password"
                    />
                </div>
                <div className="form-group">
                    <label class="control-label">New Password</label>
                    <input
                    className="form-control"
                    type="password"
                    placeholder="New Password"
                    />
                </div>
                <div className="form-group">
                    <label class="control-label">Re-enter New Password</label>
                    <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    />
                </div>
                <div className="pm-single-button">
                    <button className="button">Confirm</button>
                </div>
            </div>    */}

          <div className="bill-change-region">
            <div className="pm-header">
              <h4>Billing Address</h4>
            </div>
            <div className="form-group">
              <label class="control-label">Postal Code</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Postal Code"
              />
            </div>
            <div className="form-group">
              <label class="control-label">Address line</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Address line"
              />
            </div>
            <div className="form-group">
              <label class="control-label">Unit Number 1</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Postal Code"
              />
            </div>
            <div className="form-group">
              <label class="control-label">Unit Number 2</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Postal Code"
              />
            </div>
            <div className="pm-single-button">
              <button className="button">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
