import React, { useEffect, useState } from "react";
import classes from "./AccountPage.module.css";
import NewNavbar from "../NewNavbar/NewNavbar";
import firebase from "firebase";
import ImageModal from "../ImageModal/ImageModal";
import { db, auth } from "../Firebase/Firebase";
import Button from "react-bootstrap/Button";

const AccountPage = (props) => {
  const [modal, showModal] = useState(false);
  const [selectedPostData, setSelectedPostData] = useState({
    id: "",
    imageURL: "",
  });
  const [posts, setPosts] = useState([]);
  const [userDetails, setUserDetails] = useState({
    followers: 0,
    following: 0,
    bio: "",
    profilePic:
      "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
  });

  const [isFollowing, setIsFollowing] = useState(false);

  let username = props.match.url.split("/")[2].substring(1); // Extract the username from the URL

  const toggleModalHandler = (toggle, id, imageURL) => {
    /* 
    Handler function to pop up a modal for the selected post 
    */
    setSelectedPostData({
      id: id,
      imageURL: imageURL,
    });
    showModal(toggle);
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        props.history.replace("/");
      }
    });
  }, []);

  useEffect(() => {
    /* 
    this useEffect runs when you either visit your account page or somone else's
    and fetches all the data - profile pic, posts, followers, accounts followed
    */
    db.collection("posts")
      .where("username", "==", username)
      .onSnapshot((snapshot) => {
        let data = snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }));

        setPosts(data);
      });

    db.collection("users")
      .where("username", "==", username)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          setUserDetails({
            followers: doc.data()["followersList"].length,
            following: doc.data()["followingList"].length,
            bio: doc.data()["bio"],
            profilePic:
              doc.data()["avatarURL"] ||
              "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
          });
          
          // check if you are already following the visited account
          
          if (doc.data()["followersList"].includes(localStorage.displayName)) {
            
            setIsFollowing(true);
          } else {
            setIsFollowing(false);
          }
        });
      });
  }, [username, localStorage.displayName]);

  const followHandler = () => {
    /*
    This handler function updates your followingList and also followersList of the visted account
    */
    db.collection("users")
      .where("username", "==", username)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            followersList: firebase.firestore.FieldValue.arrayUnion(
              localStorage.displayName
            ),
          });
        });
      });

    db.collection("users")
      .where("username", "==", localStorage.displayName)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            followingList: firebase.firestore.FieldValue.arrayUnion(username),
          });
        });
      });
  };

  const unFollowHandler = () => {
    /*
      Same as followHandler except vice-versa
    */
    db.collection("users")
      .where("username", "==", username)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            followersList: firebase.firestore.FieldValue.arrayRemove(
              localStorage.displayName
            ),
          });
        });
      });

    db.collection("users")
      .where("username", "==", localStorage.displayName)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            followingList: firebase.firestore.FieldValue.arrayRemove(username),
          });
        });
      });
  };

  let followButton = <Button onClick={followHandler}>Follow</Button>;
  let unFollowButton = <Button onClick={unFollowHandler}>Unfollow</Button>;

  return (
    <div className={classes.imageModal}>
      {modal && (
        <ImageModal
          image={selectedPostData.imageURL}
          id={selectedPostData.id}
          toggleModalHandler={toggleModalHandler}
        />
      )}

      <NewNavbar signedinUsername={localStorage.displayName} />

      <div className={classes.mainDiv}>
        <div className={classes.profileInfo}>
          <div className={classes.avatar}>
            <img src={userDetails["profilePic"]} alt=""></img>
            <p>{username}</p>
          </div>

           // Display stats: # of posts, followers and accounts followed by you

          <div className={classes.stats}>
            <p>
              <strong>{posts.length} </strong>posts
            </p>
            <p>
              <strong> {userDetails["followers"]} </strong> Followers
            </p>
            <p>
              <strong> {userDetails["following"]} </strong> Following
            </p>
             /*
             Display the Follow Button when you are not already following the visited account
             Do not display the button if you visited your own account page
              */
            {(localStorage.displayName !== username && !isFollowing)
              ? followButton
              : null}
              /*
             Display the Unfollow Button when you are already following the visited account
             Do not display the button if you visited your own account page
              */
            {(localStorage.displayName !== username && isFollowing)
              ? unFollowButton
              : null}
            <p>{userDetails["bio"]}</p>
          </div>
        </div>

        // Display all posts
        <div className={classes.parent}>
          {posts.length
            ? posts.map((post) => (
                <div
                  key={post.id}
                  className={classes.child}
                  onClick={() =>
                    toggleModalHandler(true, post.id, post.post.imageURL)
                  }
                >
                  <img
                    className={classes.image}
                    src={post.post.imageURL}
                    key={post.post.imageURL}
                  ></img>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};
export default React.memo(AccountPage);
