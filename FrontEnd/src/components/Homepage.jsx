import React from "react";
import UniDomusLogo from "/UniDomusLogo.png";
import { Link } from "react-router-dom"; // Import Link from react-router-dom for navigation

export default function HomePage() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-28 w-auto"
            src={UniDomusLogo}
            alt="Unidomus"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome to UniDomus
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <p className="block text-center text-sm font-medium leading-6 text-gray-900">
                Explore our platform and find your dream accommodation!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
