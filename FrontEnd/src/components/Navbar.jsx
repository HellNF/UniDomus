import React from "react";
import { Link } from "react-router-dom";
import UniDomusLogo from "/UniDomusLogo.png"; // Import the logo image

function Navbar({ isLoggedIn, onLogout }) {
  return (
    <>
      <div className="object-top flex flex-row bg-blue-950 text-blue-100 font-bold justify-around">
        <div className="object-left flex items-center mx-10">
          {/* Render the logo */}
          <img src={UniDomusLogo} alt="UniDomus Logo" className="w-16" />
        </div>
        <div className="object-center flex flex-row text-center">
          <Link className="m-4 p-4 hover:text-blue-400"><p>Home</p></Link>
          <Link className="m-4 p-4 hover:text-blue-400"><p>Trova appartamento</p></Link>
          <Link className="m-4 p-4 hover:text-blue-400"><p>Trova coinquilino</p></Link>
        </div>
        <div className="object-right -mx-7">
          {/* Conditionally render login or logout button based on isLoggedIn state */}
          {isLoggedIn ? (
            <button onClick={onLogout} className="bg-blue-500 m-4 p-3 border-1 rounded-lg hover:text-blue-500 hover:bg-blue-100">
              Log out
            </button>
          ) : (
            <>
             <Link to="/registration">
                <button className="bg-blue-500 m-4 p-3 border-1 rounded-lg hover:text-blue-500 hover:bg-blue-100">
                  Sign up
                </button>
              </Link>
              <Link to="/login">
                <button className="bg-blue-500 m-4 p-3 border-1 rounded-lg hover:text-blue-500 hover:bg-blue-100">
                  Log in
                </button>
              </Link>
             
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
