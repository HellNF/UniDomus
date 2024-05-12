import React, { useState,useRef} from "react";
import UniDomusLogo from "/UniDomusLogo.png";
import { Link } from "react-router-dom";
import Navbar from './Navbar';
import Slider from './Slider'

const MIN = 0;
const MAX = 120;

export default function DisplayTenantsPage() {

  const [values, setValues] = useState([MIN,MAX]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col p-8 w-1/4 h-screen py-8 bg-white shadow-xl">
      <div className="flex items-center space-x-2">
      <h2 className="text-xl  font-semibold leading-7 text-gray-900">Età:</h2>
      <h2 className="text-base font-semibold leading-7 text-gray-500"> {values[0]} - {values[1]}</h2>
      </div>
      <Slider min={MIN} max={MAX} values={values} setValues={setValues}></Slider>
      </div>
    </>
  );
}