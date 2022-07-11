import React, { useEffect, useState } from "react";
import classes from "./PostModal.module.css";
import { db, storage, auth } from "../Firebase/Firebase";
import { Modal, Form, ProgressBar, Button } from "react-bootstrap";

const PostModal = (props) => {

  const [previewImage, setPreviewImage] = useState("");
  const [Image, setImage] = useState("");
  const [captionText, setCaptionText] = useState("");
  const [progress, setProgress] = useState(0);

  const getImageName = (file) => {
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  let caption,
    hr,
    uploadButton = [null, null, null];
  const firebaseFileUpload = () => {
    if (previewImage) {
      const upload = storage.ref(`images/${Image.name}`).put(Image);
      upload.on(
        "state_changed",

        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          setProgress(progress);
        },
        (error) => {
          alert(error);
        },
        () => {
          storage
            .ref("images")
            .child(Image.name)
            .getDownloadURL()
            .then((url) => {
              db.collection("posts").add({
                timestamp: new Date(),
                username: auth.currentUser.displayName,
                caption: captionText,
                imageURL: url,
                likes: 0,
                uid: auth.currentUser.uid,
                avatarURL: auth.currentUser.photoURL,
              });
              props.onHide();
              setPreviewImage("");
              setImage("");
              setProgress(0);
            });
        }
      );
    }
  };

  if (previewImage) {
    uploadButton = (
      <Button variant="primary" onClick={firebaseFileUpload}>
        Share
      </Button>
    );
    caption = (
      <div className={classes.caption}>
        <textarea
          style={{
            resize: "none",
            width: "100%",
            height: "100%",
            margin: "0",
            padding: "0",
          }}
          placeholder="Write a caption..."
          onChange={(e) => setCaptionText(e.target.value)}
        ></textarea>
      </div>
    );
    hr = <hr />;
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={() => setPreviewImage("")}>
        <Modal.Title id="contained-modal-title-vcenter">New Post</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className={classes.body}>
          <div
            style={{
              width: "50%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={previewImage}
              alt=""
              className={previewImage ? classes.imgVisible : classes.imgHidden}
            />
          </div>
          
        </div>
        <div style={{ width: "50%", margin:"0 auto" }}>{caption}</div>

        {/* <p className={`display-4 ${classes.text}`}
          style={!previewImage ? { visibility: "visible" } : { display: "none" }}
        >
          Drag photos here.
        </p> */}
        {hr}
        <div className={classes.progressBarDiv}>
          <ProgressBar
            animated
            now={progress}
            className={
              previewImage
                ? classes.progressBarVisible
                : classes.progressBarHidden
            }
          />
        </div>

        <div className={classes.formFile}>
          <Form.Group controlId="formFile" className="mb-1" size="lg">
            <Form.Control
              type="file"
              style={
                previewImage ? { display: "none" } : { visibility: "visible" }
              }
              onChange={(event) => {
                getImageName(event.target.files[0]);
              }}
            />
            {uploadButton}
          </Form.Group>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default PostModal;
