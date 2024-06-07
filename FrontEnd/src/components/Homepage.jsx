// /src/components/HomePage.jsx
import React from "react";
import UniDomusLogo from "/UniDomusLogo.png";
import sections from "../sections/homePage"; // Ensure you import sections correctly
import { useAuth } from "../AuthContext";
import findUserSVG from "../assets/findUser.svg";
import findHouseSVG from "../assets/findHouse.svg";
import flatSVG from "../assets/flat.svg";
import chatsSVG from "../assets/chats.svg";
import signInSVG from "../assets/signIn.svg";
import signUpSVG from "../assets/signUp.svg";
import hearthSVG from "../assets/hearth.svg";
import userSVG from "../assets/user.svg"

export default function HomePage() {
  const { isLoggedIn } = useAuth();

  const images = {
    user: userSVG,
    findUser: findUserSVG,
    findHouse: findHouseSVG,
    flat: flatSVG,
    chats: chatsSVG,
    signIn: signInSVG,
    signUp: signUpSVG,
    hearth: hearthSVG
  };


  return (
    <>
      <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 px-6 py-12 lg:px-8">
        <div className="bg-white mx-auto shadow-md rounded-lg p-6 w-full sm:max-w-3xl text-center">
          <img
            className="mx-auto h-36 w-auto"
            src={UniDomusLogo}
            alt="UniDomus"
          />
          <h2 className="mt-8 text-4xl font-extrabold text-gray-900">
            Benvenuti in UniDomus
          </h2>
          <p className="mt-4 text-lg text-gray-700">
          Esplora la nostra piattaforma e trova la tua sistemazione da sogno!
          </p>

          <div className="mt-10 sm:w-full">
            <div className="grid  grid-cols-1 sm:grid-cols-2 gap-7">
            {sections
                .filter((section) => {
                  if (!isLoggedIn && (section.title === "Il tuo profilo" || section.title === "La tua inserzione" || section.title === "Matches" || section.title === "Chats")) {
                    return false;
                  }
                  if (isLoggedIn && (section.title === "Loggin" || section.title === "Registrati")) {
                    return false;
                  }
                  return true;
                })
                .map((section) => (
                  <button
                    key={section.title}
                    onClick={() => window.location.href = section.link}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ease-in-out"
                  >
                    <img height="40px" width="40px" src={images[section.image]} alt="unban" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {section.title}
                      </h3>
                      <p className="mt-1 text-gray-600" style={{ whiteSpace: 'pre-line' }}>
                        {section.description}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
