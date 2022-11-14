import firebase from 'firebase/app'; // doing import firebase from 'firebase' or import * as firebase from firebase is not good practice. 
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

firebase.initializeApp({
  apiKey: "",
  authDomain: "instaclone-77c8f.firebaseapp.com",
  databaseURL: "https://instaclone-77c8f-default-rtdb.firebaseio.com",
  projectId: "instaclone-77c8f",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "G-G8Y2KWS3ZW"
});

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export {db, auth, storage};
