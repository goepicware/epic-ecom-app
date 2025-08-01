/* eslint-disable */
import React, { Component, createRef } from "react";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import axios from "axios";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import OwlCarousel from "react-owl-carousel2";
import "../../common/css/owl.carousel.css";

import banner from "../../common/images/img/banner.jpg";
import banner1 from "../../common/images/img/banner1.jpg";
import cycle from "../../common/images/cycle.svg";
import selficon from "../../common/images/self-pickup.svg";
import dineicon from "../../common/images/dine-in-icon.svg";
import reservation from "../../common/images/reservation-icon.svg";
import prothumb from "../../common/images/placeholder.jpg";
import gallerybig from "../../common/images/img/gallery.jpg";
import gallerythumb from "../../common/images/img/gallery1.jpg";
import gallerythumb1 from "../../common/images/img/gallery2.jpg";
import quote from "../../common/images/img/quote.svg";

import abt from "../../common/images/img/abt-img.png";
import searchi from "../../common/images/img/search-black.svg";
import ban from "../../common/images/img/deliv-ban.jpg";
import {
  apiUrl,
  uniqueID,
  deliveryId,
  pickupId,
  CountryName,
} from "../Settings/Config";

import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import {
  addressFormat,
  showLoader,
  hideLoader,
  showPriceDirect,
} from "../Settings/SettingHelper";


var mainbanner = {
  items: 1,
  loop: true,
  dots: true,
  nav: false,
  margin: 0,
};
var dishslider = {
  items: 4,
  loop: false,
  dots: true,
  nav: false,
  margin: 0,
  responsive: {
    0: {
      items: 1,
    },
    420: {
      items: 2,
    },
    780: {
      items: 2,
    },
    920: {
      items: 4,
    },
  },
};
var gallery = {
  items: 1,
  loop: true,
  dots: true,
  nav: false,
};
var reviewslider = {
  items: 1,
  loop: true,
  dots: true,
  nav: false,
};
var newdishslider = {
  items: 4,
  loop: false,
  dots: true,
  nav: false,
  margin: 0,
  responsive: {
    0: {
      items: 1,
    },
    420: {
      items: 2,
    },
    780: {
      items: 2,
    },
    920: {
      items: 4,
    },
  },
};

class Home extends Component {
  constructor(props) {
    super(props);
    const seletedAvilablityId = cookie.load("availability") ?? "";
    const seletedAvilablityName = cookie.load("availabilityName") ?? "";
    this.state = {
      seletedAvilablityId: seletedAvilablityId,
      seletedAvilablityName: seletedAvilablityName,

      openAvailPopup:false,
      loginPopup:false,

      featuredproductList: [],
      newdishesproductList: [],

      selectedPro:"",
      
    };
    this.popupRef = createRef();
  }

  componentDidMount() {
    this.loadFeaturedProducts();
    this.loadNewdishesProducts();
  }

  loadFeaturedProducts() {
    axios
      .get(
        `${apiUrl}products/special-products?uniqueID=${uniqueID}&specialType=featured`
      )
      .then((res) => {
        if (res.data.status === "ok") {
          const result = res.data.result;
          console.log(result, "resultresultresultresult");
          this.setState({ featuredproductList: result });
        }
      })
      .catch(() => {});
  }
  loadNewdishesProducts() {
    axios
      .get(
        `${apiUrl}products/special-products?uniqueID=${uniqueID}&specialType=newdishes`
      )
      .then((res) => {
        if (res.data.status === "ok") {
          const result = res.data.result;
          this.setState({ newdishesproductList: result });
        }
      })
      .catch(() => {});
  }

  updateStateValue = (field, value) => {
    this.setState({ [field]: value });
  };

  handleClick = (e) => {
    e.preventDefault();
    const target = e.target.closest('[data-id]');
    if (target) {
      const id = target.getAttribute('data-id');
      if(this.state.seletedAvilablityId!=="") {
        this.props.history.push(id)
      }else {
        this.setState({selectedPro:id, openAvailPopup:true})
      }
    }
  };

  loadProductList(proList) {
    return proList.map((item, index) => {
      return (
        <div className="item" key={index} data-id={`/products/${item.category?.categorySlug}/${item.productSlug}`}>
          <div className="product-cover">
            <div className="dish-img">
              <a href="/" className="dish-img-link">
                <img src={item?.productThumbnail || prothumb} alt="Thumb" />
              </a>
            </div>
            <div className="dish-info">
              <h3 className="dish-name">{item.productName}</h3>
              <p className="dish-price">
                {parseFloat(item.productCost)>0 &&
                <span className="strike-price">
                  {showPriceDirect(item.productCost)}
                </span>
                }
                {showPriceDirect(item.productPrice)}
              </p>
              <div className="dish-order-btn">
                <a href="/"
                  className="button"
                >
                  Order Now
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  selectAvailability(availability, availabilityName, e) {
    e.preventDefault();
    this.setState({
      seletedAvilablityId: availability,
      seletedAvilablityName: availabilityName,
      popupType: "avalablity",
      openAvailPopup: true,
    });
  }

  render() {
    return (
      <div className="cover">
        <Header {...this.props} updateStateValue={this.updateStateValue.bind(this)} openAvailPopup={this.state.openAvailPopup} loginPopup={this.state.loginPopup} allowDefaultAvilablity={this.state.seletedAvilablityId} allowDefaultAvilablityName={this.state.seletedAvilablityName} />
        <div className="main-slider">
          <OwlCarousel options={mainbanner}>
            <div className="item">
              <img src={banner} alt="burger" />
            </div>
          </OwlCarousel>
        </div>
        <div className="home-pick">
          <div className="container">
            <div className="home-picker-inner">
              <ul>
                <li>
                  <a
                    href="/"
                    onClick={this.selectAvailability.bind(
                      this,
                      deliveryId,
                      "Delivery"
                    )}
                  >
                    <figure>
                      <img src={cycle} alt="cycle" />
                    </figure>
                    <figcaption>Delivery</figcaption>
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    onClick={this.selectAvailability.bind(
                      this,
                      pickupId,
                      "Pickup"
                    )}
                  >
                    <figure>
                      <img src={selficon} alt="Self Pickup" />
                    </figure>
                    <figcaption>Self Pickup</figcaption>
                  </a>
                </li>
                {/* <li>
                  <a href="/">
                    <figure>
                      <img src={dineicon} alt="Dine In" />
                    </figure>
                    <figcaption>Dine In</figcaption>
                  </a>
                </li>
                <li>
                  <a href="/">
                    <figure>
                      <img src={reservation} alt="Reservation" />
                    </figure>
                    <figcaption>Reservation</figcaption>
                  </a>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
        {this.state.featuredproductList.length > 0 && (
          <div className="feature-dishes textcenter">
            <div className="container">
              <h2 className="two-color-header">
                Featured <span>Dishes</span>
              </h2>
              <div className="dish-slider" onClick={this.handleClick.bind(this)}>
                <OwlCarousel options={dishslider}>
                  {this.loadProductList(this.state.featuredproductList)}
                </OwlCarousel>
              </div>
            </div>
          </div>
        )}
        <div className="home-gallery">
          <div className="container">
            <OwlCarousel options={gallery}>
              <div className="gallery-item">
                <div className="gallery-item-lhs">
                  <img src={gallerybig} alt="burger" />
                </div>
                <div className="gallery-item-rhs">
                  <div className="gir-top">
                    <img src={gallerythumb} alt="burger" />
                  </div>
                  <div className="gir-btm">
                    <img src={gallerythumb1} alt="burger" />
                  </div>
                </div>
              </div>
            </OwlCarousel>
          </div>
        </div>
        <div className="home-about rel">
          <div className="front-hide">
            <img src={abt} alt="pizza" />
          </div>
          <div className="container">
            <div className="home-abt-text">
              <h2>About Us</h2>
              <p>
              🍣 Welcome to Chirashizushi Shou – where fresh, quality ingredients meet the art of Japanese comfort food 🇯🇵. We're a Singapore-based brand that specializes in vibrant, delicious chirashi bowls 🥢, packed with premium sashimi 🐟 and thoughtful touches 💫.
              </p>
              <Link to="/about-us" className="button">
                Read More
              </Link>
            </div>
            <div className="about-reviews textcenter">
              <OwlCarousel options={reviewslider}>
                <div className="review-item">
                  <div className="quote-img">
                    <img src={quote} alt="burger" />{" "}
                  </div>
                  <div className="testitext">
                  <strong>"Best chirashi bowl in SG!"</strong><br/>
                  I’ve tried a lot of chirashi bowls around Singapore, but Chirashizushi Shou absolutely blew me away. The sashimi was fresh, thick-cut, and super flavorful. You can tell they don’t skimp on quality. I’ll definitely be a regular here!<br/>⭐️⭐️⭐️⭐️⭐️
                  </div>
                  <div className="reviewer-name">— Jasmine T.</div>
                </div>
                <div className="review-item">
                  <div className="quote-img">
                    <img src={quote} alt="burger" />{" "}
                  </div>
                  <div className="testitext">
                  <strong>"Great value for amazing quality"</strong><br/>
                  Honestly, I was surprised by how generous the portions were! For the price, I wasn’t expecting such premium ingredients. The rice was seasoned just right and the toppings were on point. Highly recommend for anyone craving real Japanese flavors.<br/>
                  ⭐️⭐️⭐️⭐️⭐️
                  </div>
                  <div className="reviewer-name">— Daniel C.</div>
                </div>
                <div className="review-item">
                  <div className="quote-img">
                    <img src={quote} alt="burger" />{" "}
                  </div>
                  <div className="testitext">
                  <strong> "Fast, friendly, and super satisfying"</strong><br/>                 
                  Ordered for pick-up at the Bukit Timah outlet and everything was ready on time, neatly packed, and still fresh when I got home. The staff were polite and helpful, and the food tasted just like something you'd get in Tokyo.<br/>
                  ⭐️⭐️⭐️⭐️⭐️
                  </div>
                  <div className="reviewer-name">— Mei L.</div>
                </div>
              </OwlCarousel>
            </div>
          </div>
        </div>
        {this.state.newdishesproductList.length>0 &&
          <div className="new-dishes textcenter">
            <div className="container">
              <h2 className="two-color-header">
                New <span>Dishes</span>
              </h2>
              <div className="dish-slider" onClick={this.handleClick.bind(this)}>
                <OwlCarousel options={newdishslider}>
                  {this.loadProductList(this.state.newdishesproductList)}
                </OwlCarousel>
              </div>
            </div>
          </div>
        }
        <Footer {...this.props} updateStateValue={this.updateStateValue.bind(this)} />
      </div>
    );
  }
}
export default Home;
