import React, { Component } from "react";
import Header from "../Layout/Header";
import SpinWheel from "./SpinWheel.tsx";
import { apiUrl } from "../Settings/Config";
var Parser = require("html-react-parser");
class SpinWheels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "Spin Wheel",
      backLink: "myaccount",
      pageContent: "",
    };
  }
  componentDidMount() {}
  onAction = (data) => {
    //this.props.history.push(data);
  };
  render() {
    return (
      <div className="main-div directpay-new home-page">
        <div className="min-h-screen bg-gradient-to-br from-slate-50">
          {/* Header */}

          {/* Main content */}
          <div className="items-center justify-center gap-8 px-4 pb-8 mt-4">
            {/* Spin wheel - center */}
            <div className="order-2 lg:order-2 spinwheel-parent pament-success myaccv1">
                <SpinWheel onAction={this.onAction} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SpinWheels;
