import React, { useState, useRef } from "react";
import classes from "./AvatarBio.module.css";
import { db, auth, storage } from "../Firebase/Firebase";

const AvatarBio = (props) => {
  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
  );
  const [bio, setBio] = useState("");

  const getImageName = (file) => {
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const nextButtonHandler = () => {
    if (avatar.name) {
      storage
        .ref(`avatar/${avatar.name}`)
        .put(avatar)
        .then(() => {
          storage
            .ref("avatar")
            .child(avatar.name)
            .getDownloadURL()
            .then((url) => {
              console.log(url);
              db.collection("users")
                .where("username", "==", auth.currentUser.displayName)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) =>
                    doc.ref.update({
                      avatarURL:
                        url ||
                        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
                      bio: bio,
                    })
                  );
                })
                .then(() => {
                  auth.currentUser.updateProfile({
                    photoURL:
                      url ||
                      "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
                  });
                });
            });
        })
        .then(() => {
          props.history.push("/home");  
        });
    } else {
      props.history.push("/home");
    }
  };

  return (
    <div className={classes.parent}>
      <form className={classes.form}>
        <div className={classes.avatarContainer}>
          <img
            src={preview}
            height="350"
            width="350"
            alt=""
            className={classes.avatar}
          ></img>
        </div>

        <div>
          <input
            className={classes.input}
            type="file"
            onChange={(e) => getImageName(e.target.files[0])}
          ></input>
        </div>

        <div className={classes.overlay}></div>

        <div className={classes.bio}>
          <input
            type="text"
            placeholder="Bio"
            onChange={(e) => {
              setBio(e.target.value);
            }}
          ></input>
        </div>
      </form>
      <button className={classes.next} onClick={nextButtonHandler}>
        Next
      </button>
    </div>
  );
};

export default AvatarBio;
