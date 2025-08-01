/* eslint-disable */
import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { format } from "date-fns";
import { toast } from "react-toastify";
import searchi from "../../common/images/img/search-black.svg";
import ban from "../../common/images/img/deliv-ban.jpg";
import {
  apiUrl,
  uniqueID,
  deliveryId,
  pickupId,
  CountryName,
} from "../Settings/Config";
import {
  addressFormat,
  showLoader,
  hideLoader,
} from "../Settings/SettingHelper";
import OrderAdvancedDatetimeSlot from "../Layout/OrderAdvancedDatetimeSlot";
import closei from "../../common/images/img/close-top.svg";

class AvilablityPopup extends Component {
  constructor(props) {
    super(props);
    const seletedAvilablityId = cookie.load("availability") ?? "";
    const seletedAvilablityName = cookie.load("availabilityName") ?? "";
    const path =  this.props.match?.path;
    this.state = {
      path: path,
      popupType: "",
      outletList: [],
      seletedAvilablityId: seletedAvilablityId,
      seletedAvilablityName: seletedAvilablityName,
      selectedOutletIndex: "",
      outletID: "",
      order_tat_time: "",
      openPopup: false,
      postalCode: "",
      postalCodeError: "",
      zoneDetails: "",

      /* For Advanced Slot */
      getDateTimeFlg: "",
      seleted_ord_date: "",
      seleted_ord_time: "",
      seleted_ord_slot: "",
      seleted_ord_slotTxt: "",
      seleted_ord_slot_str: "",
      seleted_ord_slot_end: "",
      order_tat_time: "",
      orderDateTime: "",
      orderSlotVal: "",
      orderSlotTxt: "",
      orderSlotStrTime: "",
      orderSlotEndTime: "",
      labelDateName: "Pickup",
      labelTimeName: "Pickup",
      isAdvanced: "no",
      deliveryTime: "",
      slotType: 1,
      allowDefaultAvilablity:"",
      allowDefaultAvilablityName:"",

    };
  }

  componentDidMount() {
    this.loadOutlets();
    const triggerLogin = cookie.load('triggerLogin') ?? '';
    const triggerOrderType = cookie.load('triggerOrderType') ?? '';
    /* triggerLogin!=="Yes" &&  */
    if(triggerOrderType==="Yes") {
      cookie.remove("triggerOrderType", { path: "/" });
      this.setState({openPopup:true})
      this.props.updateStateValue('openPopup', true);      
    }
  }

  componentWillReceiveProps(PropsDt) {
    if(this.state.openPopup!==PropsDt.openPopup) {
      this.setState({openPopup:PropsDt.openPopup})
    }
    if(this.state.allowDefaultAvilablity!==PropsDt.allowDefaultAvilablity) {
      if(PropsDt.allowDefaultAvilablity!=="") {
        this.setState({seletedAvilablityId:PropsDt.allowDefaultAvilablity, allowDefaultAvilablity:PropsDt.allowDefaultAvilablity, allowDefaultAvilablityName:PropsDt.allowDefaultAvilablityName, seletedAvilablityName:PropsDt.allowDefaultAvilablityName}, ()=> {
          this.props.updateStateValue('allowDefaultAvilablity', "");      
        })
      }
    }
    
  }

  loadOutlets() {
    axios
      .get(`${apiUrl}outlet/outletlist?uniqueID=${uniqueID}`)
      .then((res) => {
        if (res.data.status === "ok") {
          this.setState({ outletList: res.data.result });
        }
      })
      .catch((error) => {});
  }

  selectAvailability(availability, availabilityName, e) {
    e.preventDefault();
    this.setState({
      seletedAvilablityId: availability,
      seletedAvilablityName: availabilityName,
      popupType: "avalablity",
      openPopup: true,
    });
  }
  selectOutlet(outletIndex, outletDetails) {
    let orderTat = 15;
    if (this.state.seletedAvilablityId === deliveryId) {
      orderTat = outletDetails?.outletDeliveryTAT ?? 15;
    } else if (this.state.seletedAvilablityId === pickupId) {
      orderTat = outletDetails?.outletPickupTAT ?? 15;
    }
    if (outletIndex === this.state.selectedOutletIndex) {
      if (this.state.seletedAvilablityId === deliveryId) {
        this.setState({ popupType: "postalCode" });
      } else {
        this.setState(
          {
            popupType: "timeslot",
            order_tat_time: orderTat,
            outletID: outletDetails._id,
          },
          () => {
            this.setState({ getDateTimeFlg: "yes" });
          }
        );
      }
    } else {
      this.setState(
        {
          selectedOutletIndex: outletIndex,
          order_tat_time: orderTat,
          outletID: outletDetails._id,
        },
        () => {
          if (this.state.seletedAvilablityId === deliveryId) {
            this.setState({ popupType: "postalCode" });
          }
        }
      );
    }
  }

  handleChange(name, e) {
    const value = e.target.value;
    this.setState({ [name]: value, [`${name}Error`]: "" });
  }

  findZone(e) {
    e.preventDefault();
    const selectedOutlet =
      this.state.outletList[this.state.selectedOutletIndex];
    showLoader("findZone");
    const postObject = {
      uniqueID,
      postalCode: this.state.postalCode,
      availabilityID: deliveryId,
      outletID: selectedOutlet._id,
    };
    axios
      .post(apiUrl + "outletzone/findZone", postObject)
      .then((res) => {
        hideLoader("findZone");
        if (res.data.status === "ok") {
          this.setState(
            {
              zoneDetails: res.data.result,
              popupType: "timeslot",
              outletID: selectedOutlet._id,
            },
            () => {
              this.setState({ getDateTimeFlg: "yes" });
            }
          );
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((e) => {
        var errorMsg = e?.response?.data?.message || e.message;
        toast.error(errorMsg);
        hideLoader("findZone");
        console.error("Error fetching data:", e);
      });
  }

  confirmOrderType(e) {
    e.preventDefault();
    const selectedOutlet =
      this.state.outletList[this.state.selectedOutletIndex];
    let orderTat = 15;
    if (this.state.seletedAvilablityId === deliveryId) {
      orderTat = selectedOutlet?.outletDeliveryTAT ?? 15;
    } else if (this.state.seletedAvilablityId === pickupId) {
      orderTat = selectedOutlet?.outletPickupTAT ?? 15;
    }
    const orderHandledOutlet = addressFormat(
      selectedOutlet.outletUnitNumber,
      selectedOutlet.outletFloorNumber,
      selectedOutlet.outletAddress,
      selectedOutlet.outletPostalCode,
      CountryName
    );

    cookie.save("outletID", selectedOutlet._id, { path: "/" });
    cookie.save("availability", this.state.seletedAvilablityId, { path: "/" });
    cookie.save("availabilityName", this.state.seletedAvilablityName, {
      path: "/",
    });
    cookie.save("outletName", selectedOutlet.outletName, { path: "/" });
    cookie.save("orderTat", orderTat, { path: "/" });
    cookie.save("orderHandledOutlet", String(orderHandledOutlet), {
      path: "/",
    });
    cookie.save("outletID", selectedOutlet._id, { path: "/" });

    if (this.state.seletedAvilablityId === deliveryId) {
      localStorage.setItem("zoneID", this.state.zoneDetails._id);
      localStorage.setItem("zoneName", this.state.zoneDetails.zoneName);
      localStorage.setItem("deliveryAddress", this.state.zoneDetails.address);
      localStorage.setItem("deliveryPostalCode", this.state.postalCode);
    }

    var seletedOrdDate = this.state.seleted_ord_date;
    var seletedOrdTime = this.state.seleted_ord_time;
    if (
      seletedOrdDate !== "" &&
      seletedOrdTime !== "" &&
      seletedOrdDate !== null &&
      seletedOrdTime !== null
    ) {
      var OrderDate = format(seletedOrdDate, "yyyy-MM-dd");
      /* For Advanced Slot */
      var OrderHours = seletedOrdTime.getHours();
      var OrderMunts = seletedOrdTime.getMinutes();
      var OrderSecnd = seletedOrdTime.getSeconds();
      var orderDateTime = new Date(OrderDate);
      orderDateTime.setHours(OrderHours);
      orderDateTime.setMinutes(OrderMunts);
      orderDateTime.setSeconds(OrderSecnd);

      var deliveryDate = format(seletedOrdDate, "dd/MM/yyyy");
      var deliveryTime =
        this.convPad(OrderHours) +
        ":" +
        this.convPad(OrderMunts) +
        ":" +
        this.convPad(OrderSecnd);
      cookie.save("orderDateTime", orderDateTime, { path: "/" });
      cookie.save("deliveryDate", deliveryDate, { path: "/" });
      cookie.save("deliveryTime", deliveryTime, { path: "/" });

      /* For Advanced Slot */
      var isAdvanced = this.state.isAdvanced;
      var slotType = this.state.slotType;
      var orderSlotVal = "",
        orderSlotTxt = "",
        orderSlotStrTime = "",
        orderSlotEndTime = "";
      if (slotType === 2) {
        orderSlotVal = this.state.seleted_ord_slot;
        orderSlotTxt = this.state.seleted_ord_slotTxt;
        orderSlotStrTime = this.state.seleted_ord_slot_str;
        orderSlotEndTime = this.state.seleted_ord_slot_end;
      }
      cookie.save("isAdvanced", isAdvanced, { path: "/" });
      cookie.save("slotType", slotType, { path: "/" });
      cookie.save("orderSlotVal", orderSlotVal, { path: "/" });
      cookie.save("orderSlotTxt", orderSlotTxt, { path: "/" });
      cookie.save("orderSlotStrTime", orderSlotStrTime, { path: "/" });
      cookie.save("orderSlotEndTime", orderSlotEndTime, { path: "/" });
      /* For Advanced Slot End */
    }
    const openCart = this.props?.openCart ?? false;
    if(openCart===true) {
      this.setState({openPopup:false}, ()=> {       
        this.props.updateStateValue('reloadCartPage', true);
        this.props.updateStateValue('openPopup', false);
        this.props.updateStateValue('openCart', true);
        document.body.classList.add("cart-sidebar-open");
      })
      
    }else {
      const redirect = cookie.load('redirect') ?? '';
      if(redirect!=="") {
        cookie.remove("redirect", { path: "/" });
        this.props.history.push(`/${redirect}`);
      }else {
        this.props.history.push("/products");
      }
      
    }
    
  }

  convPad(d) {
    return d < 10 ? "0" + d.toString() : d.toString();
  }

  /* For Advanced Slot */
  setdateTimeFlg = (field, value) => {
    if (field == "tmflg") {
      this.setState({ getDateTimeFlg: value });
    } else if (field == "ordDate") {
      var ordTime = "";
      $(".ordrdatetime_error").html("");
      this.setState({
        seleted_ord_date: value,
        seleted_ord_time: ordTime,
        seleted_ord_slot: ordTime,
        seleted_ord_slotTxt: ordTime,
        seleted_ord_slot_str: ordTime,
        seleted_ord_slot_end: ordTime,
      });
    } else if (field == "ordTime") {
      var tmSltArr = value;
      var ordTime = "";
      $(".ordrdatetime_error").html("");
      this.setState({
        seleted_ord_time: tmSltArr["startTime"],
        seleted_ord_slot: ordTime,
        seleted_ord_slotTxt: ordTime,
        seleted_ord_slot_str: ordTime,
        seleted_ord_slot_end: ordTime,
      });
    } else if (field == "ordSlotDate") {
      var ordTime = "";
      $(".ordrdatetime_error").html("");
      this.setState({
        seleted_ord_date: value,
        seleted_ord_time: ordTime,
        seleted_ord_slot: ordTime,
        seleted_ord_slotTxt: ordTime,
        seleted_ord_slot_str: ordTime,
        seleted_ord_slot_end: ordTime,
      });
    } else if (field == "ordSlotTime") {
      var tmSltArr = value;
      $(".ordrdatetime_error").html("");
      this.setState({
        seleted_ord_time: tmSltArr["startTime"],
        seleted_ord_slot: tmSltArr["ordSlotVal"],
        seleted_ord_slotTxt: tmSltArr["ordSlotLbl"],
        seleted_ord_slot_str: tmSltArr["ordSlotStr"],
        seleted_ord_slot_end: tmSltArr["ordSlotEnd"],
      });
    } else if (field == "triggerErrorPopup") {
      $.magnificPopup.open({
        items: {
          src: "#outlet-error-popup",
        },
        type: "inline",
      });
    } else if (field == "slotType") {
      this.setState({slotType:value})
    }
    
  };
  updateStateValue() {}
 
  render() {
    return (
      <div>
        <Popup
          open={this.state.openPopup}
          onClose={() => { this.setState({ openPopup: false }); this.props.updateStateValue('openPopup', false); }}
          modal
          className="popup-master-big"
          closeOnDocumentClick={false}
        >
          {/* Selection Popup */}
          <div className="left-white-bar">
            <div className="pm-close">
              <a href="/" onClick={(e) => { e.preventDefault(); this.props.updateStateValue('openPopup', false); this.setState({ openPopup: false })}}>
                <img className="close-top" src={closei} alt="close" />
              </a>
            </div>
            
            <div className="lwb-promo-img">
              <img src={ban} alt="Gallery" />{" "}
            </div>
            <div className="lwb-button">
              <a
                href="/"
                className={`${
                  this.state.seletedAvilablityId === deliveryId ? `active ` : ``
                }button`}
                onClick={this.selectAvailability.bind(
                  this,
                  deliveryId,
                  "Delivery"
                )}
              >
                Delivery
              </a>
              <a
                href="/"
                className={`${
                  this.state.seletedAvilablityId === pickupId ? `active ` : ``
                }button`}
                onClick={this.selectAvailability.bind(this, pickupId, "Pickup")}
              >
                Pickup
              </a>
            </div>
          </div>

          {/* Delivery Popup */}
          {this.state.seletedAvilablityId === deliveryId && (
            <div className="location-overflow">
              {this.state.popupType !== "timeslot" && (
                <React.Fragment>
                  <div className="header-overflow">Delivery</div>
                  <div className="delivery-mid-flow">
                    {this.state.popupType === "postalCode" ? (
                      <div className="new-location-find">
                        <h4>New address </h4>
                        <div className="nlf-form">
                          <div className="form-group">
                            <input
                              type="text"
                              className="search-input"
                              placeholder="Please enter your Postal Code"
                              value={this.state.postalCode}
                              onChange={this.handleChange.bind(
                                this,
                                "postalCode"
                              )}
                            />
                            <img
                              className="search-icon"
                              src={searchi}
                              alt="search"
                            />{" "}
                          </div>
                        </div>
                        <div className="nlf-location-link">
                          <a href="/"  onClick={(e)=> { e.preventDefault(); this.setState({popupType:'avalablity'}) }} >Change location</a>
                        </div>
                      </div>
                    ) : (
                      <div className="pickup-show-list">
                        <h4>Outlets</h4>
                        <ul>
                          {this.state.outletList.length > 0 ? (
                            this.state.outletList.map((item, index) => {
                              return (
                                <li
                                  className={
                                    this.state.selectedOutletIndex === index
                                      ? "active"
                                      : ""
                                  }
                                  key={index}
                                  onClick={this.selectOutlet.bind(
                                    this,
                                    index,
                                    item
                                  )}
                                >
                                  <h5>{item.outletName} </h5>
                                  <span>
                                    {addressFormat(
                                      item.outletUnitNumber,
                                      item.outletFloorNumber,
                                      item.outletAddress,
                                      item.outletPostalCode,
                                      CountryName
                                    )}
                                  </span>
                                  {this.state.selectedOutletIndex === index && (
                                    <a
                                      href="/"
                                      className="small-pickbtn"
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      Schedule delivery
                                    </a>
                                  )}
                                </li>
                              );
                            })
                          ) : (
                            <li>
                              <span>No Outlet Found</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  {this.state.popupType === "postalCode" && (
                    <div className="two-row-grid-button">
                      <a href="/"  onClick={(e)=> { e.preventDefault(); this.setState({popupType:'avalablity'}) }}  className="button">
                        Go Back
                      </a>
                      <a
                        href="/"
                        className="button"
                        id="findZone"
                        onClick={this.findZone.bind(this)}
                      >
                        Continue
                      </a>
                    </div>
                  )}
                </React.Fragment>
              )}

              {this.state.popupType === "timeslot" && (
                <div className="select-delivery-slot">
                  <div className="select-delivery-slot-header">
                    <h4>Choose Date & Time</h4>
                  </div>
                  {this.state.path!=="/checkout" &&
                  <OrderAdvancedDatetimeSlot
                    {...this.props}
                    hdrState={this.state}
                    setdateTimeFlg={this.setdateTimeFlg.bind(this)}
                    indutualText={true}
                    labelDateName={`${this.state.labelDateName} Date`}
                    labelTimeName={`${this.state.labelTimeName} Time`}
                    outletID={this.state.outletID}
                  />}
                </div>
              )}
              {this.state.popupType === "timeslot" && (
                <div className="two-row-grid-button">
                  <a href="/"  onClick={(e)=> { e.preventDefault(); this.setState({popupType:'postalCode'}) }}  className="button">
                    Go Back
                  </a>
                  <a
                    href="/"
                    className="button"
                    onClick={this.confirmOrderType.bind(this)}
                  >
                    Continue
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Pickup Popup */}
          {this.state.seletedAvilablityId === pickupId && (
            <div className="pickup-show">
              <div className="header-overflow">Pickup</div>
              <div className="delivery-mid-flow">
                {this.state.popupType !== "timeslot" && (
                  <div className="pickup-show-list">
                    <h4>Outlets</h4>
                    <ul>
                      {this.state.outletList.length > 0 ? (
                        this.state.outletList.map((item, index) => {
                          return (
                            <li
                              className={
                                this.state.selectedOutletIndex === index
                                  ? "active"
                                  : ""
                              }
                              key={index}
                              onClick={this.selectOutlet.bind(this, index, item)}
                            >
                              <h5>{item.outletName} </h5>
                              <span>
                                {addressFormat(
                                  item.outletUnitNumber,
                                  item.outletFloorNumber,
                                  item.outletAddress,
                                  item.outletPostalCode,
                                  CountryName
                                )}
                              </span>
                              {this.state.selectedOutletIndex === index && (
                                <a
                                  href="/"
                                  className="small-pickbtn"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  Schedule pickup
                                </a>
                              )}
                            </li>
                          );
                        })
                      ) : (
                        <li>
                          <span>No Outlet Found</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                {this.state.popupType === "timeslot" && (
                  <div className="select-delivery-slot">
                    <div className="select-delivery-slot-header">
                      <h4>Choose Date & Time</h4>
                    </div>
                    {this.state.path!=="/checkout" &&
                    <OrderAdvancedDatetimeSlot
                      {...this.props}
                      hdrState={this.state}
                      setdateTimeFlg={this.setdateTimeFlg.bind(this)}
                      indutualText={true}
                      labelDateName={`${this.state.labelDateName} Date`}
                      labelTimeName={`${this.state.labelTimeName} Time`}
                      outletID={this.state.outletID}
                    />}
                  </div>
                )}
              </div>
              {this.state.popupType === "timeslot" && (
                <div className="two-row-grid-button">
                  <a href="/" onClick={(e)=> { e.preventDefault(); this.setState({popupType:'avalablity'}) }} className="button">
                    Go Back
                  </a>
                  <a
                    href="/"
                    className="button"
                    onClick={this.confirmOrderType.bind(this)}
                  >
                    Continue
                  </a>
                </div>
              )}
            </div>
          )}
        </Popup>
      </div>
    );
  }
}
export default AvilablityPopup;
