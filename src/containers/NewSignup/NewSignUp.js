import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { db, auth } from "../Firebase/Firebase";
import Button from "react-bootstrap/Button";
import classes from "./newsignup.module.css";

const Signup = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      return () => unsubscribe();
    });
  }, [user]);

  const signup = (event) => {
    event.preventDefault();

    db.collection("users")
      .where("username", "==", username)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          localStorage.setItem("isAuthenticated", "true");
          
          return auth.createUserWithEmailAndPassword(email, password);
        } else {
          console.log("username already taken");
          throw new Error("Username already taken");
        }
      })
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
          photoURL:
            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
        });
      })
      .then(() => {
        db.collection("users").add({
          username: username,
          followers: 0,
          following: 0,
          bio: "",
          avatarURL: "",
          followingList: [],
          followersList: [],
        });
        localStorage.setItem("displayName", auth.currentUser.displayName);
      })
      .then(()=> {
        let data = {
            avatarURL: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
            username: username
        }
        fetch(
          "https://instaclone-77c8f-default-rtdb.firebaseio.com/usernames.json",
          {
            method : "POST",
            body : JSON.stringify(data)
          }
        )
      })
      .then(() => {
        props.history.push("/setup");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className={classes.signupFormContainer}>
      <form className={classes.signupForm}>
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
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className={classes.input}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={signup}
            type="submit"
            className={classes.signupbtn}
            variant="primary"
            size="md"
          >
            Sign up
          </Button>
        </div>
      </form>
      <h6 className={classes.linkToLogin}>
        Have an account? <Link to="/">Log In</Link>
      </h6>
    </div>
  );
};
export default withRouter(Signup);
