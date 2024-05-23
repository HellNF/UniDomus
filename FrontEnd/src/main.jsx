import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './AuthContext'; // Import the AuthProvide
import Registration from "./pages/Registration.jsx"
import Login from "./pages/Login.jsx"

import EditProfile from './pages/EditProfile.jsx'
import FindAFlat from './pages/FindAFlat.jsx'
import FindATenant from './pages/FindATenant.jsx'
import AddListing from "./pages/AddListing.jsx"
import PasswordReset from './pages/PasswordReset.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import MatchDisplayer from './pages/MatchDisplayer.jsx'
import TestPage from './pages/TestPage.jsx'
import ListingDetails from './pages/ListingDetails.jsx'
import TenantDetails from './pages/TenantDetails.jsx'
import Layout from './components/Layout'; // Import the Layout component
import ChatsList from './pages/ChatsList';
import Chat from './components/Chat';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <App />
      </Layout>
    ),
  },
  {
    path: '/registration',
    element: (
      <Layout>
        <Registration />
      </Layout>
    ),
  },
  {
    path: '/login',
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    path: '/editprofile',
    element: (
      <Layout>
        <EditProfile />
      </Layout>
    ),
  },
  {
    path: "/findatenant",
    element: <FindATenant></FindATenant>
  },
  {
    path: "/findatenant/:id",
    element: <TenantDetails></TenantDetails>
  },
  {
    path: "/",
    element: <App></App>
  },
  {
    path: '/findaflat',
    element: (
      <Layout>
        <FindAFlat />
      </Layout>
    ),
  },
  {
    path: '/findaflat/:id',
    element: (
      <Layout>
        <ListingDetails />
      </Layout>
    ),
  },
  {
    path: '/addListing',
    element: (
      <Layout>
        <AddListing />
      </Layout>
    ),
  },
  {
    path: '/forgotpassword',
    element: (
      <Layout>
        <ForgotPassword />
      </Layout>
    ),
  },
  {
    path: '/resetpassword/:token',
    element: (
      <Layout>
        <PasswordReset />
      </Layout>
    ),
  },
  {
    path: '/matches/:id',
    element: (
      <Layout>
        <MatchDisplayer />
      </Layout>
    ),
  },
  {
    path: '/test',
    element: (
      <Layout>
        <TestPage />
      </Layout>
    ),
  },{
    path: "/chats",
    element: (
      <Layout>
        <ChatsList />
       </Layout>),
  },
  {
    path: "/chat/:matchID",
    element: (
     <Layout>
        <Chat />
     </Layout>
      )
  }

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="761215580808-bhje7mp4bnl80einl3ri0db5bb1sk0kn.apps.googleusercontent.com">
      <AuthProvider>

        <RouterProvider router={router} />

      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
