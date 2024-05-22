// /src/components/HomePage.jsx
import React from "react";
import UniDomusLogo from "/UniDomusLogo.png";
import { Link } from "react-router-dom";
import sections from "../sections/homePage"; // Ensure you import sections correctly

export default function HomePage() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6 py-12 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6 w-full sm:max-w-2xl text-center">
          <img
            className="mx-auto h-36 w-auto"
            src={UniDomusLogo}
            alt="UniDomus"
          />
          <h2 className="mt-8 text-4xl font-extrabold text-gray-900">
            Welcome to UniDomus
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Explore our platform and find your dream accommodation!
          </p>

          <div className="mt-10 sm:w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {sections.map((section) => (
                <Link
                  key={section.title}
                  to={section.link}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ease-in-out"
                >
                  <div className="flex-shrink-0">{section.svg}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {section.title}
                    </h3>
                    <p className="mt-1 text-gray-600">{section.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
