import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router";

import NewLogin from "./containers/NewLogin/NewLogin";
import NewSignUp from "./containers/NewSignup/NewSignUp";
import Home from "./containers/Home/Home";
import AccountPage from "./containers/AccountPage/AccountPage";
import AvatarBio from "./containers/AvatarBio/AvatarBio";
import Navigate from "./containers/Navigate/Navigate";
import ProtectedRoute from "./containers/ProtectedRoute/ProtectedRoute";

class App extends Component {
  state = {
    userData: {},
    loggedIn: false,
  };

  render() {

    return (
     
      <BrowserRouter>
        <Switch>
          <ProtectedRoute exact path="/home" component={Home} />
          <Route exact path="/" component={NewLogin} />

          <Route path="/signup" exact component={NewSignUp} />
          <Route path="/setup" exact component={AvatarBio} />
          <Route path="/account/:userId" exact component={AccountPage} />
          <Route path="/home/navigate" exact component={Navigate} />
        </Switch>
      </BrowserRouter>
    );
  }
}
export default App;
