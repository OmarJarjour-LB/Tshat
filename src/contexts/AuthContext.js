import React, {useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { auth } from '../firebase';

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log("Auth State Changed:", user); // Debugging line
            setUser(user);
            setLoading(false);
            if (user) {
                console.log("User is authenticated, redirecting to /chats");
                history.push('/chats');
            } else {
                console.log("User is not authenticated, redirecting to /");
                history.push('/');
            }
        });

        return () => unsubscribe();
    }, [history]);

    const value = { user };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}