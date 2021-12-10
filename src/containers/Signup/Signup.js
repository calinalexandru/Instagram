import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { db, auth } from "../Firebase/Firebase";
import Button from "react-bootstrap/Button";
import classes from "./Signup.module.css";


const Signup = (props) => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        props.history.push("/home");

      } else {
        setUser(null);
      }
      return () => unsubscribe();
    });
  }, [user, username]);

  const signup = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        });
      })
      .then(()=>{
        db.collection('/users')
        .add({
          username: username,
          followers:0,
          following:0,  
          bio:"",
          avatarURL:"",
          followingList: [],
          followersList: []
        })
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className={classes.signupform}>
      <form>
        <p
          style={{
            fontFamily: "Grand Hotel",
            fontSize: "70px",
            marginTop: "-10%",
            marginBottom: "0.5%",
          }}
        >
          Instagram
        </p>

        <div className={classes.label}>
          <h5>
            Sign up to see photos and videos
            <br />
            from your friends
          </h5>
        </div>

        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        ></input>

        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        ></input>

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>

        <Button
          type="submit"
          onClick={signup}
          className={classes.signupbtn}
          variant="primary"
          size="md"
        >
          Sign up
        </Button>
      </form>
      <div className={classes.redirect}>
        Have an account? <Link to="/">Log In</Link>
      </div>
    </div>
  );
};
export default withRouter(Signup);
