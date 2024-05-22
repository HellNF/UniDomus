// /src/sections/homePage.jsx
import React from "react";

const sections = [
  {
    title: "Find an Apartment",
    description: "Browse through our listings to find the perfect apartment.",
    link: "/findaflat",
    svg: (
      <svg
        className="h-8 w-8 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 7l1.38-1.38a4 4 0 015.66 0L12 7l1.96-1.96a4 4 0 015.66 0L21 7m-9 2a4 4 0 014 4v5a4 4 0 01-4 4H8a4 4 0 01-4-4v-5a4 4 0 014-4h4z"
        />
      </svg>
    ),
  },
  {
    title: "Find a Roommate",
    description: "Connect with people looking for roommates.",
    link: "/displayTenants",
    svg: (
      <svg
        className="h-8 w-8 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 14l9-5-9-5-9 5 9 5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 14l6.16-3.422A12.083 12.083 0 0112 19.838a12.083 12.083 0 01-6.16-9.26L12 14z"
        />
      </svg>
    ),
  },
  {
    title: "List Your Property",
    description: "Become a landlord and list your property with us.",
    link: "/addListing",
    svg: (
      <svg
        className="h-8 w-8 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 14l6-6M6 18V6a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2v-2H4a2 2 0 01-2-2v-8a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-2"
        />
      </svg>
    ),
  },
  {
    title: "Manage Listings",
    description: "Edit or remove your existing property listings.",
    link: "/manageListings",
    svg: (
      <svg
        className="h-8 w-8 text-yellow-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M11 5a2 2 0 014 0v2M5 7h14M4 15h16M6 9v10a2 2 0 002 2h8a2 2 0 002-2V9"
        />
      </svg>
    ),
  },
  {
    title: "Contact Support",
    description: "Get help and support for any issues you face.",
    link: "/support",
    svg: (
      <svg
        className="h-8 w-8 text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M18.364 5.636a9 9 0 110 12.728M12 9v2M12 15h.01"
        />
      </svg>
    ),
  },
  {
    title: "View Matches",
    description: "Check your match requests and accept or decline them.",
    link: "/matches/index",
    svg: (
      <svg
        className="h-8 w-8 text-pink-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13.828 9.172a4 4 0 11-5.656 5.656M7.172 4.828a4 4 0 015.656 5.656m0 0a4 4 0 11-5.656-5.656M17 17h.01"
        />
      </svg>
    ),
  },
];

export default sections;
