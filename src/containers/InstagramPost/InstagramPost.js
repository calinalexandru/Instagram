import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import classes from "./Instagram.module.css";
import { db } from '../Firebase/Firebase';

const InstagramPost = (props) => {
  
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    
    let unsubscribe;
      unsubscribe = db.collection('posts')
      .doc(props.postId)
      .collection("comments")
      .onSnapshot(snapshot => {
        setComments(snapshot.docs.map(doc => doc.data()))
      })
    
    return () => unsubscribe();
    
  }, []) //or [comment]

  const addCommentHandler = (event) => {
    event.preventDefault();
    db.collection('posts')
    .doc(props.postId)
    .collection('comments')
    .add({
      text: comment,
      username: props.signedInUsername
    });
    setComment('');
    };

    return (
      <div>
        <Card className={classes.card}>
          <Card.Header className={classes.header}>
            {props.postUsername}
          </Card.Header>

          <Card.Img
            className={classes.img}
            variant="top"
            src={props.imageURL}
          />
          <Card.Body className={classes.body}>
            <Card.Text className={classes.text} style={{fontWeight:'600'}}>
              {props.postUsername}
            </Card.Text>
            <Card.Text className={classes.text}>{props.caption}</Card.Text>
          </Card.Body>
          
          <div style={{margin:"0", padding:"0"}}>
                {comments.map(comment => (
                  <p style={{marginTop:"0"}}>
                    <span>{comment.username}</span> {comment.text}
                  </p>
                ))}
          </div>
          <hr />
          <div>
            <div className={classes.textareaContainer}>

              <div style={{ width: "100%", height: "100%" }}>
                <textarea value={comment}
                rows="1" className={`form-control ${classes.textarea}`}
                  placeholder="Add a comment..."
                  onChange={e => {setComment(e.target.value)}}
                ></textarea>
              </div>


              <div >
                <button type="submit" className={classes.post}
                onClick={addCommentHandler}
                >Post</button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
}
export default InstagramPost;
