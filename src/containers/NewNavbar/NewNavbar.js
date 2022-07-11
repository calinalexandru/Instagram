import React, { useState } from "react";
import { withRouter } from "react-router";
import Search from "../Search/Search";
import PostModal from "../Modals/PostModal";
import { auth } from "../Firebase/Firebase";
import classes from "./NewNavbar.module.css";
import Dropdown from "react-bootstrap/Dropdown";

const NewNavbar = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const [showNav, setShowNav] = useState(false);

  const modalTogglerHandler = (argument) => {
    setModalShow(argument);
  };

  const handleSignOut = () => {
    auth.signOut()
    .then(() => {
      localStorage.clear();
    })
    .then(() => {
      props.history.replace("/");
    })
  };

  const redirectToAccPage = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        props.history.push(`/account/:${user.displayName}`);
      } else {
        props.history.push("/");
      }
    });
  };
  return (
    <div className={classes.navbar}>
      <div className={classes.navbarContainer}>
        <div
          className={classes.logo}
          onClick={() => props.history.push("/home")}
        >
          Instagram
        </div>

        <Search />

        <div
          className={!showNav ? classes.openNav : classes.iconContainer}
          onClick={() => setShowNav(true)}
        >
          ☰
        </div>
        <div
          className={
            showNav ? classes.mobileIconContainer : classes.iconContainer
          }
        >
          <div className={classes.close} onClick={() => setShowNav(false)}>
            ✕
          </div>
          <div>
            <img
              src="https://img.icons8.com/material-rounded/24/000000/home.png"
              alt=""
              onClick={() => props.history.push("/home")}
              className={classes.icon}
            />
          </div>

          <svg
            onClick={() => modalTogglerHandler(true)}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={`bi bi-plus-square ${classes.fondo}`}
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <img
            className={classes.navigate}
            src="https://img.icons8.com/ios/30/000000/compass--v1.png"
            alt=""
            onClick={() => {
              props.history.push("/home/navigate");
            }}
          />
          <PostModal
            show={modalShow}
            onHide={() => modalTogglerHandler(false)}
          />
          
          <Dropdown>
            <Dropdown.Toggle style={{
              background: `url(${
                auth.currentUser
                  ? auth.currentUser.photoURL
                  : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
              })`,
              borderRadius: "50%",
              width: "25px",
              height: "25px",
              border: "1px solid grey",
              backgroundSize: "cover",
              backgroundPosition: "top center",
            }} id="dropdown-basic">
             
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={redirectToAccPage}>Account</Dropdown.Item>
              <Dropdown.Item onClick={handleSignOut} style={{color:"#cb202d"}}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          
        </div>
      </div>
    </div>
  );
};

export default withRouter(NewNavbar);
