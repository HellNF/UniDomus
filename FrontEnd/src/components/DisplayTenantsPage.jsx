import React, { useState, useEffect } from "react";
import Carousel from "./ImageSlider";
import UniDomusLogo from "/UniDomusLogo.png";
import heart from "../assets/favorite.svg"
import genericUser from "../assets/genericUser.svg"
import { Link } from "react-router-dom";
import Navbar from './Navbar';
import Slider from './Slider';
import { API_BASE_URL } from "../constant";

const MIN = 0;
const MAX = 120;

export default function DisplayTenantsPage() {
  const [values, setValues] = useState([MIN, MAX]);
  const [users, setUsers] = useState([]);
  const [genders, setGenders] = useState([]);
  // State for storing form inputs and edit mode
  const [habits, setHabits] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [habitsTag, setHabitsTag] = useState([]);
  const [hobbiesTag, setHobbiesTag] = useState([]);
  


  // Effect hook to fetch habits and hobbies data on component mount


  useEffect(() => {
    fetchTags();
    fetchUsers();

  }, []);

  function fetchTags() {
    fetch(`${API_BASE_URL}users/tags`)
      .then(response => response.json())
      .then(data => {
        setHabits(data.habits || []);
        setHobbies(data.hobbies || []);
      })
      .catch(error => console.error('Error fetching data:', error));
    fetch(`${API_BASE_URL}users/tags`)
  }


  const fetchUsers = () => {
    const params = new URLSearchParams({
      etaMin: values[0],
      etaMax: values[1],
    });

    genders.forEach(gender => {
      params.append('gender', gender);
    });

    habitsTag.forEach(habitTag => {
      params.append('habits', habitTag);
    });

    hobbiesTag.forEach(habitTag => {
      params.append('hobbies', habitTag);
    });

    console.log(params.toString())

    fetch(`${API_BASE_URL}users/housingseekers?${params.toString()}`)
      .then(response => response.json())
      .then(data => {
        setUsers(data.users);
        console.log(data.users);
      })
      .catch(error => {
        console.error('Error fetching users data:', error);
      });
  };


  function calculateAge(birthdateISO) {
    const birthdate = new Date(birthdateISO);
    const today = new Date();
    
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    
    return age;
  }



  const handleChangeGenders = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setGenders((prevGenders) => [...prevGenders, value]);
    } else {
      setGenders((prevGenders) => prevGenders.filter((gender) => gender !== value));
    }
  };

  const handleChangeHabitsTag = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setHabitsTag((prevHabits) => [...prevHabits, value]);
    } else {
      setHabitsTag((prevHabits) => prevHabits.filter((habitTag) => habitTag !== value));
    }
  };

  const handleChangeHobbiesTag = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setHobbiesTag((prevHobbies) => [...prevHobbies, value]);
    } else {
      setHobbiesTag((prevHobbies) => prevHobbies.filter((hobbyTag) => hobbyTag !== value));
    }
  };

  
  function handleSubmit(e){
    e.preventDefault()
    fetchUsers();
}





  return (
    <>
      <Navbar />
      <div className="flex">
        <form onSubmit={handleSubmit} method="GET" className="flex flex-col w-1/4 h-screen py-2 bg-white shadow-xl">
          <div className="px-8 py-3">
            <h2 className="text-4xl font-semibold leading-7 text-gray-900">Filtri</h2>
          </div>
          <div className="overflow-auto px-8">
            <div className="flex items-center pt-8 space-x-2">
              <h2 className="text-xl font-semibold leading-7 text-gray-900">Età:</h2>
              <h2 className="text-base font-semibold leading-7 text-gray-500"> {values[0]} - {values[1]}</h2>
            </div>
            <Slider min={MIN} max={MAX} values={values} setValues={setValues} />
            <h2 className="text-xl py-8 font-semibold leading-7 text-gray-900">Sesso:</h2>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="gender"
                  value="Maschio"
                  className="form-radio"
                  onChange={handleChangeGenders}
                />
                <span className="ml-2">Maschio</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="gender"
                  value="Femmina"
                  className="form-radio"
                  onChange={handleChangeGenders}
                />
                <span className="ml-2">Femmina</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="gender"
                  value="Altro"
                  className="form-radio"
                  onChange={handleChangeGenders}
                />
                <span className="ml-2">Altro</span>
              </label>
            </div>

            <h2 className="text-xl py-8 font-semibold leading-7 text-gray-900">Abitudini:</h2>
            {habits.map((habit, index) => (
              <div key={index} className="pr-1 checkbox-container">
                <input
                  type="checkbox"
                  className="checkbox-btn"
                  id={`habit-${index}`}
                  name="habits"
                  value={habit}
                  onChange={handleChangeHabitsTag}
                />
                <label className="checkbox-label" htmlFor={`habit-${index}`}>
                  {habit}
                </label>
              </div>
            ))}

            <h2 className="text-xl py-8 font-semibold leading-7 text-gray-900">Hobbies:</h2>
            {hobbies.map((hobby, index) => (
              <div key={index} className="pr-1 checkbox-container">
                <input
                  type="checkbox"
                  className="checkbox-btn"
                  id={`hobby-${index}`}
                  name="hobbies"
                  value={hobby}
                  onChange={handleChangeHobbiesTag}
                />
                <label className="checkbox-label" htmlFor={`hobby-${index}`}>
                  {hobby}
                </label>
              </div>
            ))}
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
        </form>
        <div className="w-3/4 p-4 h-screen overflow-y-scroll">
        <h3 className="mb-4 text-lg font-semibold">Utenti in cerca di appartamento</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {users.map(user => (
            <button key={user.id} className="relative p-4  hover:bg-gray-100 border rounded-lg shadow flex flex-col items-center">
             {user.proPic.length > 0 ? (
              <Carousel className="w-1/2 flex items-center justify-center">
                {user.proPic.map((element, id) => (
                  <img 
                    src={element.includes("http") || element.includes("data:image/png;base64,") ? element : `data:image/png;base64,${element}`} 
                    alt="ciao" 
                    key={id} 
                    className="h-1/2 min-w-full rounded-full object-cover" 
                  />
                ))}
              </Carousel>
            ) : (
    
              <img 
                src={genericUser} 
                alt="Generic User" 
                className="flex  items-center justify-center" 
              />
            )}
              <button type="button"  className="flex absolute top-0 right-0 justify-center rounded-md bg-blue-950 p-2 text-sm font-semibold leading-6 text-center text-white shadow-sm hover:bg-blue-700"><img src={heart} alt="Like" /></button>

              <div className="text-center mt-4">
                <p><strong> {user.username}</strong></p>
                <p> {user.name?`${user.name} `:``}
                    {user.surname?` ${user.surname}`:``}
                    {user.surname && user.birthDate?`, `:``}
                    {user.birthDate?`${calculateAge(user.birthDate)} `:``}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      </div>
    </>
  );
}
