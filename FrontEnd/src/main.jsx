import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import { AuthProvider } from './AuthContext'; // Import the AuthProvider

// Importing components and pages
import App from './App';
import Registration from './pages/Registration';
import Login from './pages/Login';
import EditProfile from './pages/EditProfile';
import FindAFlat from './pages/FindAFlat';
import FindATenant from './pages/FindATenant.jsx'
import AddListing from './pages/AddListing';
import PasswordReset from './pages/PasswordReset';
import ForgotPassword from './pages/ForgotPassword';
import MatchDisplayer from './pages/MatchDisplayer';
import TestPage from './pages/TestPage';
import ListingDetails from './pages/ListingDetails';
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
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
