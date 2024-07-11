import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ChatEngine } from "react-chat-engine";
import { auth } from "../firebase";

import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Chats = () => {
    const history = useHistory();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        await auth.signOut();
        history.push("/");
    }

    const getFile = async (url) => {
        const response = await fetch(url);
        const data = await response.blob();
        return new File([data], "userPhoto.jpg", { type: "image/jpeg" });
    }

    useEffect(() => {
        console.log("Chats component mounted");
        if (!user) {
            console.log("No user found, redirecting to /");
            history.push("/");
            return;
        }

        console.log("User found:", user);

        axios.get("https://api.chatengine.io/users/me", {
            headers: {
                "project-id": process.env.REACT_APP_CHAT_ENGINE_ID,
                "user-name": user.email,
                "user-secret": user.uid,
            }
        })
        .then(() => {
            console.log("User authenticated with ChatEngine");
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching user from ChatEngine:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
            } else if (error.request) {
                console.error("Request data:", error.request);
            } else {
                console.error("Error message:", error.message);
            }

            let formdata = new FormData();
            formdata.append('email', user.email);
            formdata.append('username', user.email);
            formdata.append('secret', user.uid);

            getFile(user.photoURL).then((avatar) => {
                formdata.append("avatar", avatar, avatar.name);
                axios.post(
                    "https://api.chatengine.io/users",
                    formdata,
                    { headers: { "Private-Key": process.env.REACT_APP_CHAT_ENGINE_KEY } }
                )
                .then(() => {
                    console.log("New user created in ChatEngine");
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error creating user in ChatEngine:", error);
                    if (error.response) {
                        console.error("Response data:", error.response.data);
                        console.error("Response status:", error.response.status);
                        console.error("Response headers:", error.response.headers);
                    } else if (error.request) {
                        console.error("Request data:", error.request);
                    } else {
                        console.error("Error message:", error.message);
                    }
                });
            });
        });
    }, [user, history]);

    if (!user || loading) return "Loading...";

    return (
        <div className="chat-page">
            <div className="nav-bar">
                <div className="logo-tab">
                    Tshat
                </div>
                <div onClick={handleLogout} className="logout-tab">
                    Logout
                </div>
            </div>
            <ChatEngine
                height="calc(100vh - 66px)"
                projectID={process.env.REACT_APP_CHAT_ENGINE_ID}
                userName={user.email}
                userSecret={user.uid}
            />
        </div>
    )
}

export default Chats;