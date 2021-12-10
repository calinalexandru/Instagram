import React, { Component } from 'react';
import { BrowserRouter, Redirect } from 'react-router-dom';
import {Route, Switch} from 'react-router';

import Login from './containers/Login/Login';
import Signup from './containers/Signup/Signup';
import Home from './containers/Home/Home';
import AccountPage from './containers/AccountPage/AccountPage';
import { db, auth } from './containers/Firebase/Firebase';

class App extends Component {
  state = {
    username:null, 
    followingList: []
  }
  componentDidMount(){
    auth.onAuthStateChanged(user => {
      if (user) {
        db.collection("users")
        .where("username", '==', user.displayName)
        .onSnapshot((snapshot) => {
            snapshot.docs.map(doc => {
              this.setState({
                username:user, 
                followingList: doc.data()['followingList']});        
            })
        })
      }
    });
  }

  render() {
      return (
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/account/:userId" exact component={AccountPage}/>
            {this.state.username!==null?<Route path="/home/" exact 
            render={()=><Home 
              signedinUser={this.state.username.displayName}
              followingList={this.state.followingList}
            />}/>
            : <Redirect to="/"/>}
          </Switch>

        </BrowserRouter>
        );
      }
    }
export default App;
