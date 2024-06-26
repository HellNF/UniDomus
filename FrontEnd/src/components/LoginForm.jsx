import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UniDomusLogo from "/UniDomusLogo.png";
import { API_BASE_URL } from "../constant";
import { useAuth } from "../AuthContext";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  function handleChangeInput(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const bodyForm = {
      email: formData.email,
      password: formData.password,
    };

    fetch(`${API_BASE_URL}users/authentication`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyForm),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 400) {
          throw new Error("Invalid email or password");
        } else if (res.status === 500) {
          throw new Error("Internal server error. Please try again later.");
        } else {
          throw new Error("An unexpected error occurred");
        }
      })
      .then((data) => {
        if (data.banPermanently === true) {
          alert("This user is permanently banned!");
          
        } else {
          const currentTime = new Date();
          const banEndTime = new Date(data.banTime);
          const timeCheck = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000); // Aggiungi 2 ore all'ora corrente
    
          if (banEndTime > timeCheck) {
            const displayBanEndTime = new Date(banEndTime.getTime() - 2 * 60 * 60 * 1000);
            alert("This user is ban until " + displayBanEndTime.toLocaleString());
            
          } else {
            login(data.token); // Assume server sends token as { token: 'jwt_token' }
            navigate("/");
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert(error.message);
      });
  }

  async function handleGoogleLogin(credentialResponse) {
    try {
      const id_token = credentialResponse.credential;
      const bodyForm = { token: id_token };

      const response = await fetch(`${API_BASE_URL}users/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyForm),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.banPermanently === true) {
          alert("This user is permanently banned!");
          
        } else {
          const currentTime = new Date();
          const banEndTime = new Date(data.banTime);
          const timeCheck = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000); // Aggiungi 2 ore all'ora corrente
    
          if (banEndTime > timeCheck) {
            const displayBanEndTime = new Date(banEndTime.getTime() - 2 * 60 * 60 * 1000);
            alert("This user is ban until " + displayBanEndTime.toLocaleString());
            
          } else {
            login(data.token); // Assume server sends token as { token: 'jwt_token' }
            navigate("/");
          }
        }
      } else {
        throw new Error("Google authentication failed");
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 pt-16"> {/* Added pt-16 */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-28 w-auto" src={UniDomusLogo} alt="Unidomus" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Accedi al tuo account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit} method="POST">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Indirizzo email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChangeInput}
                className="block w-full rounded-md border-0 py-1.5 text-center text-gray-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <a href="/forgotpassword" className="font-semibold text-blue-950 hover:text-blue-700">
                  Password dimenticata?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChangeInput}
                className="block w-full rounded-md border-0 py-1.5 text-gray-950 text-center shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-950 px-3 py-1.5 text-sm font-semibold leading-6 text-center text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login
            </button>
          </div>
          <div className="w-full flex items-center justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Login Failed")}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
