import React, { Component } from "react";
import { BrowserRouter, Redirect } from "react-router-dom";
import { Route, Switch } from "react-router";
import Login from "./containers/Login/Login";
import Signup from "./containers/Signup/Signup";
import Home from "./containers/Home/Home";
import AccountPage from "./containers/AccountPage/AccountPage";
import AvatarBio from "./containers/AvatarBio/AvatarBio";
import Navigate from "./containers/Navigate/Navigate";
import { db, auth } from "./containers/Firebase/Firebase";
import NewLogin from "./containers/NewLogin/NewLogin";

class App extends Component {
  state = {
    userData: {},
    loggedIn: false,
  };

  componentDidMount() {
    // check if user is already logged in
    auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection("users")
          .where("username", "==", user.displayName)
          .onSnapshot((snapshot) => {
            snapshot.docs.map((doc) => {
              this.setState({
                userData: doc.data(),
                loggedIn: true,
              });
            });
          });
      }
    });
  }

  render() {
 
    return (
      <BrowserRouter>
        <Switch>
          {this.state.loggedIn ? (
            <Route
              path="/home"
              exact
              render={() => <Home data={this.state.userData} />}
            />
          ) : (
            <Route exact path="/" component={NewLogin} />
          )}
          <Route exact path="/" component={NewLogin} />

          <Route path="/signup" exact component={Signup} />
          <Route path="/setup" exact component={AvatarBio} />
          <Route path="/account/:userId" exact component={AccountPage} />
          <Route path="/home/navigate" exact component={Navigate} />
        </Switch>
      </BrowserRouter>
    );
  }
}
export default App;
