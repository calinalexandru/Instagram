import React, { useEffect, useState } from "react";
import NewNavbar from "../NewNavbar/NewNavbar";
import InstagramPost from "../InstagramPost/InstagramPost";
import { db } from "../Firebase/Firebase";

import classes from "./Home.module.css";

const Home = (props) => {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    console.log("Use Effect Ran")
    document.body.style.background = "#FAFAFA";

    for (const person of props.data.followingList) {

      db.collection("posts")
        .where("username", "==", person)
        .onSnapshot((snapshot) => {
          let data = snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }));

          if (localStorage.getItem("posts")) {
            let allPosts = JSON.parse(localStorage.getItem("posts"));
            allPosts.push(...data);
            localStorage.setItem("posts", JSON.stringify(allPosts));
          } else {
            localStorage.setItem("posts", JSON.stringify(data));
          }
        });
    }

    setPosts(JSON.parse(localStorage.getItem("posts")));
    localStorage.clear();
    
  }, [props]);

  if (
    props.data.followingList === undefined ||
    props.data.followingList.length === 0
  ) {
    return (
      <div>
        <NewNavbar />
        <div className={classes.homeContainer}>
          <h1
            style={{
              fontWeight: "100",
              textAlign: "center",
              padding: "10%",
              margin: "0",
            }}
          >
            Follow Some Accounts To See Posts
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NewNavbar />
      <div className={classes.homeContainer}>
        {posts?.map(({ id, post }) => {
          return (
            <InstagramPost
              avatarURL={post.avatarURL}
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
