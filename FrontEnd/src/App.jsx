import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import LoginForm from './components/LoginForm'; // Import the LoginForm component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage authentication

  // Function to handle login
  const handleLogin = () => {
    // Implement your login logic here (e.g., make a request to your backend)
    // Upon successful authentication, update the isLoggedIn state
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    // Implement your logout logic here (e.g., clear any stored authentication tokens)
    // Then, update the isLoggedIn state
    setIsLoggedIn(false);
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} /> {/* Pass isLoggedIn state and logout function to Navbar */}
      {/* Render the LoginForm component */}
      <Homepage></Homepage>
    </>
  );
}

export default App;
