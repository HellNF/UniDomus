import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import App from './App.jsx'
import './index.css'
import Registration from "./pages/Registration.jsx"
import Login from "./pages/Login.jsx"

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
    path: "/",
    element: <App></App>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)