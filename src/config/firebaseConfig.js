import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCR6rGGtaxA-nXF1DBysn9kX93v6bmPWUU",
  authDomain: "todo-rrf-316-95894.firebaseapp.com",
  databaseURL: "https://todo-rrf-316-95894.firebaseio.com",
  projectId: "todo-rrf-316-95894",
  storageBucket: "todo-rrf-316-95894.appspot.com",
  messagingSenderId: "219298792370",
  appId: "1:219298792370:web:77205a9753c0406f22daab",
  measurementId: "G-CBENGZVRTB"
};
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;
