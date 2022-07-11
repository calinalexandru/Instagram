import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import PostModal from "../Modals/PostModal";
import Search from "../Search/Search";
import { db, auth } from "../Firebase/Firebase";
import classes from "./Navbar.module.css";
import { withRouter } from "react-router";
class CustomNavbar extends Component {
  state = {
    modalShow: false,
  };

  modalTogglerHandler = (argument) => {
    this.setState({ modalShow: argument });
  };

  handleSignOut = () => {
    localStorage.clear();
    console.log("after logout", localStorage)
    auth().signOut();
    this.props.replace("/");
  };

  redirectToAccPage = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.props.history.push(`/account/:${user.displayName}`);
      }
    });
  };

  render() {
    return (
      <div>
        <Navbar expand="sm" className={classes.navbar}>
          <Container style={{ width: "100%", height: "3.5rem", display:"flex", alignItems:"center" }}>
            <Navbar.Brand
              className={classes.handwritten}
              onClick={() => {
                <Redirect to="/home" />;
              }}
            >
              Instagram
            </Navbar.Brand>

            <Search />

            <Nav>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "1rem",
                  zIndex: "9999",
                  border:"1px solid blue"
                }}
              >
                <img
                  src="https://img.icons8.com/material-rounded/24/000000/home.png"
                  alt=""
                  onClick={() => this.props.history.push("/home")}
                  width="30"
                  height="30"
                  className={classes.icon}
                />

                <svg
                  onClick={() => this.modalTogglerHandler(true)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className={`bi bi-plus-square ${classes.fondo}`}
                  viewBox="0 0 16 16"
                  style={{ marginRight: "20px" }}
                >
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                <img
                  src="https://img.icons8.com/ios/30/000000/compass--v1.png"
                  alt=""
                  style={{ marginRight: "20px" }}
                  onClick={()=>{this.props.history.push("/home/navigate")}}
                />
                <PostModal
                  show={this.state.modalShow}
                  onHide={() => this.modalTogglerHandler(false)}
                />

                <select
                  style={{
                    background: `url(${
                      auth.currentUser
                        ? auth.currentUser.photoURL
                        : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                    })`,
                    height: "30px",
                    width: "30px",
                    backgroundSize: "cover",
                    backgroundPosition: "top center",
                    borderRadius: "50%",
                  }}
                >
                  <option style={{ display: "none" }}></option>
                  <option onClick={() => this.redirectToAccPage()}>
                    Account
                  </option>
                  <option onClick={this.handleSignOut}>Log out</option>
                  <hr />
                </select>
              </div>
            </Nav>
          </Container>
        </Navbar>
      </div>
    );
  }
}
export default withRouter(CustomNavbar);
