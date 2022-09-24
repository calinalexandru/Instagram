import React, { useState, useEffect } from "react";
import { db } from "../Firebase/Firebase";
import classes from "./ImageModal.module.css";

const ImageModal = (props) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let unsubscribe = db
      .collection("posts")
      .doc(props.id)
      .collection("comments")
      .onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      });
    return () => unsubscribe();
  }, []);

  return (
    <div>
        <div className={classes.close}
          onClick={() => props.toggleModalHandler(false, "", "")}
        > X </div>
      <div className={classes.ModalContainer}>
        
        <div className={classes.Modal}>
          <img src={props.image} alt="" height="350" width="350" />
          <div className={classes.comments}>
            {comments.map((comment) => (
              <p>
                <strong>{comment.username}</strong> {comment.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
