// /src/sections/homePage.jsx
import React from "react";
import findUser from "../assets/findUser.svg";
import findHouse from "../assets/findHouse.svg";
import flat from "../assets/flat.svg";
import chats from "../assets/chats.svg";
import signIn from "../assets/signIn.svg";
import signUp from "../assets/signUp.svg";
import hearth from "../assets/hearth.svg";
import user from "../assets/user.svg"

const sections = [
  {
    title: "Trova un Appartamento",
    description: "Sfoglia i nostri annunci per trovare l'appartamento perfetto",
    link: "/findaflat",
    image: "findHouse",
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
    title: "Trova un Coinquilino",
    description: "Entra in contatto con persone che cercano casa",
    link: "/findatenant",
    image: "findUser",
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
    title: "Il tuo profilo",
    description: "Modifica il profilo affinchè gli altri utenti possano conoscerti al meglio",
    link: "/editprofile",
    image: "user",
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
    title: "La tua inserzione",
    description: "Diventa inserzionista e pubblica il tuo appartamento con noi",
    link: "/addListing",
    image: "flat",
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
    title: "Matches",
    description: "Controlla le tue richieste di Match, accettale o rifiutale",
    link: "/matches/index",
    image: "hearth",
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
  {
    title: "Chats",
    description: "Entra in contatto diretto con i tuoi Match e scambiatevi informazioni",
    link: "/chat/index",
    image: "chats",
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
  }
  ,
  {
    title: "Registrati",
    description: "Registrati alla nostra piattaforma per accedere a tutte le funzionzlità",
    link: "/registration",
    image: "signUp",
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
  }
  ,
  {
    title: "Loggin",
    description: "Sei già registrato?\nAccedi al tuo account",
    link: "/login",
    image: "signIn",
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
  }
];

export default sections;
