import React, { Component } from "react";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
class Sidebar extends Component {
  logout(e) {
    e.preventDefault();
    cookie.remove("availability", { path: "/" });
    cookie.remove("availabilityName", { path: "/" });
    cookie.remove("deliveryDate", { path: "/" });
    cookie.remove("deliveryOption", { path: "/" });
    cookie.remove("isAdvanced", { path: "/" });
    cookie.remove("IsVerifiedUser", { path: "/" });
    cookie.remove("orderDateTime", { path: "/" });
    cookie.remove("orderHandledOutlet", { path: "/" });
    cookie.remove("orderSlotEndTime", { path: "/" });
    cookie.remove("orderSlotStrTime", { path: "/" });
    cookie.remove("orderSlotTxt", { path: "/" });
    cookie.remove("orderSlotVal", { path: "/" });
    cookie.remove("orderTat", { path: "/" });
    cookie.remove("outletName", { path: "/" });
    cookie.remove("pickupOption", { path: "/" });
    cookie.remove("redeemPoint", { path: "/" });
    cookie.remove("redeemPointAmount", { path: "/" });
    cookie.remove("slotType", { path: "/" });
    
    cookie.remove("redeemPoint", { path: "/" });
    cookie.remove("redeemPointAmount", { path: "/" });
    cookie.remove('discountApplied', { path: "/" });
    cookie.remove('promoFreeDelivery', { path: "/" });
    cookie.remove('discount', { path: "/" });
    cookie.remove('promoCode', { path: "/" });
    
    localStorage.removeItem('customerID');
    localStorage.removeItem('deliveryAddress');
    localStorage.removeItem('deliveryPostalCode');
    localStorage.removeItem('deliveryUnitNumber');
    localStorage.removeItem('deliveryFloorNumber');
    localStorage.removeItem('paymentRequestIdRapyd');
    localStorage.removeItem('zoneID');
    localStorage.removeItem('zoneName');
    this.props.history.push('/')
  }


  render() {
    return (
      <div className="dashboard-sidebar">
        <ul>
          <li className={this.props.active === "myprofile" ? "active" : ""}>
            <Link to={"/myprofile"}>My Profile</Link>
          </li>
          <li className={this.props.active === "myorders" ? "active" : ""}>
            <Link to={"/myorders"}>Orders</Link>
          </li>
          {/* <li className={this.props.active === "mypromotion" ? "active" : ""}>
            <Link to={"/mypromotion"}>My Promotion</Link>
          </li> */}
          {/* <li className={this.props.active === "myaddress" ? "active" : ""}>
            <Link to={"/myaddress"}>Address Book</Link>
          </li> */}
          <li>
            <Link to={"/myprofile"}>Change Password</Link>
          </li>
          <li>
            <a href={"/"} onClick={this.logout.bind(this)}>Logout</a>
          </li>
        </ul>
      </div>
    );
  }
}
export default Sidebar;
