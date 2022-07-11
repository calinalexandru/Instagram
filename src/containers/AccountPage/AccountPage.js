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

  const [myDetails, setMyDetails] = useState({
    signedInUser: "",
  });

  const [isFollowing, setIsFollowing] = useState(false);

  let username = props.match.url.split("/")[2].substring(1);

  const toggleModalHandler = (toggle, id, imageURL) => {
    setSelectedPostData({
      id: id,
      imageURL: imageURL,
    });
    showModal(toggle);
  };
  console.log(posts);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setMyDetails({
          signedInUser: auth.currentUser.displayName,
        });
      } else {
        props.history.replace("/");
      }
    });
  }, []);
  console.log("isFollowing", isFollowing);
  useEffect(() => {
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
          console.log(doc.data()["followersList"]);
          setUserDetails({
            followers: doc.data()["followersList"].length,
            following: doc.data()["followingList"].length,
            bio: doc.data()["bio"],
            profilePic:
              doc.data()["avatarURL"] ||
              "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
          });
        });
      });

    db.collection("users")
      .where("username", "==", username)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          if (doc.data()["followersList"].includes(myDetails.signedInUser)) {
            setIsFollowing(true);
          } else {
            setIsFollowing(false);
          }
        });
      });
  }, [username, myDetails.signedInUser]);

  const followHandler = () => {
    db.collection("users")
      .where("username", "==", username)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            followersList: firebase.firestore.FieldValue.arrayUnion(
              myDetails.signedInUser
            ),
          });
        });
      });

    db.collection("users")
      .where("username", "==", myDetails.signedInUser)
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
    db.collection("users")
      .where("username", "==", username)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            followersList: firebase.firestore.FieldValue.arrayRemove(
              myDetails.signedInUser
            ),
          });
        });
      });

    db.collection("users")
      .where("username", "==", myDetails.signedInUser)
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
    <div>
      {modal && (
        <ImageModal
          image={selectedPostData.imageURL}
          id={selectedPostData.id}
          toggleModalHandler={toggleModalHandler}
        />
      )}

      <NewNavbar signedinUsername={myDetails.signedInUser} />

      <div className={classes.mainDiv}>
        <div className={classes.profileInfo}>
          <div className={classes.avatar}>
            <img src={userDetails["profilePic"]} alt=""></img>
            <p>{username}</p>
          </div>

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
            {myDetails.signedInUser !== username && !isFollowing
              ? followButton
              : null}
            {myDetails.signedInUser !== username && isFollowing
              ? unFollowButton
              : null}
            <p>{userDetails["bio"]}</p>
          </div>
        </div>

        <div className={classes.parent}>
          {posts.length
            ? posts.map((post) => (
                <div
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
export default AccountPage;
