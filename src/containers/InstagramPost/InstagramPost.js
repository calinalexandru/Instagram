import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import classes from "./Instagram.module.css";
import { auth, db } from "../Firebase/Firebase";
import { useHistory } from "react-router-dom";

const InstagramPost = (props) => {

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const history = useHistory();

  useEffect(() => {
    let unsubscribe;
    unsubscribe = db
      .collection("posts")
      .doc(props.postId)
      .collection("comments")
      .onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      });

    return () => unsubscribe();
  }, [props.postId]);

  const addCommentHandler = (event) => {
    event.preventDefault();
    db.collection("posts")
      .doc(props.postId)
      .collection("comments")
      .add({
        text: comment,
        username: auth.currentUser.displayName,
        avatar:
          auth.currentUser.photoURL ||
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
      });
    setComment("");
  };

  const redirectToAccount = (event) => {
    history.push(`/account/:${event.target.textContent}`);
  };

  return (
    <Card className={classes.card}>
      <Card.Header>
        <div className={classes.avatarUsername} onClick={redirectToAccount}>
          <div className={classes.avatar}>
            <img
              className={classes.avatarURL}
              style={{
                borderRadius: "50%",
              }}
              src={
                props.avatarURL ||
                "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
              }
              alt=""
            />
          </div>

          <div className={classes.postUsername}>{props.postUsername}</div>
        </div>
      </Card.Header>

      <Card.Img className={classes.img} variant="top" src={props.imageURL} />

      <div className={classes.body}>
        <Card.Text className={classes.text} onClick={redirectToAccount}>
          {props.postUsername}
        </Card.Text>
        <Card.Text className={classes.text}>{props.caption}</Card.Text>
      </div>

      <div style={{ margin: "0", padding: "0" }}>
        {comments.map((comment) => (
          <div key={Math.random()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "2%",
              }}
            >
              <div style={{ marginLeft: "3%" }}>
                <img
                  className={classes.avatarURL}
                  style={{
                    borderRadius: "50%",
                  }}
                  src={
                    comment.avatar ||
                    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                  }
                  alt=""
                />
              </div>
              <div className={classes.comment} onClick={redirectToAccount}>
                {comment.username}
              </div>

              <div className={classes.username}>{comment.text}</div>
            </div>
          </div>
        ))}
      </div>
      <hr className={classes.hr} />
      <div>
        <div className={classes.textareaContainer}>
          <textarea
            value={comment}
            rows="1"
            className={classes.textarea}
            placeholder="Add a comment..."
            onChange={(e) => {
              setComment(e.target.value);
            }}
          ></textarea>

          <div>
            <button
              type="submit"
              className={classes.post}
              onClick={addCommentHandler}
              disabled={!comment}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default InstagramPost;
