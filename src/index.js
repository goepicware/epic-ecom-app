import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { getStore } from "./store";

import "./common/css/font-awesome.min.css";
import "./common/css/bootstrap.min.css";
import "./common/css/style.css";
import "./common/css/responsive.css";
import "./common/css/slick.css";
import "./common/css/new-style.css";
import Home from "./components/Home/Home";
import Refpage from "./components/Layout/Refpage";
import Productlisting from "./components/Products/Product-listing";
import Checkout from "./components/Checkout/index";
import Processing from "./components/Checkout/Processing";
import Thankyou from "./components/Checkout/Thank-you";
/* import Productdelivery from "./components/Newdesign/Product-delivery"; */
import Myorders from "./components/Mydetails/Myorders";
import Myaccount from "./components/Mydetails/Myaccount";
import Pages from "./components/Pages/Index";
import Contactus from "./components/Pages/Contactus";
import Outlets from "./components/Pages/Outlets";
import Dashboard from "./components/Mydetails/Dashboard";
import SpinWheel from "./components/SpinWheel/Index";

import Page404 from "./Page404";

const store = getStore();
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/products/:category/:productSlug" component={Productlisting} />
        <Route exact path="/products/:category" component={Productlisting} />
        <Route exact path="/products" component={Productlisting} />
        <Route exact path="/checkout" component={Checkout} />
        <Route exact path="/placeorder" component={Processing} />
        <Route exact path="/thankyou/:orderNumber" component={Thankyou} />
        <Route exact path="/myorders/:orderNumber" component={Thankyou} />
        <Route exact path="/myorders" component={Myorders} />
        <Route exact path="/myprofile" component={Myaccount} />        
        {/* <Route exact path="/product-delivery" component={Productdelivery} /> */}
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/contactus" component={Contactus} />
        <Route exact path="/outlets" component={Outlets} />
        <Route exact path="/spinWheel" component={SpinWheel} />
           
        <Route exact path="/:pageSlug" component={Pages} />
        
        <Route path={"/refpage/:slugtext"} component={Refpage} />
        <Route component={Page404} />
      </Switch>
    </Router>
  </Provider>
);
