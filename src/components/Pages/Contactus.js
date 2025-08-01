import React, { Component } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import { uniqueID, apiUrl, CountryName } from "../Settings/Config";
import {
  showLoader,
  hideLoader,
  addressFormat,
} from "../Settings/SettingHelper";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trigerCart: false,
      loginPopup: false,
      contactName: "",
      contactNumber: "",
      contactEmail: "",
      contactMessage: "",
      contactNameError: "",
      contactNumberError: "",
      contactEmailError: "",
      contactMessageError: "",
      outletList: [],
    };
  }
  componentDidMount() {
    this.loadOutlets();
  }
  updateStateValue = (field, value) => {
    this.setState({ [field]: value, [`${field}Error`]: "" });
  };
  handleChange(name, e) {
    this.setState({ [name]: e.target.value });
  }
  sendContact() {
    let error = 0;
    if (this.state.contactName === "") {
      this.setState({ contactNameError: "Name is required" });
      error++;
    } else {
      this.setState({ contactNameError: "" });
    }
    if (this.state.contactNumber === "") {
      this.setState({ contactNumberError: "Contact Number is required" });
      error++;
    } else {
      var re = /^\d+$/;
      if (!re.test(this.state.contactNumber)) {
        this.setState({ contactNumberError: "Invalid Contact Number" });
        error++;
      } else {
        this.setState({ contactNumberError: "" });
      }
    }
    if (this.state.contactEmail === "") {
      this.setState({ contactEmailError: "Email is required" });
      error++;
    } else {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(this.state.contactEmail)) {
        this.setState({ contactEmailError: "Invalid Email" });
        error++;
      } else {
        this.setState({ contactEmailError: "" });
      }
    }
    if (this.state.contactMessage === "") {
      this.setState({ contactMessageError: "Message is required" });
      error++;
    } else {
      this.setState({ contactMessageError: "" });
    }

    if (error === 0) {
      showLoader("submitcontact");
      const postObject = {
        uniqueID: uniqueID,
        contactName: this.state.contactName,
        contactNumber: this.state.contactNumber,
        contactEmail: this.state.contactEmail,
        contactMessage: this.state.contactMessage,
      };

      Axios.post(apiUrl + "contact", postObject)
        .then((res) => {
          hideLoader("submitcontact");
          if (res.data.status === "ok") {
            this.setState({
              contactName: "",
              contactNumber: "",
              contactEmail: "",
              contactMessage: "",
            });
            toast.success(res.data.message);
          }
        })
        .catch((e) => {
          hideLoader("submitcontact");
          const errorMsg = e?.response?.data?.message || e.message;
          toast.error(errorMsg);
        });
    }
  }
  loadOutlets() {
    Axios.get(`${apiUrl}outlet/alloutletlist?uniqueID=${uniqueID}`)
      .then((res) => {
        if (res.data.status === "ok") {
          this.setState({ outletList: res.data.result });
        }
      })
      .catch((error) => {});
  }
  render() {
    return (
      <div className="cover">
        <Header
          trigerCart={this.state.trigerCart}
          updateStateValue={this.updateStateValue.bind(this)}
          loginPopup={this.state.loginPopup}
        />

        <div className="contact-page">
          <div className="iframe-map-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d127640.40619248015!2d103.759344!3d1.3180317!3m2!1i1024!2i768!4f13.1!2m1!1schirashizushi%20shou!5e0!3m2!1sen!2sin!4v1745320274837!5m2!1sen!2sin"
              width="100%"
              height="450"
              allowfullscreen=""
              loading="lazy"
              title="Map"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="container">
            <div className="contact-form-info">
              <div className="send-message">
                <h3>Send Message </h3>

                <div className="form-group">
                  <label className="control-label">Your Name*</label>
                  <div className="controls">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="form-control"
                      value={this.state.contactName}
                      onChange={this.handleChange.bind(this, "contactName")}
                    />
                    {this.state.contactNameError !== "" && (
                      <span className="error">
                        {this.state.contactNameError}
                      </span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label">Contact Number*</label>
                  <div className="controls">
                    <input
                      type="text"
                      placeholder="Your Number"
                      className="form-control"
                      value={this.state.contactNumber}
                      maxLength={8}
                      onChange={this.handleChange.bind(this, "contactNumber")}
                    />
                    {this.state.contactNumberError !== "" && (
                      <span className="error">
                        {this.state.contactNumberError}
                      </span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label">Email*</label>
                  <div className="controls">
                    <input
                      type="text"
                      placeholder="Your Email"
                      className="form-control"
                      value={this.state.contactEmail}
                      onChange={this.handleChange.bind(this, "contactEmail")}
                    />
                    {this.state.contactEmailError !== "" && (
                      <span className="error">
                        {this.state.contactEmailError}
                      </span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label">Message*</label>
                  <div className="controls">
                    <textarea
                      class="form-control"
                      placeholder="Enter Message"
                      value={this.state.contactMessage}
                      onChange={this.handleChange.bind(this, "contactMessage")}
                    ></textarea>
                    {this.state.contactMessageError !== "" && (
                      <span className="error">
                        {this.state.contactMessageError}
                      </span>
                    )}
                  </div>
                </div>
                <div className="single-send-button">
                  <button
                    className="button"
                    onClick={this.sendContact.bind(this)}
                  >
                    Submit
                  </button>
                </div>
              </div>
              {this.state.outletList.length > 0 && (
                <div className="send-info">
                  <h3>Get In Touch</h3>
                  <ul>
                    {this.state.outletList.map((item, index) => {
                      const outletPhone = item?.outletPhone ?? "";
                      return (
                        <li key={index}>
                          <span>
                            <b>{item.outletName}</b>
                            <br />
                            📍 Address:{" "}
                            {addressFormat(
                              item.outletUnitNumber,
                              item.outletFloorNumber,
                              item.outletAddress,
                              item.outletPostalCode,
                              CountryName
                            )}
                            <br />
                            <b>📞 Contact Number: +65{outletPhone}</b>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer
          {...this.props}
          updateStateValue={this.updateStateValue.bind(this)}
        />
      </div>
    );
  }
}
export default Home;
