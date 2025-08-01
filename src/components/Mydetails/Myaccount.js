import React, { Component } from "react";
import cookie from "react-cookies";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import Select from "react-select";
import innerbanner from "../../common/images/img/inner-banner.jpg";
import axios from "axios";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import Sidebar from "./Sidebar";
import { apiUrl, uniqueID } from "../Settings/Config";
import { hideLoader, showLoader } from "../Settings/SettingHelper";

class Myorders extends Component {
  constructor(props) {
    super(props);
    const customerID = localStorage.getItem("customerID") ?? "";
    this.state = {
      trigerCart: false,
      loginPopup:false,
      customerID: customerID,
      customerFirstName: "",
      customerLastName: "",
      customerEmail: "",
      customerPhone: "",
      customerBirthDate: "",
      customerGender: "",
    };
  }

  componentDidMount() {
    console.log(this.state.customerID, 'this.state.customerIDthis.state.customerID')
    if (this.state.customerID === "") {
      cookie.save("triggerLogin", "Yes", { path: "/" });
      this.props.history.push("/");
    } else {
      this.loadCustomerDetails();
    }
  }
  loadCustomerDetails() {
    axios
      .get(
        `${apiUrl}customer/details?uniqueID=${uniqueID}&customerID=${this.state.customerID}`
      )
      .then((res) => {
        if (res.data.status === "ok") {
          const result = res.data.result;
          const customerBirthDate = result?.customerBirthDate ?? "";
          const customerGender = result?.customerGender ?? "";
          const customerName = result?.customerName ?? "";
          const customerFirstName = result?.customerFirstName ?? "";
          
          this.setState({
            customerFirstName: (customerFirstName!=="")?customerFirstName:customerName,
            customerLastName: result?.customerLastName ?? "",
            customerEmail: result?.customerEmail ?? "",
            customerPhone: result?.customerPhone ?? "",
            customerBirthDate:
              customerBirthDate !== "" && customerBirthDate !== null
                ? new Date(customerBirthDate)
                : "",
            customerGender:
              customerGender !== "" && customerGender !== null
                ? { label: customerGender, value: customerGender }
                : "",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loadCurrentOrder: false });
      });
  }
  handleChange(name, e) {
    const value = (name==='customerBirthDate')?e:e.target.value;
    if (name === "mobile") {
      const value_ = value.replace(/[^0-9]/g, "");
      this.setState({ [name]: value_, [`${name}Error`]: "" });
    } else {
      this.setState({ [name]: value, [`${name}Error`]: "" });
    }
  }
  handleSelectChange(name, value) {
    this.setState({ [name]: value });
  }

  saveData() {
    showLoader("updateprofile");
    const postObject = {
      uniqueID,
      customerFirstName: this.state.customerFirstName,
      customerLastName: this.state.customerLastName,
      customerPhone: this.state.customerPhone,
      customerBirthDate: this.state.customerBirthDate,
      customerGender: this.state.customerGender?.value ?? "",
    };
    axios
      .put(
        `${apiUrl}customer/updatedetail/${this.state.customerID}`,
        postObject
      )
      .then((res) => {
        hideLoader("updateprofile");
        if (res.data.status === "ok") {
          toast.success("Profile Update Successfully.");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((e) => {
        var errorMsg = e?.response?.data?.massage || e.message;
        toast.error(errorMsg);
        hideLoader("updateprofile");
        console.error("Error fetching data:", e);
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
          <img src={innerbanner} alt="image" />
          <div className="inner-caption">My Orders</div>
        </div>
        <div className="innerpage myaccount-pages">
          <div className="container">
            <div className="dashboard-main">
              <Sidebar  {...this.props} active="myprofile" />
              <div className="dashboard-aside">
                {/* Order  Start  */}
                <div className="da-acc-info">
                  <h4>Account Information</h4>

                  <div className="form-group">
                    <label className="control-label">First Name</label>
                    <div className="controls">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="form-control"
                        value={this.state.customerFirstName}
                        onChange={this.handleChange.bind(
                          this,
                          "customerFirstName"
                        )}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label">Last Name</label>
                    <div className="controls">
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="form-control"
                        value={this.state.customerLastName}
                        onChange={this.handleChange.bind(
                          this,
                          "customerLastName"
                        )}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label">Email Address</label>
                    <div className="controls">
                      <input
                        type="text"
                        placeholder="Email Address"
                        className="form-control"
                        readOnly={true}
                        value={this.state.customerEmail}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label">Mobile Number</label>
                    <div className="controls">
                      <input
                        type="text"
                        placeholder="Mobile Number"
                        className="form-control"
                        value={this.state.customerPhone}
                        maxLength={8}
                        onChange={this.handleChange.bind(
                          this,
                          "customerPhone"
                        )}
                      />
                    </div>
                  </div>

                  <div className="two-column-form">
                    <div className="form-group">
                      <label className="control-label">Birthday</label>
                      <div className="controls">
                        <DatePicker
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          className="form-control"
                          maxDate={new Date()}
                          selected={this.state.customerBirthDate}
                          dateFormat="d-MM-yyyy"
                          placeholderText="Date Of Birth"
                          onChange={this.handleChange.bind(
                            this,
                            "customerBirthDate"
                          )}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label">Gender</label>
                      <div className="controls">
                        <Select
                          value={this.state.customerGender}
                          onChange={this.handleSelectChange.bind(
                            this,
                            "customerGender"
                          )}
                          placeholder="Select Gender"
                          isClearable={true}
                          options={[
                            {
                              label: "Male",
                              value: "Male",
                            },
                            {
                              label: "Female",
                              value: "Female",
                            },
                            {
                              label: "Transgender",
                              value: "Transgender",
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="single-center-btn">
                    <button
                      className="button"
                      id="updateprofile"
                      onClick={this.saveData.bind(this)}
                    >
                      Update
                    </button>
                  </div>
                </div>
                {/* Order  End */}
              </div>
            </div>
          </div>
        </div>
        <Footer {...this.props}  updateStateValue={this.updateStateValue.bind(this)}/>
      </div>
    );
  }
}
export default Myorders;
