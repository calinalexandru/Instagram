import React, { useEffect, useState } from 'react';
import classes from './AccountPage.module.css';
import Navbar from '../Navbar/Navbar';
import firebase from 'firebase';
import { db, auth } from '../Firebase/Firebase';

const AccountPage = (props) => {

    const [images, setImages] = useState([]);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [signedInUser, setSignedInUser] = useState('');

    let username = props.match.url.split("/")[2].substring(1);

    
    useEffect(() => {
        
        auth.onAuthStateChanged(user => {
            if (user) {
                setSignedInUser(user.displayName)
            }
          });

        db.collection("posts")
        .where("username", '==', username)
        .onSnapshot((snapshot) => {
            setImages(snapshot.docs.map((doc) => doc.data()));
          });

        db.collection("users")
        .where("username", '==', username)
        .onSnapshot((snapshot) => {
            snapshot.docs.map(doc => {
                setFollowers(doc.data()['followersList'].length);
                setFollowing(doc.data()['followingList'].length);
            })
        })

    }, [])  
    
    const followHandler = () => {
        db.collection('users')
        .where("username", '==', username)
        .get().then(querySnapshot => {
            querySnapshot.forEach(doc => 
                doc.ref.update({
                "followersList": firebase.firestore.FieldValue.arrayUnion(signedInUser)
              }))
        })

        db.collection('users')
        .where("username", '==', signedInUser)
        .get().then(querySnapshot => {
            querySnapshot.forEach(doc => 
                doc.ref.update({
                "followingList": firebase.firestore.FieldValue.arrayUnion(username)
              }))
        })

    }
    let followButton = <button onClick={followHandler}>Follow</button>;
    return (
        <div>
            <Navbar/>

            <div className={classes.mainDiv}>
            
            <div className={classes.profileInfo}>
                <div className={classes.avatar}>
                    <img src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png" alt=""></img>
                </div>
                <div className={classes.stats}>
                    <div style={{display:'inline'}}>
                        <p className={`display-4`}>
                            {username}
                            {signedInUser!==username?followButton:null}
                        </p>  

                    </div>
                    <p><strong>86 </strong>posts 
                    <strong> {followers} </strong> Followers 
                    <strong> {following} </strong> Following</p>
                </div>
      
            </div>
           
                <div className={classes.parent}>
                    {images.map(image => (
                        <div className={classes.child}>
                            <img src={image.imageURL} key={image.imageURL} height="300" width="300"></img>
                        </div>
                    ))}
                </div>
            </div>
            

        </div>
    )
}
export default AccountPage