import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import '@mantine/carousel/styles.css';
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './AuthContext'; // Import the AuthProvide
import Registration from "./pages/Registration.jsx"
import Login from "./pages/Login.jsx"
import { MantineProvider } from '@mantine/core';
import EditProfile from './pages/EditProfile.jsx'
import FindAFlat from './pages/FindAFlat.jsx'
import AddListing from "./pages/AddListing.jsx"


const router= createBrowserRouter([
  {
    path: "/registration",
    element: <Registration></Registration> 
  },
  {
    path: "/login",
    element: <Login></Login> 
  },
  {
    path: "/editprofile",
    element: <EditProfile></EditProfile> 
  },
  {
    path: "/",
    element: <App></App>
  },
  {
    path: "/findaflat",
    element: <FindAFlat></FindAFlat>
  },
  {
    path: "/addListing",
    element: <AddListing></AddListing>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <MantineProvider>
        <RouterProvider router={router}/>
      </MantineProvider>
    </AuthProvider>
  </React.StrictMode>,
)