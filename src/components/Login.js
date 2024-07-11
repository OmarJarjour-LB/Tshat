import React from 'react'
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons'
import firebase from "firebase/app"; 
import { auth } from '../firebase'
import { useHistory } from 'react-router-dom'; // Added this import

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        console.log("Firebase Auth Persistence set to LOCAL");
    })
    .catch((error) => {
        console.error("Error setting persistence:", error);
    });

const Login = () => {
    const history = useHistory();

    const handleGoogleSignIn = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await auth.signInWithPopup(provider);
            console.log("Google Sign-In Result:", result); // Debugging line
            history.push("/chats");
        } catch (error) {
            console.error("Error during Google Sign-In:", error);
        }
    };

    return (
        <div id= "login-page">
            <div id= "login-card">
                <h2> Welcome to Tshat </h2>
                <div className="login-button google"
                onClick={handleGoogleSignIn} >

                <GoogleOutlined /> Sign in with Google       
                </div>

                <br/> <br/>

                <div className="login-button facebook"
                onClick={() => auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider())}>
                <FacebookOutlined /> Sign in with Facebook      
                </div>

            </div>
        </div>
    );
}

export default Login;