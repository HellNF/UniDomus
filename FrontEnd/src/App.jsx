import React from 'react';
import { useAuth } from './AuthContext'; // Import the useAuth hook
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import ImageSlider from './components/ImageSlider'
function App() {
  const { isLoggedIn } = useAuth(); // Access authentication state using useAuth hook
  const slides=["https://i.ibb.co/ncrXc2V/1.png",
    "https://i.ibb.co/B3s7v4h/2.png",
    "https://i.ibb.co/XXR8kzF/3.png",
    "https://i.ibb.co/yg7BSdM/4.png"]
  return (
    <div className="App">
      <Navbar current={'Home'}/>
      <Homepage />
      <div className='w-80'>
      <ImageSlider>
        {slides.map((element,id)=>(
            <img src={element} alt="ciao" key={element}/>
        ))}
      </ImageSlider>
      </div>
      
    </div>
  );
}

export default App;
