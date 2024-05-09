import React from 'react';
import { useAuth } from './AuthContext'; // Import the useAuth hook
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';

function App() {
  const { isLoggedIn } = useAuth(); // Access authentication state using useAuth hook

  return (
    <div className="App">
      <Navbar current={'Home'}/>
      <Homepage />
    </div>
  );
}

export default App;
