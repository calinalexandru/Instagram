import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import InstagramPost from "../InstagramPost/InstagramPost";
import { db } from "../Firebase/Firebase";
import { Container } from "react-bootstrap";
import classes from "./Home.module.css";
const Home = (props) => {
  
  const [posts, setPosts] = useState([]);
  document.body.style = "background: #FAFAFA;";

  useEffect(() => {
    props.followingList.map((person) => {
      db.collection("posts")
        .where("username", "==", `${person}`)
        .onSnapshot((snapshot) => {
          let data = snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
          setPosts(data)
        });
    });
  }, []);
  console.log(posts)
  return (
    <div>
      <Navbar />
      <Container className={classes.homeContainer}>
        <div>
          {posts.map(({ id, post }) => {
            console.log(post)
            return (
              <InstagramPost
                signedInUsername={props.signedinUser}
                key={id}
                postId={id}
                postUsername={post.username}
                imageURL={post.imageURL}
                caption={post.caption}
              />
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default Home;
