import React, { useState } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import Button from "react-bootstrap/Button";
import { db, auth } from "../Firebase/Firebase";
import classes from "./NewLogin.module.css";

const NewLogin = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            db.collection("users")
              .where("username", "==", user.displayName) // check if the user exists in the db
              .onSnapshot((snapshot) => {
                snapshot.docs.map((doc) => {
                  localStorage.setItem("isAuthenticated", "true"); // set the flag as true in localstorage
                  localStorage.setItem("displayName", auth.currentUser.displayName); // set displayname (username) in localstorage
                  let data = doc.data(); // send the user data as prop to home component and redirect
                  props.history.push({
                    pathname: "/home",
                    state: data,
                  });
                });
              });
          } else {
            props.history.replace("/");
          }
        });
      })

      .catch((err) => {
        props.history.replace("/");
        alert(err.message);
      });
  };

  return (
    <div className={classes.loginFormContainer}>
      <form className={classes.loginForm}>
        <div className={classes.brand}>Instagram</div>
        <p className={classes.message}>
          Sign up to see photos and videos
          <br />
          from your friends
        </p>
        <div className={classes.inputControl}>
          <input
            className={classes.input}
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={classes.input}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={submitHandler}
            type="submit"
            className={classes.loginbtn}
            variant="primary"
            size="md"
          >
            Log In
          </Button>
        </div>
      </form>
      <h6 classname={classes.linkToSignup}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </h6>
    </div>
  );
};

export default withRouter(NewLogin);
