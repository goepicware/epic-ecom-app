import React, { Component } from "react";
import axios from "axios";
import olet from "../../common/images/outlet.jpg";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { apiUrl, uniqueID, CountryName } from "../Settings/Config";
import { addressFormat } from "../Settings/SettingHelper";

class Outlet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trigerCart: false,
      loginPopup:false,
      outletList: [],
    };
  }
  componentDidMount() {
    this.loadOutlets();
  }
  loadOutlets() {
    axios
      .get(`${apiUrl}outlet/alloutletlist?uniqueID=${uniqueID}`)
      .then((res) => {
        if (res.data.status === "ok") {
          this.setState({ outletList: res.data.result });
        }
      })
      .catch((error) => {});
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

        <div className="outlet-page">
          <div className="container">
            {this.state.outletList.length > 0 && (
              <div className="outlet-listing-parent">
                {this.state.outletList.map((item, index) => {
                  const outletTimeInfo = item?.outletTimeInfo ?? '';
                  const outletPhone = item?.outletPhone ?? '';
                  return (
                    <div className="outlet-listing" key={index}>
                      <div className="outlet-image">
                        <img
                          src={
                            item.outletImage !== "" && item.outletImage !== null
                              ? item.outletImage
                              : olet
                          }
                          alt={item.outletName}
                        />
                      </div>
                      <div className="outlet-info">
                        <h3>
                          {item.outletName} <br />
                          📍 Address: {addressFormat(
                            item.outletUnitNumber,
                            item.outletFloorNumber,                            
                            item.outletAddress,
                            item.outletPostalCode,
                            CountryName
                          )}{" "}
                        </h3>
                        {outletTimeInfo!=="" && outletTimeInfo!==null &&
                         <p>🕛 Operating Hours: {outletTimeInfo}</p>
                        }
                        {outletPhone!=="" && outletPhone!==null &&
                         <p>📞 Contact Number: +65{outletPhone}</p>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <Footer {...this.props} updateStateValue={this.updateStateValue.bind(this)} />
      </div>
    );
  }
}
export default Outlet;
