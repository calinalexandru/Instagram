import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import classes from "./Login.module.css";
import Button from "react-bootstrap/Button";
import { auth } from "../Firebase/Firebase";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {

        auth.onAuthStateChanged(user => {
          if (user) props.history.push("/home")
        });
      
    })
      .catch((err) => {
        props.history.push("/");
        alert(err.message);
      });
  };

  return (
    <div className={classes.loginform}>
      <form>
        <p className={classes.brand}>Instagram</p>
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
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
      </form>
      <h6 id="signuplink" style={{ marginTop: "1%", textAlign: "center" }}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </h6>
    </div>
  );
};
export default withRouter(Login);
