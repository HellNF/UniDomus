import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './AuthContext'; // Import the AuthProvide
import Registration from "./pages/Registration.jsx"
import Login from "./pages/Login.jsx"

import EditProfile from './pages/EditProfile.jsx'

import AddListing from "./pages/AddListing.jsx"
import PasswordReset from './pages/PasswordReset.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'


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
    path: "/addListing",
    element: <AddListing></AddListing>
  },{
    path: "/forgotpassword",
    element: <ForgotPassword></ForgotPassword>
  },{
    path: "/resetpassword/:token",
    element: <PasswordReset></PasswordReset>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>,
)