import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Helper function to parse JWT and extract data
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1]; // Get payload from the token
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to parse JWT:", error);
        return null;
    }
};

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [sessionToken, setSessionToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null); 

    // Check if session token exists in local storage on component mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            const decoded = parseJwt(storedToken);
            if (decoded && decoded.id) { // Check for 'id' instead of 'userId'
                setSessionToken(storedToken);
                setUserId(decoded.id); // Use 'id' as the userId
                setIsAdmin(decoded.isAdmin);
            } else {
                console.error('Token is invalid or does not contain id.');
            }
        }
    }, []);

    // Function to handle user login with session token
    const login = (token) => {
        const decoded = parseJwt(token);
        if (decoded && decoded.id) { // Check for 'id' instead of 'userId'
            localStorage.setItem('token', token);
            setSessionToken(token);
            setUserId(decoded.id); // Use 'id' as the userId
        } else {
            console.error('Login failed: Invalid token or id missing.');
        }
    };

    // Function to handle user logout
    const logout = () => {
        localStorage.removeItem('token');
        setSessionToken(null);
        setUserId(null);
    };

    // Derive isLoggedIn state based on the presence of sessionToken
    const isLoggedIn = !!sessionToken;

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, sessionToken,isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
