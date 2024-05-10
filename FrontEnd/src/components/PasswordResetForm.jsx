import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UniDomusLogo from '/UniDomusLogo.png';
import { API_BASE_URL } from '../constant';

const PasswordResetForm = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}users/resetpassword/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setMessage('Password reset successful');
        navigate('/login');
      } else {
        const data = await response.json();
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setMessage('An unexpected error occurred');
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-28 w-auto"
          src={UniDomusLogo}
          alt="Unidomus"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Password Reset
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              New Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-center text-gray-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-950 px-3 py-1.5 text-sm font-semibold leading-6 text-center text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {message && (
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <p className="text-center text-red-600">{message}</p>
        </div>
      )}
    </div>
  );
};

export default PasswordResetForm;
