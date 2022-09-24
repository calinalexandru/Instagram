import React, { useState } from "react";
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

  const nextButtonHandler = (event) => {
    event.preventDefault();
    if (avatar) {
      const upload = storage.ref(`profilepics/${avatar.name}`).put(avatar);

      upload.on("state_changed", () => {
        storage
          .ref("profilepics")
          .child(avatar.name)
          .getDownloadURL()
          .then((url) => {
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
                return url;
              })
              .then((url) => {
                auth.currentUser.updateProfile({
                  photoURL:
                    url ||
                    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
                });
              })
              .then(() => {
                props.history.replace("/home");
              });
          });
      });
    } else {
      db.collection("users")
        .where("username", "==", auth.currentUser.displayName)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) =>
            doc.ref.update({
              avatarURL:
                "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
              bio: bio,
            })
          );
        })
        .then(() => {
          auth.currentUser.updateProfile({
            photoURL:
              "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
          });
        })
        .then(() => {
          props.history.replace("/home");
        });
    }
  };

  return (
    <div className={classes.parent}>
      <form className={classes.form} onSubmit={nextButtonHandler}>
        <div className={classes.avatarContainer}>
          <img
            src={preview}
            height="350"
            width="350"
            alt=""
            className={classes.avatar}
          ></img>
        </div>

        <div className={classes.fileBioContainer}>
          <label htmlFor="files" className={classes.avatarLabel}>
            Select file
          </label>

          <input
            type="file"
            className={classes.hidden}
            id="files"
            onChange={(e) => getImageName(e.target.files[0])}
          ></input>

          <input
            type="text"
            placeholder="Bio"
            onChange={(e) => {
              setBio(e.target.value);
            }}
          ></input>
        </div>
        <button className={classes.next}>Next</button>
      </form>
    </div>
  );
};

export default AvatarBio;
