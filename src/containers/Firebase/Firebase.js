import firebase from 'firebase/app'; // doing import firebase from 'firebase' or import * as firebase from firebase is not good practice. 
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

firebase.initializeApp({
  apiKey: "AIzaSyDAIugNWhweic-7de2PtP18pn6CKe56u3M",
  authDomain: "instaclone-77c8f.firebaseapp.com",
  databaseURL: "https://instaclone-77c8f-default-rtdb.firebaseio.com",
  projectId: "instaclone-77c8f",
  storageBucket: "instaclone-77c8f.appspot.com",
  messagingSenderId: "456424503295",
  appId: "1:456424503295:web:074779c29d2446095b99ca",
  measurementId: "G-G8Y2KWS3ZW"
});

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export {db, auth, storage};