import React, { useState, useEffect } from "react";
import UniDomusLogo from "/UniDomusLogo.png";
import { Link } from "react-router-dom";
import Navbar from './Navbar';
import Slider from './Slider';

const MIN = 0;
const MAX = 120;

export default function DisplayTenantsPage() {
  const [values, setValues] = useState([MIN, MAX]);
  const [Gender, setGender] = useState(null);
  // State for storing form inputs and edit mode
  const [habits, setHabits] = useState([]);
  const [hobbies, setHobbies] = useState([]);

  // Effect hook to fetch habits and hobbies data on component mount
  useEffect(() => {
    fetch('http://localhost:5050/api/users/tags')
      .then(response => response.json())
      .then(data => {
        setHabits(data.habits || []);
        setHobbies(data.hobbies || []);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  console.log("habits: " + habits)

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col  w-1/4 h-screen py-2 bg-white shadow-xl">
      <div className="px-8 py-3">
      <h2 className="text-4xl font-semibold leading-7 text-gray-900">Filtri</h2>
      </div>
      <div className="overflow-auto px-8">
      <div className="flex items-center pt-8 space-x-2">
          <h2 className="text-xl font-semibold leading-7 text-gray-900">Età:</h2>
          <h2 className="text-base font-semibold leading-7 text-gray-500"> {values[0]} - {values[1]}</h2>
        </div>
        <Slider min={MIN} max={MAX} values={values} setValues={setValues} />
        <h2 className="text-xl py-8 font-semibold leading-7 text-gray-900">Gender:</h2>
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={Gender === "Male"}
              onChange={handleGenderChange}
              className="form-radio"
            />
            <span className="ml-2">Male</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={Gender === "Female"}
              onChange={handleGenderChange}
              className="form-radio"
            />
            <span className="ml-2">Female</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="gender"
              value="Other"
              checked={Gender === "Other"}
              onChange={handleGenderChange}
              className="form-radio"
            />
            <span className="ml-2">Other</span>
          </label>
        </div>

        <h2 className="text-xl py-8 font-semibold leading-7 text-gray-900">Habits:</h2>
        <div className="flex-grow flex flex-wrap gap-4 ">
          {habits.map((habit, index) => (
            <label key={index} className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">{habit}</span>
            </label>
          ))}
        </div>

        <h2 className="text-xl py-8 font-semibold leading-7 text-gray-900">Hobbies:</h2>
        <div className="flex-grow flex flex-wrap gap-4 ">
          {hobbies.map((hobbie, index) => (
            <label key={index} className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">{hobbie}</span>
            </label>
          ))}
        </div>
        </div>
        <div className="p-4">
      <div className="mt-6  flex items-center justify-between">
              <Link to="/.." className="rounded-md bg-red-600  px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                     Resetta
              </Link>

              <button
                type="submit"
                className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Applica
              </button>
            </div>
            </div>
      <div className="overflow-auto p-6"></div>
      </div>
    </>
  );
}
