import firebase from "firebase/app";
import "firebase/auth";

export const auth = firebase.initializeApp( {
    apiKey: "AIzaSyBvZha0SW8k6T7u2AHb4LcYaVOjlxkjnao",
    authDomain: "tshat-a61ac.firebaseapp.com",
    projectId: "tshat-a61ac",
    storageBucket: "tshat-a61ac.appspot.com",
    messagingSenderId: "936018423904",
    appId: "1:936018423904:web:47b3525d968958496d9305"
  }).auth();