import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import cookie from "react-cookies";
import ContentLoader from "react-content-loader";
import Popup from "reactjs-popup";
import { toast } from "react-toastify";
import "reactjs-popup/dist/index.css";
import { apiUrl, uniqueID } from "../Settings/Config";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import innerbanner from "../../common/images/img/inner-banner.jpg";
import prothumb from "../../common/images/placeholder.jpg";
import { hideLoader, showLoader, showPrice } from "../Settings/SettingHelper";
import ProductDetail from "./ProductDetail";
var Parser = require("html-react-parser");

class Home extends Component {
  constructor(props) {
    super(props);
    const seletedAvilablityId = cookie.load("availability") ?? "";
    
    const outletID = cookie.load("outletID") ?? "";
    const categorySlug__ = this.props.match.params?.category ?? '';
    const productSlug__ = this.props.match.params?.productSlug ?? '';
    this.state = {
      loading: true,
      loginPopup:false,
      menuNavication: [],
      seletedAvilablityId: seletedAvilablityId,
      outletID: outletID,
      categorySlug: categorySlug__,
      productSlug: productSlug__,
      productList: [],
      openPopup: false,
      productDetails: "",
      trigerCart: false,
    };
  }
  componentDidMount() {
    if(this.state.seletedAvilablityId==="" || this.state.outletID==="") {
      cookie.save("triggerOrderType", 'Yes', { path: "/" });
      this.props.history.push('/')
    }
    this.loadMenuNavication();
  }
  componentWillReceiveProps(PropsDt) {
    let categorySlug_ = PropsDt.match.params?.category;
    if (categorySlug_ !== this.state.categorySlug) {
      if (categorySlug_ === "") {
        categorySlug_ = this.state.menuNavication[0].categorySlug;
      }
      this.setState({ categorySlug: categorySlug_, loading: true }, () => {
        this.loadProducts();
      });
    }
  }
  loadMenuNavication() {
    axios
      .get(
        `${apiUrl}products/categories?uniqueID=${uniqueID}&outletID=${this.state.outletID}&availabilityID=${this.state.seletedAvilablityId}`
      )
      .then((res) => {
        if (res.data.status === "ok") {
          const result = res.data.result;
          let categorySlug_ = this.state.categorySlug;
          if(categorySlug_==="") {
            categorySlug_ = result[0].categorySlug;
          }
          this.setState(
            { menuNavication: result, categorySlug: categorySlug_ },
            () => {
              this.loadProducts();
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
        this.props.history.push("./");
      });
  }
  loadProducts() {
    axios
      .get(
        `${apiUrl}products/category-products?uniqueID=${uniqueID}&outletID=${this.state.outletID}&availabilityID=${this.state.seletedAvilablityId}&categorySlug=${this.state.categorySlug}`
      )
      .then((res) => {
        if (res.data.status === "ok") {
          const result = res.data.result;
          this.setState({ productList: result, loading: false }, () => {
            const productDetails = this.findProductBySlug(
              result,
              this.state.productSlug
            );
            if (productDetails !== null) {
              this.loadProductDetails(productDetails);
            }
          });
        }
      })
      .catch(() => {});
  }
  findProductBySlug = (data, slug) => {
    for (const category of data) {
      const product = category.products.find((p) => p.productSlug === slug);
      if (product) return product;
    }
    return null; // if not found
  };

  loadProductDetails(product, e) {
    const event = e ?? "";
    if (event !== "") {
      e.preventDefault();
    }

    showLoader(`pro${product._id}`);
    axios
      .get(
        `${apiUrl}products/product-details?uniqueID=${uniqueID}&productSlug=${product.productSlug}&outletID=${this.state.outletID}`
      )
      .then((res) => {
        if (res.data.status === "ok") {
          const result = res.data.result;
          this.setState({ productDetails: result, openPopup: true }, () => {
            hideLoader(`pro${product._id}`);
          });
        }
      })
      .catch(() => {
        hideLoader(`pro${product._id}`);
        const errorMsg = e?.response?.data?.message || e.message;
        toast.error(errorMsg);
      });
  }
  updateStateValue = (field, value) => {
    this.setState({ [field]: value });
  };

  render() {
    return (
      <div className="cover">
        <Header
          trigerCart={this.state.trigerCart}
          updateStateValue={this.updateStateValue.bind(this)}
          loginPopup={this.state.loginPopup}
        />
        <div className="inner-banner">
          <img src={innerbanner} alt="banner" />
          <div className="inner-caption">Menu</div>
        </div>
        <div className="sidebar-menu">
          <div className="container">
            <div className="collection">
              {this.state.menuNavication.length > 0 && (
                <ul>
                  {this.state.menuNavication.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className={
                          this.state.categorySlug === item.categorySlug
                            ? "active"
                            : ""
                        }
                      >
                        <Link to={`/products/${item.categorySlug}`}>
                          {item.categoryCustomTitle}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="innerpage">
          <div className="container">
            <div className="products-list">
              {this.state.loading === true ? (
                <div className="product-row">
                  <div className="product-grid-row">
                    <ul>
                      {[0, 1, 2, 3].map((item) => {
                        return (
                          <li key={item} className="product-grid">
                            <ContentLoader
                              viewBox="0 0 290 280"
                              height={280}
                              width={290}
                            >
                              <rect
                                x="3"
                                y="3"
                                rx="10"
                                ry="10"
                                width="300"
                                height="180"
                              />
                              <rect
                                x="6"
                                y="190"
                                rx="0"
                                ry="0"
                                width="292"
                                height="20"
                              />
                              <rect
                                x="4"
                                y="215"
                                rx="0"
                                ry="0"
                                width="239"
                                height="20"
                              />
                              <rect
                                x="4"
                                y="242"
                                rx="0"
                                ry="0"
                                width="274"
                                height="20"
                              />
                            </ContentLoader>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ) : (
                this.state.productList.length > 0 &&
                this.state.productList.map((item, index) => {
                  const longDescription =
                    item?.subCategoryLongDescription ?? "";
                  const shortDescription =
                    item?.subCategoryShortDescription ?? "";
                  return (
                    <div className="product-row" key={index}>
                      <div className="product-row-info">
                        <h3>{item.subCategoryName}</h3>
                        {longDescription !== null && longDescription !== ""
                          ? Parser(longDescription)
                          : shortDescription !== null && shortDescription !== ""
                          ? Parser(shortDescription)
                          : ""}
                      </div>
                      {item.products.length > 0 && (
                        <div className="product-grid-row">
                          <ul>
                            {item.products.map((proItem, proIndex) => {
                              const productAliasName =
                                proItem?.productAliasName ?? "";
                              let productName = proItem?.productName ?? "";
                              if (
                                productAliasName !== "" &&
                                productAliasName !== null
                              ) {
                                productName = productAliasName;
                              }
                              const productShortDescription =
                                proItem?.productShortDescription ?? "";
                              return (
                                <li
                                  className={`product-grid ${proItem.outOfStock==="Yes" && 'product-soldout'}`}
                                  key={proIndex}
                                  id={`pro${proItem._id}`}
                                >
                                  <div className="product-cover">
                                    <div className="dish-img">
                                      <a href="/" className="dish-img-link" onClick={this.loadProductDetails.bind(
                                            this,
                                            proItem
                                          )}>
                                        <img src={proItem?.productThumbnail || prothumb} alt={productName} />
                                      </a>
                                    </div>
                                    <div className="dish-info">
                                      <h3 className="dish-name">
                                        {productName}
                                      </h3>
                                      <div className="dish-desc">
                                      {productShortDescription !== null &&
                                        productShortDescription !== "" && (                                         
                                            Parser(productShortDescription)                                       
                                        )}
                                         </div>
                                      <div className="dish-price">
                                        {parseFloat(proItem.productCost)>0 &&
                                          <span className="strike-price">
                                            {showPrice(proItem.productCost)}
                                          </span>
                                          }
                                        <span className="new-price">
                                          {showPrice(proItem.productPrice)}
                                        </span>
                                      </div>
                                      <div className="dish-order-btn">
                                        <a
                                          href="/"
                                          className="button"
                                          onClick={this.loadProductDetails.bind(
                                            this,
                                            proItem
                                          )}
                                        >
                                          {proItem.outOfStock==="Yes"?'Sold Out':'Order Now'}                                          
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        {this.state.productDetails !== "" && (
          <Popup
            open={this.state.openPopup}
            onClose={() => this.setState({ openPopup: false })}
            modal
            closeOnDocumentClick={false}
            className="detail-popup"
          >
            <ProductDetail
              productDetails={this.state.productDetails}
              updateStateValue={this.updateStateValue}
            />
          </Popup>
        )}
        <Footer {...this.props} updateStateValue={this.updateStateValue.bind(this)} />
      </div>
    );
  }
}
export default Home;
