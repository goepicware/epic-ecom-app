import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../../common/images/logo.png";
class Footer extends Component {
  constructor(props) {
    super(props);
    const customerID = localStorage.getItem('customerID') ?? '';
    this.state = {
      customerID:customerID,
    }
  }
  createAccount(e) {
    e.preventDefault();console.log(this.props, 'this.propsthis.propsthis.props')
    if(this.state.customerID!=="") {
      this.props.history.push('/myprofile')
    }else {
      this.props.updateStateValue('loginPopup', true)
    }
  }

  render() {
    return (
      <div>
        <footer className="fbg">
          <div className="container">
            <div className="footer-wrapper">
              <div className="footer-nav">
                <div className="footer-nav-inner">
                  <h5>About</h5>
                  <ul>
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to={"/about-us"}>About Us</Link>
                    </li>
                    <li>
                      <Link to="/outlets">Our Outlets</Link>
                    </li>
                    <li>
                      <Link to="/contactus">Contact Us</Link>
                    </li>
                  </ul>
                </div>
                <div className="footer-nav-inner">
                  <h5>Other</h5>
                  <ul>
                    <li>
                      <Link to={"/privacy-policy"}>Privacy Policy</Link>
                    </li>
                    <li>
                      <Link to={"/terms-and-conditions"}>
                        Terms & Conditions
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="footer-logo textcenter">
                <a href="/">
                  <img src={logo} alt="logo" />{" "}
                </a>
              </div>
              <div className="footer-newsletter">
                <h4>🎁 Join & Earn Rewards!</h4>
                <p>
                  Create an account with Chirashizushi Shou and start earning
                  points every time you order 🍱
                  <br />
                  For every 100 points, enjoy an $8 cash rebate 💵 (that’s $0.08
                  per point!)
                  <br />
                  ✅ Simple sign-up
                  <br />
                  ✅ Track your orders
                  <br />
                  ✅ Redeem points for discounts
                  <br />
                  ✅ Exclusive member-only perks
                  <br />
                  Don’t miss out – register today and make every bite morerewarding!
                  <br />
                  <a href="/" onClick={this.createAccount.bind(this)}>Create My Account</a>
                </p>
                <div className="footer-copyright">
                  © 2025 Chirashizushi Shou., ALL RIGHTS RESERVED
                </div>
              </div>
             
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Footer;
