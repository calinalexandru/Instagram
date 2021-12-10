import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import {Navbar, Container, Nav} from 'react-bootstrap';
import PostModal from '../Modals/PostModal';
import { auth } from '../Firebase/Firebase';
import classes from './Navbar.module.css';
import { withRouter } from "react-router";

class CustomNavbar extends Component {

  state = { 
    modalShow: false, 
    username: null
  }

  modalTogglerHandler = (argument) => {
    this.setState(
          {modalShow: argument});
  }

  handleSignOut = () => {
    auth.signOut();
    this.props.history.push("/");
  }

  redirectToAccPage = () => {
    auth.onAuthStateChanged(user => {

      if (user) 
      this.props.history.push(`/account/:${user.displayName}`)

    });
   
  }
  render(){

    return (
      <div style={{position:"sticky"}}>
        <Navbar expand="sm" className = {classes.navbar}>
          <Container style={{width:"100%"}}>

            <Navbar.Brand className={classes.handwritten} onClick={()=> {<Redirect to="/home"/>}}>
              Instagram 
            </Navbar.Brand>
              <Nav>
                <div>
                    <img src="https://img.icons8.com/material-rounded/24/000000/home.png" alt = ""
                    onClick={() => this.props.history.push("/home")}
                    width= '30' height='30' 
                    className={classes.icon}/>

                    <svg onClick = {() => this.modalTogglerHandler(true)} 
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                      fill="currentColor"
                      className="bi bi-plus-square" viewBox="0 0 16 16">
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/> 
                    </svg>
                    <PostModal show={this.state.modalShow}
                      onHide={() => this.modalTogglerHandler(false)}/>
                      <button onClick={this.handleSignOut}>Sign out</button>
                      <button onClick={() => this.redirectToAccPage()}>Account Page</button>
                </div>
              </Nav>
          </Container>
        </Navbar>
        </div>
    )
  }
  
}
export default withRouter(CustomNavbar);