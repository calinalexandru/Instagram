import React, { useEffect, useState } from "react";
import NewNavbar from "../NewNavbar/NewNavbar";
import InstagramPost from "../InstagramPost/InstagramPost";
import { db, auth } from "../Firebase/Firebase";

import classes from "./Home.module.css";

const Home = (props) => {
  const [posts, setPosts] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection("users")
          .where("username", "==", user.displayName)
          .onSnapshot((snapshot) => {
            snapshot.docs.map((doc) => {
              setData(doc.data());
            });
          });
      }
    });
  }, []);

  useEffect(() => {
    /*
    Logic to fetch all the posts from all accounts you're following.
    Loop over all the followed accounts, for every account fetch all the posts and append to the localstorage. 
    Save all the posts in state and clear localstorage
    */
    if (data.followingList) {
      for (const person of data.followingList) {
        db.collection("posts")
          .where("username", "==", person)
          .onSnapshot((snapshot) => {
            let data_ = snapshot.docs.map((doc) => ({
              id: doc.id,
              post: doc.data(),
            }));

            if (localStorage.getItem("posts")) {
              let allPosts = JSON.parse(localStorage.getItem("posts"));
              allPosts.push(...data_);
              localStorage.setItem("posts", JSON.stringify(allPosts));
            } else {
              localStorage.setItem("posts", JSON.stringify(data_));
            }
          });
      }
      setPosts(JSON.parse(localStorage.getItem("posts")));
      localStorage.removeItem("posts");
    }
  }, [props, data]);

  if (data.followingList === undefined || data.followingList.length === 0) { // fallback UI if no accounts followed
    return (
      <div style={{ background: "white", height: "100vh", maxHeight: "100%" }}>
        <NewNavbar />
        <div className={classes.homeContainer}>
          <h1 className={classes.noFollowingMessage}>
            Follow Some Accounts To See Posts
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "white" }}>
      <NewNavbar />
      <div className={classes.homeContainer}>
        {posts?.map(({ id, post }) => { // Loop over and display the posts from the accounts followed
          return (
            <InstagramPost
              avatarURL={
                post.avatarURL ||
                "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
              }
              key={id}
              postId={id}
              postUsername={post.username}
              imageURL={post.imageURL}
              caption={post.caption}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Home;
