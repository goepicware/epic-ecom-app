import React, { Component } from "react";
import axios from "axios";
import { apiUrl, uniqueID } from "../Settings/Config";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import innerbanner from "../../common/images/img/inner-banner.jpg";
var Parser = require("html-react-parser");

class Home extends Component {
  constructor(props) {
    super(props);

    const pageSlug = this.props.match.params?.pageSlug;

    this.state = {
      loading: true,
      loginPopup:false,
      pageSlug:pageSlug,
      pageTitle:"",
      pageContent:"",
    };
  }
  componentDidMount() {
    this.loadPage();
  }
  componentWillReceiveProps(PropsDt) {
    let pageSlug_ = PropsDt.match.params?.pageSlug;
    if (pageSlug_ !== this.state.pageSlug) {
      this.setState({ pageSlug: pageSlug_, loading: true }, () => {
        this.loadPage();
      });
    }
  }
  
  loadPage () {
    axios
      .get(
        `${apiUrl}pages/details?uniqueID=${uniqueID}&pageSlug=${this.state.pageSlug}`
      )
      .then((res) => {
        if (res.data.status === "ok") {
          const result = res.data.result; 
          this.setState({ pageTitle: result.pageTitle, pageContent: result.pageContent});
        }else {
          this.props.history.push('/')
        }
      })
      .catch((error) => {
        console.log(error);
        this.props.history.push("./");
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
          <div className="inner-caption">{this.state.pageTitle}</div>
        </div>
        <div className="innerpage">
          <div className="container">
            {this.state.pageContent!==""?Parser(this.state.pageContent):''}
          </div>
        </div>
        <Footer {...this.props} updateStateValue={this.updateStateValue.bind(this)}/>
      </div>
    );
  }
}
export default Home;
