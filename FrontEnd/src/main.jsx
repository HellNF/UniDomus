import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from './App.jsx';
import './index.css';
import { AuthProvider } from './AuthContext';
import Registration from "./pages/Registration.jsx";
import Login from "./pages/Login.jsx";
import EditProfile from './pages/EditProfile.jsx';
import DisplayTenants from './pages/displayTenants.jsx';
import FindAFlat from './pages/FindAFlat.jsx';
import AddListing from "./pages/AddListing.jsx";
import PasswordReset from './pages/PasswordReset.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import MatchDisplayer from './pages/MatchDisplayer.jsx';
import TestPage from './pages/TestPage.jsx';
import ListingDetails from './pages/ListingDetails.jsx';
import Chat from './components/Chat.jsx';
import ChatsList from './pages/ChatsList.jsx';

const router = createBrowserRouter([
  {
    path: "/registration",
    element: <Registration />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/editprofile",
    element: <EditProfile />
  },
  {
    path: "/displayTenants",
    element: <DisplayTenants />
  },
  {
    path: "/",
    element: <App />
  },
  {
    path: "/findaflat",
    element: <FindAFlat />
  },
  {
    path: "/findaflat/:id",
    element: <ListingDetails />
  },
  {
    path: "/addListing",
    element: <AddListing />
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />
  },
  {
    path: "/resetpassword/:token",
    element: <PasswordReset />
  },
  {
    path: "/matches/:id",
    element: <MatchDisplayer />
  },
  {
    path: "/test",
    element: <TestPage />
  },
  {
    path: "/chats",
    element: <ChatsList />
  },
  {
    path: "/chat/:matchID",
    element: <Chat />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
