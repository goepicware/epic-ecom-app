import React from "react";
import Axios from "axios";
import cookie from "react-cookies";
import { toast } from "react-toastify";
import $ from "jquery";

import ModalImage from "react-modal-image";
import { uniqueID, apiUrl, currency } from "../Settings/Config";
import {
  stripslashes,
  showPrice,
  showLoader,
  hideLoader,
  showAlert,
  getReferenceID
} from "../Settings/SettingHelper";
import closeicon from "../../common/images/img/close-top.svg";
import plusi from "../../common/images/plus.svg";
import minusi from "../../common/images/minus.svg";
import prothumb from "../../common/images/placeholder.jpg";

var Parser = require("html-react-parser");
var qs = require("qs");

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    var selectedProSlug = "";

    var orderOutletId = cookie.load("outletID") ?? "";
    const seletedAvilablityId = cookie.load("availability") ?? "";

    var special_message_character_limit = "30";
    let productSpecialPrice =
      this.props.productDetails?.productSpecialPrice ?? 0;
    var compoTotalPrice =
      parseFloat(productSpecialPrice) > 0
        ? productSpecialPrice
        : this.props.productDetails.productPrice;

    this.state = {
      productdetail: this.props.productDetails,
      selectedProSlug: selectedProSlug,
      navigateMenu: [],
      navigateMenuTmp: [],
      selectedCategoryName: "",
      selectedSlugType: "",
      selectedSlugValue: "",
      catNavIndex: 0,
      productdetailstatus: "",

      productcommon: [],
      selectedProId: "",
      special_message_character_limit: special_message_character_limit,
      remaining: special_message_character_limit,
      product_remarks: "",
      mdfinput_value: 1,
      mdfApi_call: "Yes",
      modParentProductId: "",
      modProductPrice: "",
      modProductTotalPrice: "",
      compoinput_value: 1,
      incrCompoPrice: 0,
      compoApi_call: "Yes",
      cartTriggerFlg: "No",
      varSimpleProQty: 1,
      orderOutletId: orderOutletId,
      seletedAvilablityId: seletedAvilablityId,
      customerId: cookie.load("UserId") || "",
      favproductID: [],
      favdeleteproductID: [],
      openFilterSheet: false,
      incdecPro: "",
      compoTotalPrice: compoTotalPrice,
      shouldZoom:false
    };
    this.props.updateStateValue("selectedproductPrice", compoTotalPrice);
  }

  componentDidMount() {}

  addFavourite(productID, fav_flag) {
    if (this.state.customerId !== "") {
      var formData = {
        app_id: uniqueID,
        productID: productID,
        fav_flag: fav_flag,
        customer_id: this.state.customerId,
      };
      var favproductID = this.state.favproductID;
      var favdeleteproductID = this.state.favdeleteproductID;
      if (fav_flag === "Yes") {
        favproductID.push(productID);
        const index1 = favdeleteproductID.indexOf(productID);
        if (index1 > -1) {
          favdeleteproductID.splice(index1, 1);
        }
      } else {
        const index = favproductID.indexOf(productID);
        if (index > -1) {
          favproductID.splice(index, 1);
        }
        favdeleteproductID.push(productID);
      }
      this.setState({
        favproductID: favproductID,
        favdeleteproductID: favdeleteproductID,
      });

      var postObject = qs.stringify(formData);
      this.props.getFavouriteproducts(postObject);
    } else {
      $.magnificPopup.open({
        items: {
          src: "#login-popup",
        },
        type: "inline",
      });
    }
  }
  closeProduct(e) {
    e.preventDefault();
    this.props.updateStateValue("openPopup", false);
  }
  handleZoomChange = () => {
    alert('dsdasada')
    this.setState({ isZoomed: true });
  };

  productDetailsMain() {
    var proDetails = this.props.productDetails;
    const productLongDescription = proDetails?.productLongDescription ?? "";
    const productShortDescription = proDetails?.productShortDescription ?? "";
    var desc =
      productLongDescription !== "" && productLongDescription !== null
        ? productLongDescription
        : productShortDescription !== "" && productShortDescription !== null
        ? productShortDescription
        : "";

    var comboLgth = proDetails.productComboSet
      ? proDetails.productComboSet.length
      : 0;

    var isCombo = proDetails.productType === 2 && comboLgth > 0 ? "Yes" : "No";
    var isSimple =
      proDetails.productType === 1 && comboLgth === 0 ? "Yes" : "No";
    const productAliasName = proDetails?.productAliasName ?? "";
    let productName = proDetails?.productName ?? "";
    if (productAliasName !== "" && productAliasName !== null) {
      productName = productAliasName;
    }
    const productSpecialPrice = proDetails?.productSpecialPrice ?? 0;
    var modProductTotalPrice =
      parseFloat(productSpecialPrice) > 0
        ? productSpecialPrice
        : proDetails.productPrice;
    const productLargeImage  = proDetails?.productLargeImage ?? '';
    const productThumbnail = proDetails?.productThumbnail ?? '';

    return (
      <div
        className="inn-product-popup"
        key={proDetails._id}
        id={"product_" + proDetails._id}
      >
        <div className="product-close">
          <a href="/" onClick={this.closeProduct.bind(this)}>
            <img src={closeicon} alt="back" />
          </a>
        </div>
        <section className="product-details-top-info">
          <div className="product-grid-info">
            <div className="detail-product-img">
              <ModalImage
                small={productThumbnail!=="" && productThumbnail!==null?productThumbnail:prothumb}
                large={productLargeImage!=="" && productLargeImage!==null?productLargeImage:((productThumbnail!=="" && productThumbnail!==null)?productThumbnail:prothumb)}
                alt={productName}
                draggable={false}
              />
            </div>
            <div className="detail-product-desc">
              <h3> {stripslashes(productName)} </h3>
              {desc !== "" && desc !== null ? Parser(desc) : ""}
            </div>
          </div>
          <div className="inn-product-details">
            {isCombo === "Yes" ? this.comboProDetails(proDetails) : ""}
          </div>
        </section>
        {isCombo === "Yes" && (
          <div className="prd_chosen_sub_row">
            <p className="total_price product_details_price">
              <div className="product-price">
                {parseFloat(productSpecialPrice) > 0 &&
                  (parseFloat(proDetails.productSpecialPrice) > 0 ? (
                    <span className="price_disc">
                      {showPrice(proDetails.productSpecialPrice)}
                    </span>
                  ) : (
                    parseFloat(proDetails.productCost) > 0 && (
                      <span className="price_disc strike-price">
                        {showPrice(proDetails.productCost)}
                      </span>
                    )
                  ))}
              </div>
              <span id="id_price_final">{showPrice(modProductTotalPrice)}</span>
            </p>

            <div className="prd_chosen_sub_col popup_addcart_cls compo_addcart_cls">
              <div className="addcart_row prd_chosen_sub_item_left cart_update_div compo_update_div">
                <p className="sel-quality">Select Quantity</p>
                <div className="qty_bx">
                  <span
                    className="qty_minus"
                    onClick={this.compoQtyAction.bind(this, "decr")}
                  >
                    <img src={minusi} alt="minus" />
                  </span>
                  <input
                    type="text"
                    value={this.state.compoinput_value}
                    className="compo_proqty_input"
                    readOnly="1"
                  />
                  <span
                    className="qty_plus"
                    onClick={this.compoQtyAction.bind(this, "incr")}
                  >
                    <img src={plusi} alt="plus" />
                  </span>
                </div>
              </div>

              <div className="prd_chosen_sub_item_right cart_update_div compo_update_div">
                <button
                  onClick={this.addToCartCombo.bind(this, proDetails, "done")}
                >
                  {proDetails.outOfStock==="Yes"?'Sold Out':'Add To Cart'}
                </button>
              </div>
            </div>
          </div>
        )}
        {isSimple === "Yes" && (
          <div className="prd_chosen_sub_row">
            <p className="total_price product_details_price">
              <div className="product-price">
                {parseFloat(productSpecialPrice) > 0 &&
                  (parseFloat(proDetails.productPrice) > 0 ? (
                    <span className="price_disc strike-price">
                      {showPrice(proDetails.productPrice)}
                    </span>
                  ) : (
                    parseFloat(proDetails.productCost) > 0 && (
                      <span className="price_disc strike-price">
                        {showPrice(proDetails.productCost)}
                      </span>
                    )
                  ))}
              </div>
              <span id="id_price_final">
                {showPrice(
                  parseFloat(modProductTotalPrice) *
                    parseInt(this.state.varSimpleProQty)
                )}
              </span>
            </p>
            <div
              id={"proDtIndex-" + proDetails._id}
              className="prd_chosen_sub_col popup_addcart_cls modfir_addcart_cls"
            >
              <div className="addcart_row prd_chosen_sub_item_left cart_update_div addcart_done_maindiv">
                <p className="sel-quality">Select Quantity</p>
                <div className="qty_bx">
                  <span
                    className="qty_minus"
                    onClick={this.proQtyAction.bind(
                      this,
                      proDetails._id,
                      "decr"
                    )}
                  >
                    <img src={minusi} alt="minus" />
                  </span>
                  <input
                    type="text"
                    value={this.state.varSimpleProQty}
                    className="proqty_input"
                    readOnly="1"
                  />
                  <span
                    className="qty_plus"
                    onClick={this.proQtyAction.bind(
                      this,
                      proDetails._id,
                      "incr"
                    )}
                  >
                    <img src={plusi} alt="plus" />
                  </span>
                </div>
              </div>

              <div className="prd_chosen_sub_item_right cart_update_div addcart_done_maindiv">
                <button onClick={this.addToCartSimple.bind(this, proDetails)}>
                  {proDetails.outOfStock==="Yes"?'Sold Out':'Add To Cart'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  proQtyAction(indxFlg, actionFlg) {
    var proqtyInput = $("#proDtIndex-" + indxFlg)
      .find(".proqty_input")
      .val();
    proqtyInput = parseInt(proqtyInput);
    if (actionFlg === "decr") {
      proqtyInput = proqtyInput > 1 ? proqtyInput - 1 : proqtyInput;
    } else {
      proqtyInput = proqtyInput + 1;
    }
    this.setState({ varSimpleProQty: proqtyInput });
  }

  /* add to cart */
  addToCartSimple(productDetail) {
    if(productDetail.outOfStock==="Yes") {
      toast.error('This Product Sold Out');
    }else {
    var IndexFlg = productDetail._id;
    showLoader("proDtIndex-" + IndexFlg, "Idtext");
    var postObject = {};
    const customerID = localStorage.getItem('customerID') ?? '';
    const referenceID = (customerID==="") ? getReferenceID() : '';

    postObject = {
      uniqueID: uniqueID,
      customerID: customerID,
      referenceID: referenceID,
      outletID: this.state.orderOutletId,
      zoneID: "",
      availabilityID: this.state.seletedAvilablityId,
      productID: productDetail._id,
      itemProductType: 1,
      itemQuantity: this.state.varSimpleProQty,
      itemComboSet: "",
      itemPrice: productDetail.productPrice,
      itemTotalPrice:
        parseFloat(productDetail.productPrice) * this.state.varSimpleProQty,
      itemNote: "",
    };

    Axios.post(apiUrl + "cart", postObject)
      .then((res) => {
        hideLoader("proDtIndex-" + IndexFlg, "Idtext");
        if (res.data.status === "ok") {
          this.props.updateStateValue("trigerCart", true);
          this.props.updateStateValue("openPopup", false);
          toast.success(res.data.message);
        }
      })
      .catch((e) => {
        hideLoader("proDtIndex-" + IndexFlg, "Idtext");
        const errorMsg = e?.response?.data?.message || e.message;
        toast.error(errorMsg);
      });
    }
  }

  handleShowAlertFun(header, msg) {
    var magnfPopup = $.magnificPopup.instance;
    showAlert(header, msg, magnfPopup);
    $.magnificPopup.open({
      items: {
        src: ".alert_popup",
      },
      type: "inline",
    });
  }

  handleChange(mdfVl, event) {
    $("#modErrorDiv").hide();
    this.setState({
      mdfApi_call: "Yes",
      ["modifier~~" + mdfVl]: event.target.value,
    });
  }

  mfdrQtyAction(actionFlg) {
    var proqtyInput = $(".modfir_proqty_input").val();
    var modProductPrice = $("#modProductPrice").val();
    proqtyInput = parseInt(proqtyInput);
    if (actionFlg === "decr") {
      proqtyInput = proqtyInput > 1 ? proqtyInput - 1 : proqtyInput;
    } else {
      proqtyInput = proqtyInput + 1;
    }

    var productTotalPrice =
      parseFloat(modProductPrice) * parseFloat(proqtyInput);
    productTotalPrice = parseFloat(productTotalPrice).toFixed(2);
    this.setState({
      mdfApi_call: "No",
      mdfinput_value: proqtyInput,
      modProductTotalPrice: productTotalPrice,
    });
  }

  updateRemarks(event) {
    this.setState({ mdfApi_call: "No", product_remarks: event.target.value });
    var special_message_character_limit =
      this.state.special_message_character_limit;
    this.setState({
      remaining: special_message_character_limit - event.target.value.length,
    });
  }

  /* show combo product Details */
  comboProDetails(proDetailArr) {
    var comboArr =
      proDetailArr.productComboSet !== null &&
      proDetailArr.productComboSet !== ""
        ? proDetailArr.productComboSet
        : [];
    if (Object.keys(comboArr).length > 0) {
      var minMaxSelect_ = proDetailArr?.productApplyMinMaxSelect ?? false;
      const minMaxSelect = minMaxSelect_ === true ? 1 : 0;
      const productSpecialPrice = proDetailArr?.productSpecialPrice ?? 0;
      var compoTotalPrice =
        parseFloat(productSpecialPrice) > 0
          ? productSpecialPrice
          : proDetailArr.productPrice;
      console.log(minMaxSelect, "minMaxSelectminMaxSelectminMaxSelect");
      return (
        <div>
          <div className="prd_chosen_row compo_top_div">
            <div className="product_chosen_inner">
              <input
                type="hidden"
                id="set_menu_component_type"
                name="set_menu_component_type"
                value={minMaxSelect}
              />
              <input
                type="hidden"
                id="product_unitprice"
                name="product_unitprice"
                value={compoTotalPrice}
              />
              <input
                type="hidden"
                id="incr_compo_price"
                name="incr_compo_price"
                value={this.state.incrCompoPrice}
              />

              <div className="product_chosen_col common_compo_div">
                {minMaxSelect === 0 && this.singleComboDet(comboArr)}
                {minMaxSelect === 1 && this.multipleComboDet(comboArr)}
              </div>

              <div className="product_chosen_col product_chosen_col_right" style={{display:'none'}}>
                <div className="text-box">
                  <h3>
                    Notes <span>(Optional)</span>
                  </h3>
                  <textarea
                    placeholder="You can enter your special remark in the section..."
                    name="special_notes"
                    id="special_notes"
                    maxLength={this.state.special_message_character_limit}
                    value={this.state.product_remarks}
                    onChange={this.updateRemarksCompo.bind(this)}
                  ></textarea>
                  <em>
                    {this.state.remaining > 0 ? this.state.remaining : "0"}
                    Characters remaining
                  </em>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="prd_chosen_sub_row">
            <p className="total_price product_details_price">
              <div className="product-price">
                {parseFloat(productSpecialPrice) > 0 &&
                  (parseFloat(proDetailArr.productPrice) > 0 ? (
                    <span className="price_disc">
                      {showPrice(proDetailArr.productPrice)}
                    </span>
                  ) : (
                    parseFloat(proDetailArr.productCost) > 0 && (
                      <span className="price_disc">
                        {showPrice(proDetailArr.productCost)}
                      </span>
                    )
                  ))}
              </div>
            </p>

            <div className="prd_chosen_sub_col popup_addcart_cls compo_addcart_cls">
              <div className="addcart_row prd_chosen_sub_item_left cart_update_div compo_update_div">
                <p className="sel-quality">Select Quantity</p>
                <div className="qty_bx">
                  <span
                    className="qty_minus"
                    onClick={this.compoQtyAction.bind(this, "decr")}
                  >
                    <img src={minusi} alt="minus" />
                  </span>
                  <input
                    type="text"
                    value={this.state.compoinput_value}
                    className="compo_proqty_input"
                    readOnly="1"
                  />
                  <span
                    className="qty_plus"
                    onClick={this.compoQtyAction.bind(this, "incr")}
                  >
                    <img src={plusi} alt="plus" />
                  </span>
                </div>
              </div>

              <div className="prd_chosen_sub_item_right cart_update_div compo_update_div">
                <button
                  onClick={this.addToCartCombo.bind(this, proDetailArr, "done")}
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div> */}
        </div>
      );
    } else {
      return "";
    }
  }

  singleComboDet(compoProDetailArr) {
    console.log('fdsfdsfsdafsdf')
    if (Object.keys(compoProDetailArr).length > 0) {
      const html = compoProDetailArr.map((item, index1) =>  {
        const apply_price_ = item?.apply_price ?? false;
        const apply_price = apply_price_ === true ? 1 : 0;
       return(<div
          className={
            "product_chosen_item_left product_chosen_item_left_full compo_list_div main_combo_div compo_acc_active maincombo-" +
            index1
          }
          data-maincomboidtxt={index1}
          data-combodata={index1 + "~" + item.combo_name + "~0"}
          data-combopriceapply={apply_price}
          key={"compo" + index1}
        >
          <div className="product_chosen_addons compo_pro_acc compo_acc_action">
            <div className="product_chosen_hea compopro_acc_head">
              <h6>{stripslashes(item.combo_name)}</h6>
            </div>
          </div>

          <div className="compo_acc_innerdiv">
            <div className="form-group custom-select-bxcls">
              {this.showSingleComboOptions(item, index1)}
            </div>

            <div
              className="mdfr_list_divlcs"
              data-mismatchpro=""
              data-invcomboprice=""
            >
              <div
                className="mdfr_list_divlcs_error"
                style={{ display: "none", color: "red" }}
              >
                Please choose valid modifiers
              </div>
              {this.showSingleComboMdfr(item)}
            </div>
          </div>
        </div>)
      }
      );

      return (
        <div className="product_chosen_col_inner compo_inner_main">{html}</div>
      );
    } else {
      return "";
    }
  }

  /* show single combo product option */
  showSingleComboOptions(splProducts, menuCmpId) {
    var compoListArr =
      splProducts.products !== null && splProducts.products !== ""
        ? splProducts.products
        : [];
    var menuComponentApplyPrice_ = splProducts?.apply_price ?? false;
    var menuComponentApplyPrice = menuComponentApplyPrice_ === true ? 1 : 0;;
    console.log(compoListArr, "compoListArrcompoListArrcompoListArr");
    if (compoListArr.length > 0) {
      var defaultSelectVl = splProducts.menu_component_default_select;
      var compSelectBoxHtml = "";
      var mdfMainComboProId = "";
      var ismdfrProCount = 0;
      var comboPropriceAply = "";
      var comboProPrice = 0;
      var indvlComponentNm = "";
      var showPricetxt = "";
      var compomainselval = "";

      var statMdfVal = this.state["compo~~" + menuCmpId];
      var mdfSelectVl =
        statMdfVal !== undefined && statMdfVal !== ""
          ? statMdfVal
          : defaultSelectVl;

      compSelectBoxHtml = compoListArr.map((item1, index2) => {
        const productAliasName = item1?.productAliasName ?? "";
        let productName = item1?.productName ?? "";
        if (productAliasName !== "" && productAliasName !== null) {
          productName = productAliasName;
        }

        mdfMainComboProId = item1._id;

        comboProPrice = item1.productPrice;
        comboPropriceAply =
          parseFloat(comboProPrice) > 0 &&
          parseInt(menuComponentApplyPrice) === 1 &&
          parseInt(ismdfrProCount) === 0
            ? comboProPrice
            : 0;
        indvlComponentNm = productName;
        console.log(comboPropriceAply, 'comboPropriceAplycomboPropriceAply')
        showPricetxt =
          parseFloat(comboPropriceAply) > 0
            ? " ( + " +
              currency +
              parseFloat(comboPropriceAply)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
              " )"
            : "";

        compomainselval =
          item1._id +
          "~" +
          indvlComponentNm +
          "~" +
          item1.productSKU +
          "~" +
          comboProPrice;

        return (
          <div className="custm-chkbox" key={"cmbrido-" + index2}>
            <input
              type="checkbox"
              name={"combointprochk_" + menuCmpId}
              value={item1._id}
              className="addon_list_single combointprochk_cls showSingleComboOptions subscribe_accept"
              data-compomainselval={compomainselval}
              data-mdfcombopro={mdfMainComboProId}
              data-combopropriceaply={comboPropriceAply}
              data-ismdfrprochk={ismdfrProCount}
              checked={this.CheckDefltComboPro(item1._id, mdfSelectVl)}
              onClick={this.handleChangeCompoMain.bind(this, menuCmpId)}
            />
            <div className="comn_cnm_prd">
              {" "}
              <span>{indvlComponentNm}</span>
              <span className="combo_pro_price">{showPricetxt}</span>
            </div>{" "}
          </div>
        );
      });

      return (
        <div
          className="components_selct components_selctbox_cls"
          id={"cmpp" + menuCmpId}
        >
          {compSelectBoxHtml}
        </div>
      );
    } else {
      return "";
    }
  }

  CheckDefltComboPro(proId, dfltPro) {
    var chkRadioBtn = proId === dfltPro ? true : false;
    return chkRadioBtn;
  }

  showSingleComboMdfr(splProducts) {
    var compoListArr =
      splProducts.products !== null && splProducts.products !== ""
        ? splProducts.products
        : [];
    if (compoListArr.length > 0) {
      const html = compoListArr.map((item1, index2) => (
        <div className="mdfr_list_divlcs_inv" key={"cmdf-" + index2}>
          {/* item1[0].modifiers !== null &&
            item1[0].modifiers !== "" &&
            this.singleComboMdfrOption(
              menuCmpId,
              item1[0]._id,
              item1[0].modifiers
            ) */}
        </div>
      ));

      return html;
    } else {
      return "";
    }
  }

  singleComboMdfrOption(menuCmpIdTxt, productIdTxt, cmpProMdfr) {
    if (Object.keys(cmpProMdfr).length > 0) {
      const html = cmpProMdfr.map((item2, index3) => (
        <div
          className={
            "compoMdfr_item_left individual_combo_mdf compo_mdf_" + productIdTxt
          }
          key={"cmd-" + index3}
        >
          <div className="product_chosen_addons">
            <div className="product_chosen_hea">
              <h6>{stripslashes(item2.pro_modifier_name)}</h6>
            </div>
          </div>

          <div className="form-group custom-select-bxcls">
            <div className={"re_select re_select_cmd" + index3}>
              {this.singleComboMdfrValuesOpn(menuCmpIdTxt, item2)}
            </div>
          </div>
        </div>
      ));

      return html;
    } else {
      return "";
    }
  }

  singleComboMdfrValuesOpn(menuCmpIdTxt, mdfMainArr) {
    var mdfrValueArr =
      mdfMainArr.modifiers_values !== null && mdfMainArr.modifiers_values !== ""
        ? mdfMainArr.modifiers_values
        : [];
    if (mdfrValueArr.length > 0) {
      var mainMdfId = mdfMainArr.pro_modifier_id;
      var mainMdfNm = stripslashes(mdfMainArr.pro_modifier_name);
      var mdfrSelectBoxHtml = "";
      var defaultMdfVal = "";
      $.each(mdfrValueArr, function (index4, item3) {
        var datamdfVl =
          mainMdfId +
          "~" +
          mainMdfNm +
          "~" +
          item3.pro_modifier_value_id +
          "~" +
          stripslashes(item3.pro_modifier_value_name) +
          "~" +
          item3.pro_modifier_value_price;

        var incPrc =
          parseFloat(item3.pro_modifier_value_price) > 0
            ? " (+ " + currency + item3.pro_modifier_value_price + " )"
            : "";

        mdfrSelectBoxHtml +=
          "<option value='" +
          item3.pro_modifier_value_id +
          "' data-selectmdfval='" +
          datamdfVl +
          "' data-mdfrpricevaluetxt='" +
          item3.pro_modifier_value_price +
          "' >" +
          item3.pro_modifier_value_name +
          incPrc +
          "</option>";
        if (item3.pro_modifier_value_is_default === "Yes") {
          defaultMdfVal = item3.pro_modifier_value_id;
        }
      });
      var mdfrSelectDropDown = Parser(mdfrSelectBoxHtml);
      var statMdfVal =
        this.state["compoInner~~" + menuCmpIdTxt + "~~" + mainMdfId];
      var mdfSelectVl =
        statMdfVal !== undefined && statMdfVal !== ""
          ? statMdfVal
          : defaultMdfVal;

      return (
        <select
          name="compoinner_select"
          value={mdfSelectVl}
          className="components_mdf_selct"
          onChange={this.handleChangeCompoInner.bind(
            this,
            menuCmpIdTxt,
            mainMdfId
          )}
          id={"modifvl" + mainMdfId}
        >
          {mdfrSelectDropDown}
        </select>
      );
    } else {
      return "";
    }
  }

  multipleComboDet(compoProDetailArr) {
    console.log('aaaaaaaaaaaaa')
    if (Object.keys(compoProDetailArr).length > 0) {
      const html = compoProDetailArr.map((item, index1) => {
        const apply_modifier_ = item?.apply_modifier ?? false;
        const apply_modifier = apply_modifier_ === true ? 1 : 0;

        const apply_price_ = item?.apply_price ?? false;
        const apply_price = apply_price_ === true ? 1 : 0;

        console.log(
          item?.apply_modifier,
          apply_modifier,
          "apply_modifierapply_modifier"
        );
        return (
          <div
            className={
              "product_chosen_item_left product_chosen_item_left_full compo_list_div main_combo_div minmax_maincombo_div compo_acc_active maincombo-" +
              index1
            }
            data-maincomboidtxt={index1}
            data-combodata={index1 + "~" + item.combo_name + "~1"}
            data-combopriceapply={apply_price}
            data-indexcb={index1}
            data-minselectcombo={item.min_select}
            data-maxselectcombo={item.max_select}
            data-modifierapply={apply_modifier}
            key={"compo" + index1}
          >
            <div className="product_chosen_addons compo_pro_acc compo_acc_action">
              <div className="product_chosen_hea compopro_acc_head">
                <h6>{stripslashes(item.combo_name)}</h6>
                {apply_modifier !== 1 && (
                  <div className="max-min-bar">
                    You've chosen <span className="minSelectCls">0</span> (Min.{" "}
                    {item.min_select} & Max. {item.max_select}){" "}
                  </div>
                )}
              </div>
            </div>

            <div className="compo_acc_innerdiv">
              {apply_modifier === 1 ? (
                <div className="compo_mdfselect_maindiv">
                  <div className="error_combo_div">
                    {" "}
                    Please select the min number of items.{" "}
                  </div>
                  <div className="form-group custom-radio-btncls">
                    {this.showSingleComboOptions(item, index1)}
                  </div>
                  <div
                    className="mdfr_list_divlcs"
                    data-mismatchpro=""
                    data-invcomboprice=""
                  >
                    <div
                      className="mdfr_list_divlcs_error"
                      style={{ display: "none", color: "red" }}
                    >
                      Please choose valid modifiers
                    </div>
                    {this.showSingleComboMdfr(item)}
                  </div>
                </div>
              ) : (
                <div className="compo_minmax_maindiv">
                  <div className="error_combo_div">
                    {" "}
                    Please select the min number of items.{" "}
                  </div>
                  {this.showMultipleComboOptions(item, index1)}
                </div>
              )}
            </div>
          </div>
        );
      });

      return (
        <div className="product_chosen_col_inner compo_inner_main">{html}</div>
      );
    } else {
      return "";
    }
  }

  showComboMultiSelect(mutilSlct) {
    return mutilSlct === true ? "none" : "";
  }

  /* show multiple combo product option */
  showMultipleComboOptions(splProducts, index_) {
    var multiSelectApply = splProducts?.multipleselection_apply ?? false;
    var compoListArr =
      splProducts.products !== null && splProducts.products !== ""
        ? splProducts.products
        : [];
    if (compoListArr.length > 0) {
      var menuCmpId = index_;

      const compoMtplHtml = compoListArr.map((item1, index1) => {
        const productAliasName = item1?.productAliasName ?? "";
        let productName = item1?.productName ?? "";
        if (productAliasName !== "" && productAliasName !== null) {
          productName = productAliasName;
        }
        return (
          <div
            className={
              "mainproduct-info-grid  chosen_adn mdfr_list_divlcs individual_combo_pro components_selct indvcombo-" +
              menuCmpId +
              "-" +
              item1._id
            }
            data-mismatchpro=""
            data-invcomboprice="0"
            data-comboprice={item1.productPrice}
            data-productdata={this.getCmpProData(item1)}
            key={index1}
          >
            <div className="product-info-grid-left">
              <span>{productName}</span>{" "}
              <span className="combo_pro_price" style={{ display: "none" }}>
                {parseFloat(item1.productPrice) > 0 ? (
                  <>+{showPrice(item1.productPrice)}</>
                ) : (
                  ""
                )}
              </span>
            </div>
            <div className="product-info-grid-right">
              <div
                className="combo-inc-parent"
                style={{ display: this.showComboMultiSelect(multiSelectApply) }}
              >
                <div className="qty_bx">
                  <span
                    className="qty_minus combo_inc"
                    onClick={this.decComboQty.bind(this, menuCmpId, item1._id)}
                  >
                    <img src={minusi} alt="minus" />
                  </span>

                  <label
                    type="text"
                    disabled
                    data-qtyval="0"
                    className="combo-input-label combo-input combolst_qty_value"
                  >
                    0
                  </label>

                  <span
                    className="qty_plus combo_dec"
                    onClick={this.incComboQty.bind(this, menuCmpId, item1._id)}
                  >
                    <img src={plusi} alt="plus" />
                  </span>
                </div>
              </div>

              {multiSelectApply === true && (
                <div className="checkboxcls">
                  <input
                    className="css-checkboxcls"
                    type="checkbox"
                    onChange={this.comboMultiSelectUpdate.bind(
                      this,
                      menuCmpId,
                      item1._id
                    )}
                    value={item1.productPrice}
                    name={"comboMultiStVal_" + menuCmpId}
                    
                    id={"comboMultiStVal_" + menuCmpId + "_" + item1._id}
                  />{" "}
                  <label
                    htmlFor={"comboMultiStVal_" + menuCmpId + "_" + item1._id}
                    className="css-label-chkbox"
                  ></label>
                </div>
              )}
            </div>
          </div>
        );
      });

      return <div>{compoMtplHtml}</div>;
    } else {
      return "";
    }
  }

  getCmpProData(proData) {
    const productAliasName = proData?.productAliasName ?? "";
    let productName = proData?.productName ?? "";
    if (productAliasName !== "" && productAliasName !== null) {
      productName = productAliasName;
    }
    var proName = productName;
    var pro_datetxt =
      proData._id +
      "~" +
      proName +
      "~" +
      proData.productSKU +
      "~" +
      proData.productPrice;
    return pro_datetxt;
  }

  comboMultiSelectUpdate(menuCmpId, productPryId) {
    if (
      $("#comboMultiStVal_" + menuCmpId + "_" + productPryId).prop(
        "checked"
      ) === true
    ) {
      this.incComboQty(menuCmpId, productPryId, "checkboxact");
    } else {
      this.decComboQty(menuCmpId, productPryId);
    }
  }

  incComboQty(menuCmpId, proId, actionFrm) {
    var $_this = $(".indvcombo-" + menuCmpId + "-" + proId);
    var intValInc = $_this.find(".combolst_qty_value").attr("data-qtyval");
    intValInc = intValInc !== "" ? parseInt(intValInc) : 0;
    var minselectcombo =
      $_this.closest(".main_combo_div").attr("data-minselectcombo") !== ""
        ? $_this.closest(".main_combo_div").attr("data-minselectcombo")
        : "0";
    var maxselectcombo =
      $_this.closest(".main_combo_div").attr("data-maxselectcombo") !== ""
        ? $_this.closest(".main_combo_div").attr("data-maxselectcombo")
        : "0";
    var combopriceapply =
      $_this.closest(".main_combo_div").attr("data-combopriceapply") !== ""
        ? $_this.closest(".main_combo_div").attr("data-combopriceapply")
        : "0";
        console.log(combopriceapply, 'combopriceapplycombopriceapplycombopriceapply')
    var invCompoQty = this.getInvCompoQty($_this);

    if (
      actionFrm === "checkboxact" &&
      parseInt(invCompoQty) >= parseInt(maxselectcombo)
    ) {
      $("#comboMultiStVal_" + menuCmpId + "_" + proId).prop("checked", false);
      return false;
    }

    var chk_val = 0;
    if (!isNaN(intValInc) && parseInt(invCompoQty) < parseInt(maxselectcombo)) {
      intValInc = parseInt(intValInc + 1);
      chk_val = 1;
    }


    $_this.find(".combolst_qty_value").attr("data-qtyval", intValInc);
    $_this.find(".combolst_qty_value").html(intValInc);

    var comboProPrice = $_this.attr("data-invcomboprice");
    invCompoQty = this.getInvCompoQty($_this);
    if (
      (invCompoQty > parseInt(minselectcombo) ||
        parseInt(combopriceapply) === 1) &&
      chk_val === 1
    ) {
      $_this.find(".combo_pro_price").show();
      var invComboproPrice = $_this.attr("data-invcomboprice");
      var comboprice = $_this.attr("data-comboprice");
      comboProPrice = parseFloat(invComboproPrice) + parseFloat(comboprice);
    }

    if (parseInt(minselectcombo) === 0 || parseInt(combopriceapply) === 1) {
      $_this.find(".combo_pro_price").show();
    }
    $_this.attr("data-invcomboprice", comboProPrice);

    this.updateProductPricefun();
  }

  decComboQty(menuCmpId, proId) {
    var $_this = $(".indvcombo-" + menuCmpId + "-" + proId);
    var intValInc = $_this.find(".combolst_qty_value").attr("data-qtyval");
    intValInc = intValInc !== "" ? parseInt(intValInc) : 0;
    var minselectcombo =
      $_this.closest(".main_combo_div").attr("data-minselectcombo") !== ""
        ? $_this.closest(".main_combo_div").attr("data-minselectcombo")
        : "0";
    var combopriceapply =
      $_this.closest(".main_combo_div").attr("data-combopriceapply") !== ""
        ? $_this.closest(".main_combo_div").attr("data-combopriceapply")
        : "0";

    var minusChkVal = 0;
    if (!isNaN(intValInc) && parseInt(intValInc) >= 1) {
      intValInc = parseInt(intValInc - 1);
      minusChkVal = 1;
    }

    $_this.find(".combolst_qty_value").attr("data-qtyval", intValInc);
    $_this.find(".combolst_qty_value").html(intValInc);
    var invCompoQty = this.getInvCompoQty($_this);
    var comboProPrice = $_this.attr("data-invcomboprice");
    var defComboprice = $_this.attr("data-comboprice");
    console.log(invCompoQty,minselectcombo, minusChkVal,combopriceapply,  minusChkVal, 'minusChkValminusChkValminusChkVal')
    if (
      (invCompoQty >= parseInt(minselectcombo) && minusChkVal === 1) ||
      (parseInt(combopriceapply) === 1 && minusChkVal === 1)
    ) {
      if (
        parseInt(combopriceapply) === 1 &&
        minusChkVal === 1 &&
        parseFloat(defComboprice) === 0 &&
        parseFloat(comboProPrice) === 0
      ) {
        console.log('bbbbbbbbbbbbbbbbbbb')
        var temp_price = 0;
        $_this.attr("data-invcomboprice", temp_price);
        $_this.find(".combo_pro_price").hide();
      } else if (
        parseFloat(comboProPrice) >= parseFloat(defComboprice) &&
        parseFloat(comboProPrice) > 0
      ) {
        var temp_priceN = parseFloat(comboProPrice) - parseFloat(defComboprice);
        $_this.attr("data-invcomboprice", temp_priceN);
        if (parseFloat(temp_priceN) === 0) {
          console.log('cccccccccccccccccccccccccc')
          $_this.find(".combo_pro_price").hide();
        }
      } else {
        var rtn_val = 0;
        $_this
          .closest(".main_combo_div")
          .find(".individual_combo_pro")
          .each(function () {
            var thisInvPrc = $(this).attr("data-invcomboprice");
            console.log(thisInvPrc, rtn_val, 'rtn_valrtn_valrtn_val')
            if (parseFloat(thisInvPrc) > 0 && rtn_val === 0) {
              rtn_val = 1;
              var comboproprice = thisInvPrc;
              var def_combo_price = $(this).attr("data-comboprice");
              var tempPrice =
                parseFloat(comboproprice) - parseFloat(def_combo_price);
              $(this).attr("data-invcomboprice", tempPrice);
              if (parseFloat(tempPrice) === 0) {
                console.log('dddddddddddddddddddddd')
                $(this).find(".combo_pro_price").hide();
              }
            }
          });
      }
    }

    if (parseInt(minselectcombo) === 0 || parseInt(combopriceapply) === 1) {
      $_this.find(".combo_pro_price").show();
    }

    this.updateProductPricefun();
  }

  getInvCompoQty($_this) {
    $_this.closest(".main_combo_div").find(".error_combo_div").hide();
    var combolst_qty = 0;
    $_this
      .closest(".main_combo_div")
      .find(".combolst_qty_value")
      .each(function () {
        combolst_qty += parseInt($(this).attr("data-qtyval"));
      });
    return combolst_qty;
  }

  updateRemarksCompo(event) {
    this.setState({ compoApi_call: "No", product_remarks: event.target.value });
    var special_message_character_limit =
      this.state.special_message_character_limit;
    this.setState({
      remaining: special_message_character_limit - event.target.value.length,
    });
  }

  updateProductPricefun() {
    var minmaxMainCnt = $(".compo_minmax_maindiv").length;
    if (minmaxMainCnt > 0) {
      $(".compo_minmax_maindiv").each(function (indx) {
        var invQtyCnt = 0;
        $(this)
          .find(".individual_combo_pro")
          .each(function (indx2) {
            var qtyval = $(this)
              .find(".combolst_qty_value")
              .attr("data-qtyval");
            invQtyCnt = parseInt(invQtyCnt) + parseInt(qtyval);
          });
        if (
          $(this).parents(".main_combo_div").find(".minSelectCls").length > 0
        ) {
          $(this)
            .parents(".main_combo_div")
            .find(".minSelectCls")
            .html(invQtyCnt);
        }
      });
    }

    var combo_pro_price = 0;
    $(".mdfr_list_divlcs").each(function () {
      var invcomboPriceVl = $(this).attr("data-invcomboprice");
      invcomboPriceVl = invcomboPriceVl !== "" ? invcomboPriceVl : 0;
      combo_pro_price += parseFloat(invcomboPriceVl);
    });

    var qty_txt =
      $(".compo_proqty_input").val() !== ""
        ? parseInt($(".compo_proqty_input").val())
        : 0;
    var pro_price_val =
      $("#product_unitprice").val() !== ""
        ? parseFloat($("#product_unitprice").val())
        : 0;

    var exc_price = parseFloat(pro_price_val) + parseFloat(combo_pro_price);
    exc_price = parseInt(qty_txt) * parseFloat(exc_price);
    $("#incr_compo_price").val(exc_price);
    $("#id_price_final").html(
      `$${parseFloat(exc_price).toFixed('2')}` /* 
      Parser(
        parseFloat(exc_price)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      ) */
    );
  }

  compoQtyAction(actionFlg) {
    var proqtyInput = $(".compo_proqty_input").val();
    proqtyInput = parseInt(proqtyInput);
    if (actionFlg === "decr") {
      proqtyInput = proqtyInput > 1 ? proqtyInput - 1 : proqtyInput;
    } else {
      proqtyInput = proqtyInput + 1;
    }
    this.setState(
      { compoApi_call: "No", compoinput_value: proqtyInput },
      function () {
        this.props.updateStateValue("compoinput_value", proqtyInput);
        this.updateProductPricefun();
      }
    );
  }

  handleChangeCompoMain(compoVl, event) {
    this.setState({
      compoApi_call: "Yes",
      ["compo~~" + compoVl]: event.target.value,
    });
    $(event.target)
      .parents(".compo_mdfselect_maindiv")
      .find(".error_combo_div")
      .hide();
  }

  handleChangeCompoInner(menuCmpIdTxt, compoVl, event) {
    this.setState({
      compoApi_call: "Yes",
      ["compoInner~~" + menuCmpIdTxt + "~~" + compoVl]: event.target.value,
    });
  }

  getComboproData($_this, CompoType) {
    var comboproSet = [],
      aplypriceZero = 0;
    console.log(CompoType, 'CompoTypeCompoType')
    if (CompoType === 1) {
      $_this.find(".individual_combo_pro").each(function () {
        var componentsProDet = $(this).attr("data-productdata");
        var compoProDet = componentsProDet.split("~");
        var combolstQtyValue = $(this)
          .find(".combolst_qty_value")
          .attr("data-qtyval");
        var comboProInvPrice = $(this).attr("data-invcomboprice");
        if (parseInt(combolstQtyValue) > 0) {
          comboproSet.push({
            _id: compoProDet[0],
            productName: compoProDet[1],
            productSKU: compoProDet[2],
            productPrice: comboProInvPrice,
            productQuantity: combolstQtyValue,
          });
        }
      });
    } else {
    
      $_this.find(".components_selct").each(function () {
        var mdfcombopro_id = $(this).find(":checked").attr("data-mdfcombopro");
        var combopriceapplychk = $(this)
          .closest(".main_combo_div")
          .attr("data-combopriceapply");
        var aplyprice_temp = $(this)
          .find(":checked")
          .attr("data-combopropriceaply");
        console.log(mdfcombopro_id, 'mdfcombopro_idmdfcombopro_id')
          
        aplyprice_temp = aplyprice_temp !== undefined ? aplyprice_temp : 0;
        var comboMdfSet = [];
        console.log( $(this)
        .closest(".main_combo_div")
        .find(".compo_mdf_" + mdfcombopro_id).length,'dsadads')
        $(this)
          .closest(".main_combo_div")
          .find(".compo_mdf_" + mdfcombopro_id)
          .each(function () {
            
            var combopro_mdf_txt = $(this).find(".components_mdf_selct").val();
           
            var comboMdfValueSet = [];
            if (combopro_mdf_txt !== "") {
              var modifierCombosets_txt = $(this)
                .find(".components_mdf_selct")
                .find("option:selected")
                .attr("data-selectmdfval");
              var mdfSetDet =
                modifierCombosets_txt !== "" &&
                modifierCombosets_txt !== undefined
                  ? modifierCombosets_txt.split("~")
                  : [];

              if (Object.keys(mdfSetDet).length > 0) {
                comboMdfValueSet.push({
                  modifier_value_name: mdfSetDet[3],
                  modifier_value_id: mdfSetDet[2],
                  modifier_value_price: mdfSetDet[4],
                  modifier_value_qty: 1,
                });
                comboMdfSet.push({
                  modifier_name: mdfSetDet[1],
                  modifier_id: mdfSetDet[0],
                  modifiers_values: comboMdfValueSet,
                });
              }
            }
          });

        var componentsProDet = $(this)
          .find(":checked")
          .attr("data-compomainselval");
        var compoProDet =
          componentsProDet !== undefined ? componentsProDet.split("~") : [];
        if (Object.keys(compoProDet).length > 0) {
          var combolstQtyValue = 1;
          var comboProInvPrice =
            parseFloat(combopriceapplychk) > 0
              ? parseFloat(aplyprice_temp)
              : parseFloat(aplypriceZero);
          if (parseInt(combolstQtyValue) > 0) {
            comboproSet.push({
              _id: compoProDet[0],
              productName: compoProDet[1],
              productSKU: compoProDet[2],
              productPrice: comboProInvPrice,
              productQuantity: combolstQtyValue,
            });
          }
        }
      });
    }

    return comboproSet;
  }

  checkMinValfun($_this) {
    var combo_qtycount = 0,
      min_val_error = 0;
    var min_selectcombo =
      $_this.attr("data-minselectcombo") !== ""
        ? $_this.attr("data-minselectcombo")
        : "0";
    $_this.find(".combolst_qty_value").each(function () {
      var qtyval = $(this).attr("data-qtyval");
      combo_qtycount += parseInt(qtyval);
    });
    if (parseInt(min_selectcombo) > parseInt(combo_qtycount)) {
      min_val_error = 1;
    }
    return min_val_error;
  }

  addToCartCombo(compoProdDetail, actionFlg) {
    if(compoProdDetail.outOfStock==="Yes") {
      toast.error('This Product Sold Out');
    }else {
      this.setState({ openFilterSheet: true });
      var InvalidMdfrCompo = "No";
      $(".main_combo_div").each(function () {
        if ($(this).find(".mdfr_list_divlcs").attr("data-mismatchpro") === "1") {
          InvalidMdfrCompo = "Yes";
        }
      });

      if (InvalidMdfrCompo === "No") {
        if (actionFlg === "initial") {
          $(".compo_add_div").hide();
          $(".compo_update_div").show();
          return false;
        } else {
          var $_react_this = this;
          var menuSet = [];
          var productDetailsMain = [];
          var CompoType = $("#set_menu_component_type").val();
          CompoType = parseInt(CompoType);
          var compo_errors = "0";
          //var indexCb = 0;
          if (CompoType === 1) {
            $(".main_combo_div").each(function () {
              var modifierapply = $(this).attr("data-modifierapply");
            
              if (modifierapply === "1") {
              
                var check_min_val = $_react_this.checkMinValfunForApplyMdf(
                  $(this)
                );
                console.log(modifierapply, 'modifierapplymodifierapplymodifierapply')
                if (check_min_val === 0) {
                  var combodata_txt = $(this).attr("data-combodata");
                  var menu_component = combodata_txt.split("~");

                  var productDetails = $_react_this.getComboproData($(this), 0);
                  productDetailsMain.push({
                    comboName: menu_component[1],
                    products: productDetails,
                    /*  min_max_flag: menu_component[2], */
                  });
                } else {
                  compo_errors = "1";
                  $(this)
                    .find(".compo_mdfselect_maindiv:first")
                    .find(".error_combo_div:first")
                    .show()
                    .addClass("active-error");

                  $(".inn-product-details").animate(
                    {
                      scrollTop:
                        $(".inn-product-details")
                          .find(".error_combo_div:visible:first")
                          .offset().top -
                        $(".inn-product-details").offset().top -
                        190,
                    },
                    1000
                  );

                  $(".new-alert-info").show();
                  //indexCb = $(this).attr("data-indexcb");

                  $(this)
                    .closest(".common_compo_div")
                    .find(".main_combo_div")
                    .not($(this))
                    .removeClass("compo_acc_active");
                  $(this)
                    .closest(".common_compo_div")
                    .find(".main_combo_div")
                    .find(".compo_acc_innerdiv")
                    .not($(this).find(".compo_acc_innerdiv"))
                    .hide();
                  $(this).addClass("compo_acc_active");
                  $(this).find(".compo_acc_innerdiv").show();

                  return false;
                }
              } else {
                var check_min_valN = $_react_this.checkMinValfun($(this));
                if (check_min_valN === 0) {
                  var combodata_txtN = $(this).attr("data-combodata");
                  menu_component = combodata_txtN.split("~");
                  var productDetailsN = $_react_this.getComboproData(
                    $(this),
                    CompoType
                  );
                  productDetailsMain.push({
                    comboName: menu_component[1],
                    products: productDetailsN,
                  });
                } else {
                  compo_errors = "1";
                  $(this).find(".error_combo_div").show();
                  $(".inn-product-details").animate(
                    {
                      scrollTop:
                        $(".inn-product-details")
                          .find(".error_combo_div:visible:first")
                          .offset().top -
                        $(".inn-product-details").offset().top -
                        190,
                    },
                    1000
                  );
                  return false;
                }
              }
            });
            if (compo_errors === 1) {
              return false;
            }
          } else {
            $(".main_combo_div").each(function () {
              var combodata_txt = $(this).attr("data-combodata");
              var menu_component = combodata_txt.split("~");
              var productDetailsN1 = $_react_this.getComboproData(
                $(this),
                CompoType
              );
              productDetailsMain.push({
                comboName: menu_component[1],
                products: productDetailsN1,
              });
            });
          }
          menuSet = productDetailsMain;
        
          if (compo_errors === "0" && Object.keys(menuSet).length > 0) {
            showLoader("compo_addcart_cls_parant", "class");
            var productId = compoProdDetail._id;
            var productRemarks = this.state.product_remarks;
            var prodcutQty = this.state.compoinput_value;
            var incrCompoPrice = $("#incr_compo_price").val();
            var totalCompoPrice =
              incrCompoPrice !== "" ? parseFloat(incrCompoPrice) : 0;
            var unitProductPrice =
              parseFloat(totalCompoPrice) / parseFloat(prodcutQty);
            unitProductPrice = unitProductPrice.toFixed(2);

            if (
              parseFloat(totalCompoPrice) > 0 &&
              parseFloat(unitProductPrice) > 0
            ) {

              const customerID = localStorage.getItem('customerID') ?? '';
              const referenceID = (customerID==="") ? getReferenceID() : '';

              const postObject = {
                uniqueID: uniqueID,
                customerID: customerID,
                referenceID: referenceID,
                outletID: this.state.orderOutletId,
                zoneID: "",
                availabilityID: this.state.seletedAvilablityId,
                productID: productId,
                itemProductType: 2,
                itemQuantity: prodcutQty,
                itemComboSet: JSON.stringify(menuSet),
                itemPrice: parseFloat(unitProductPrice).toFixed('2'),
                itemTotalPrice: parseFloat(totalCompoPrice).toFixed('2'),
                itemNote: productRemarks,
              };
              Axios.post(apiUrl + "cart", postObject)
                .then((res) => {
                  this.props.updateStateValue("trigerCart", true);
                  this.props.updateStateValue("openFilterSheet", false);
                  hideLoader("compo_addcart_cls_parant", "class");
                  if (res.data.status === "ok") {
                    this.props.updateStateValue("trigerCart", true);
                    this.props.updateStateValue("openPopup", false);
                    toast.success(res.data.message);
                  }
                })
                .catch((e) => {
                  const errorMsg = e?.response?.data?.message || e.message;
                  toast.error(errorMsg);
                  hideLoader("compo_addcart_cls_parant", "class");
                });
            } else {
              hideLoader("compo_addcart_cls_parant", "class");
              $(".compocart_error_msg").html(
                "Sorry!. Product price was not valid."
              );
              $(".compocart_error_msg").show();
              $(".compocart_error_msg").delay(6000).fadeOut();
              return false;
            }
          } else {
            $(".compocart_error_msg").html(
              "Sorry!. Product Detail was not valid."
            );
            $(".compocart_error_msg").show();
            $(".compocart_error_msg").delay(6000).fadeOut();
            return false;
          }
        }
      } else {
        $(".compocart_error_msg").html("Sorry!. Invalid product combination.");
        $(".compocart_error_msg").show();
        $(".compocart_error_msg").delay(6000).fadeOut();
        return false;
      }
    }
  }

  checkMinValfunForApplyMdfInnr($_this) {
    var combo_qtycount = 0,
      min_val_error = 0;
    var min_selectcombo =
      $_this.attr("data-minselectcombo") !== ""
        ? $_this.attr("data-minselectcombo")
        : "0";
    $_this.find(".showSingleComboOptionsInnerChkBx").each(function () {
      if ($(this).prop("checked")) {
        combo_qtycount = 1;
      }
    });
    if (parseInt(min_selectcombo) > 0 && parseInt(combo_qtycount) === 0) {
      min_val_error = 1;
    }
    return min_val_error;
  }

  checkMinValfunForApplyMdf($_this) {
    var combo_qtycount = 0,
      min_val_error = 0;
    var $_react_this = this;
    var min_selectcombo =
      $_this.attr("data-minselectcombo") !== ""
        ? $_this.attr("data-minselectcombo")
        : "0";
    $_this.find(".showSingleComboOptions").each(function () {
      if ($(this).prop("checked")) {
        if ($(this).attr("data-iscomborprochk") === "yes") {
          var dataRand = $(this).attr("data-rand");
          if (
            $(this)
              .closest("." + dataRand)
              .find(".main_combo_div").length > 0
          ) {
            $(this)
              .closest("." + dataRand)
              .find(".main_combo_div")
              .each(function () {
                if ($(this).attr("data-isinnercombo") === "yes") {
                  var modifierapply = $(this).attr("data-modifierapply");
                  var check_min_val =
                    modifierapply === "1"
                      ? $_react_this.checkMinValfunForApplyMdfInnr($(this))
                      : $_react_this.checkMinValfun($(this));
                  if (check_min_val === 0) {
                    combo_qtycount = 1;
                  } else {
                    min_val_error = 1;
                    combo_qtycount = 0;
                    var prntCls =
                      modifierapply === "1"
                        ? "compo_mdfselect_maindiv"
                        : "compo_minmax_maindiv";
                    $(this)
                      .find("." + prntCls)
                      .find(".error_combo_div")
                      .show()
                      .addClass("active-error");
                    $(".inn-product-details").animate(
                      {
                        scrollTop:
                          $(".inn-product-details")
                            .find(".error_combo_div:visible:first")
                            .offset().top -
                          $(".inn-product-details").offset().top -
                          190,
                      },
                      1000
                    );
                    $(".new-alert-info").show();
                    $(this)
                      .closest(".common_compo_div")
                      .find(".main_combo_div")
                      .not($(this))
                      .removeClass("compo_acc_active");
                    $(this)
                      .closest(".common_compo_div")
                      .find(".main_combo_div")
                      .find(".compo_acc_innerdiv")
                      .not($(this).find(".compo_acc_innerdiv"))
                      .hide();
                    $(this).addClass("compo_acc_active");
                    $(this).find(".compo_acc_innerdiv").show();
                    return false;
                  }
                }
              });
          }
        } else {
          combo_qtycount = 1;
        }
      }
    });
    if (parseInt(min_selectcombo) > 0 && parseInt(combo_qtycount) === 0) {
      min_val_error = 1;
    }
    return min_val_error;
  }

  checkProductPrice() {
    var allModVal = "";
    var errorChk = 0;
    var productID = $("#modProductId").val();
    var inc_lp = 1;
    var TotalCnt = $(".modifierList").length;

    $(".modfir_addcart_cls").show();
    showLoader("modfir_addcart_cls", "class");

    $(".modifierList").each(function () {
      var modVal = $(this).val();
      var modSelectVal = $(this).find("option:selected").attr("data-mdfvl");
      if (modVal !== "" && modSelectVal !== "") {
        var modifier_sets = modSelectVal.split("~");
        allModVal +=
          inc_lp === TotalCnt ? modifier_sets[3] : modifier_sets[3] + ";";
      } else if (modSelectVal === "" || modVal === "") {
        errorChk = 1;
      }
      inc_lp++;
    });

    if (errorChk === 0 && allModVal !== "") {
      Axios.get(
        apiUrl +
          "products/validate_product?app_id=" +
          uniqueID +
          "&product_id=" +
          productID +
          "&modifier_value_id=" +
          allModVal
      ).then((res) => {
        var response = res.data;
        hideLoader("modfir_addcart_cls", "class");
        if (response.status === "ok") {
          var proQty = $(".modfir_proqty_input").val();
          var productPrice = response.result_set[0].productPrice;
          var productTotalPrice =
            parseFloat(response.result_set[0].productPrice) *
            parseFloat(proQty);
          productTotalPrice = parseFloat(productTotalPrice).toFixed(2);
          /*$("#modParentProductId").val(response.result_set[0].alias_product_primary_id);
          $("#modProductPrice").val(productPrice);
          $("#modProductTotalPrice").val(productTotalPrice);
          $('#id_price_final').html(productTotalPrice);*/
          this.setState({
            mdfApi_call: "No",
            modParentProductId: response.result_set[0].alias_product_primary_id,
            modProductPrice: productPrice,
            modProductTotalPrice: productTotalPrice,
          });
        } else {
          $(".modfir_addcart_cls").hide();
          $("#modErrorDiv").show();
          $("#modErrorDiv").delay(6000).fadeOut();
        }
      });
    }
  }

  setModifierValFun($_this) {
    var mdfcombopro = $_this.find(":checked").attr("data-mdfcombopro");
    $_this.closest(".main_combo_div").find(".individual_combo_mdf").hide();
    $_this
      .closest(".main_combo_div")
      .find(".compo_mdf_" + mdfcombopro)
      .show();
  }

  setOverallSubmdfrPrice($_this) {
    var mainmdfrid = $_this.find(":checked").attr("data-mdfcombopro");
    var ismdfrprochk = $_this.find(":checked").attr("data-ismdfrprochk");
    var combopriceapplychk = $_this
      .closest(".main_combo_div")
      .attr("data-combopriceapply");
    var maincomboidtxt = $_this
      .closest(".main_combo_div")
      .attr("data-maincomboidtxt");
    var mdfrpricevaluetxt_val = 0,
      inv_comopo_mismatch_pro = "";

    if (parseFloat(ismdfrprochk) > 0) {
      if (this.state.compoApi_call === "Yes") {
        this.checkModifierPricefun($_this, maincomboidtxt, mainmdfrid);
      }
    } else {
      if (parseFloat(combopriceapplychk) > 0) {
        var aplyprice_temp = $_this
          .find(":checked")
          .attr("data-combopropriceaply");
        aplyprice_temp = aplyprice_temp !== undefined ? aplyprice_temp : 0;
        mdfrpricevaluetxt_val = parseFloat(aplyprice_temp);
      }
      $_this
        .closest(".main_combo_div")
        .find(".mdfr_list_divlcs")
        .attr("data-invcomboprice", mdfrpricevaluetxt_val);
      $_this
        .closest(".main_combo_div")
        .find(".mdfr_list_divlcs")
        .attr("data-mismatchpro", inv_comopo_mismatch_pro);
      $_this.closest(".main_combo_div").find(".mdfr_list_divlcs_error").hide();
    }

    this.checkModifierErrorfun();
  }

  checkModifierPricefun($_this, maincomboidtxt, mdfcombopro_id) {
    var returntxt_msg = "";
    var sub_mdfr_ids = "";
    $(".maincombo-" + maincomboidtxt)
      .find(".compo_mdf_" + mdfcombopro_id)
      .each(function () {
        var modVal = $(this).find(".components_mdf_selct").val();
        if (modVal !== "") {
          var modifier_combosets_txt = $(this)
            .find(".components_mdf_selct")
            .find("option:selected")
            .attr("data-selectmdfval");
          var modifier_combosets =
            modifier_combosets_txt !== "" &&
            modifier_combosets_txt !== undefined
              ? modifier_combosets_txt.split("~")
              : [];
          if (modifier_combosets.length >= 2) {
            if (modifier_combosets[2]) {
              if (sub_mdfr_ids !== "") {
                sub_mdfr_ids += ";";
              }
              sub_mdfr_ids = sub_mdfr_ids + modifier_combosets[2];
            }
          }
        }
      });

    if (sub_mdfr_ids !== "") {
      showLoader("compo_addcart_cls", "class");
      Axios.get(
        apiUrl +
          "products/validate_product?app_id=" +
          uniqueID +
          "&product_id=" +
          mdfcombopro_id +
          "&modifier_value_id=" +
          sub_mdfr_ids
      ).then((res) => {
        var response = res.data;
        var tempval = "";
        if (response.status === "ok") {
          this.updateIndvModifrprice(
            $_this
              .closest(".main_combo_div")
              .find(".compo_mdf_" + mdfcombopro_id + ":first")
          );
        } else {
          tempval = "1";
        }
        $_this
          .closest(".main_combo_div")
          .find(".mdfr_list_divlcs")
          .attr("data-mismatchpro", tempval);
        this.checkModifierErrorfun();
        hideLoader("compo_addcart_cls", "class");
      });
    }

    return returntxt_msg;
  }

  updateIndvModifrprice($_this) {
    var mdfrpricevaluetxt_val = 0;
    $_this
      .closest(".mdfr_list_divlcs_inv")
      .find(".components_mdf_selct")
      .each(function () {
        var mdfrpricevaluetxt = $(this)
          .find(":checked")
          .attr("data-mdfrpricevaluetxt");
        mdfrpricevaluetxt =
          mdfrpricevaluetxt !== "" && mdfrpricevaluetxt !== undefined
            ? parseFloat(mdfrpricevaluetxt)
            : 0;
        mdfrpricevaluetxt_val =
          parseFloat(mdfrpricevaluetxt_val) + parseFloat(mdfrpricevaluetxt);
      });
    $_this
      .closest(".mdfr_list_divlcs")
      .attr("data-invcomboprice", mdfrpricevaluetxt_val);
  }

  checkModifierErrorfun() {
    var over_allerror = "";
    $(".mdfr_list_divlcs").each(function () {
      if ($(this).attr("data-mismatchpro") === "1") {
        over_allerror = "1";
        $(this).find(".mdfr_list_divlcs_error").show();
      } else {
        $(this).find(".mdfr_list_divlcs_error").hide();
      }
    });

    this.updateProductPricefun();

    if (over_allerror === "1") {
      $(".compo_addcart_cls").hide();
    } else {
      $(".compo_addcart_cls").show();
    }
  }

  componentDidUpdate() {
    var TotalCnt = $(".modifierList").length;
    var modProductSlug = $("#modProductSlug").val();
    if (
      TotalCnt > 0 &&
      this.state.mdfApi_call === "Yes" &&
      this.state.selectedProSlug === modProductSlug
    ) {
      this.checkProductPrice();
    }

    var $_reactThis = this;
    var individualComboCnt = $(".individual_combo_mdf").length;
    if (individualComboCnt > 0) {
      $(".main_combo_div").each(function () {
        $_reactThis.setModifierValFun($(this).find(".components_selct"));
      });

      if ($(".components_selct").length > 0) {
        $(".components_selct").each(function () {
          $_reactThis.setOverallSubmdfrPrice($(this));
        });
      }
    }

    var indlMinMxComboCnt = $(".individual_combo_pro").length;
    if (indlMinMxComboCnt > 0) {
      $(".main_combo_div").each(function () {
        var minselectcombo_txt =
          $(this).data("minselectcombo") !== ""
            ? $(this).data("minselectcombo")
            : "0";
        var combopriceapply_txt =
          $(this).data("combopriceapply") !== ""
            ? $(this).data("combopriceapply")
            : "0";

        if (
          parseInt(minselectcombo_txt) === 0 ||
          parseInt(combopriceapply_txt) === 1
        ) {
          $(this).find(".combo_pro_price").show();
        } else {
          //  $(this).find(".combo_pro_price").hide();
        }
      });
    }

    var minmaxMainCnt = $(".minmax_maincombo_div").length;
    var chkAplyModfInMinmax = 0;
    if (minmaxMainCnt > 0) {
      chkAplyModfInMinmax = $(".minmax_maincombo_div").find(
        ".components_selctbox_cls"
      ).length;
      this.updateProductPricefun();
    }

    var singleSelectCompo = $(".components_selctbox_cls").length;
    if (
      singleSelectCompo > 0 &&
      ((minmaxMainCnt === 0 &&
        indlMinMxComboCnt === 0 &&
        individualComboCnt === 0) ||
        chkAplyModfInMinmax > 0)
    ) {
      if ($(".components_selct").length > 0) {
        $(".components_selct").each(function () {
          $_reactThis.setOverallSubmdfrPrice($(this));
        });
      }
    }
  }

  viewProDetail(productDetail, pro_cate_slug, pro_subcate_slug, event) {
    var eventN = event || "";
    if (eventN !== "") {
      event.preventDefault();
    }

    var productSlug = productDetail.product_slug;

    if (productSlug !== "") {
      this.props.history.push(
        "/menu" +
          "/" +
          pro_cate_slug +
          "/" +
          pro_subcate_slug +
          "/" +
          productSlug
      );
    }
    return false;
  }

  updateStateValue = (field, value) => {
    if (field === "cartflg") {
      this.setState({ cartTriggerFlg: value });
    }
    if (field === "view_pro_data" && value !== "") {
      this.setState(
        { viewProductSlug: value },
        function () {
          this.openProDetailPopup();
        }.bind(this)
      );
    }
    if (field === "cartList") {
      this.setState({ cartList: value });
    }
    if (field === "cartItemsLength") {
      this.setState({ cartItemsLength: value });
    }
  };

  render() {
    return <div id="ProductDetail">{this.productDetailsMain()}</div>;
  }
}

export default ProductDetail;
