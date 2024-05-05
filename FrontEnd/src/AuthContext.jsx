import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [sessionToken, setSessionToken] = useState(null);

  // Check if session token exists in local storage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setSessionToken(storedToken);
    }
  }, []);

  // Function to handle user login with session token
  const login = (token) => {
    setSessionToken(token);
    // Store session token in local storage
    localStorage.setItem('token', token);
  };

  // Function to handle user logout
  const logout = () => {
    setSessionToken(null);
    // Remove session token from local storage
    localStorage.removeItem('token');
  };

  // Derive isLoggedIn state based on the presence of sessionToken
  const isLoggedIn = !!sessionToken;

  return (
    <AuthContext.Provider value={{ isLoggedIn, sessionToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
