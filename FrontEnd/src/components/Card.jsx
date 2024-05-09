import ImageSlider from "./ImageSlider";
import typo from "../assets/typology.svg"
import heart from "../assets/favorite.svg"
import calendar from "../assets/calendar.svg"
import location from "../assets/location.svg"
import squareFoot from "../assets/square_foot.svg"
import { Link } from 'react-router-dom';

function Card(){
    
    return(
           <>
               
               <div className="flex flex-row bg-white h-60 m-3 rounded-lg items-center ">
                       <div className="h-full w-2/4 scale-75 items-start">
                        <ImageSlider></ImageSlider>
                       </div>
                        <div className="flex flex-col bg-slate-100 h-full w-9/12 rounded-lg text-black  p-7 space-y-2">

                            <div  className="flex flex-row justify-evenly text-xl font-bold">
                                <h1 className="hover:underline"><p>{"400"}€</p></h1>
                                <Link to='/' className="flex flex-row space-x-2 items-center">
                                    <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'" alt="propic" /> 
                                    <p>Username</p>
                                </Link>
                            </div>
                            <div className="flex flex-row text-lg p-3 font-semibold justify-center">
                                <img src={location} alt="" />
                                <h2 className="hover:underline"><p>Indirizzo via capre 300, Trento</p></h2>
                            </div>
                            <div className="flex flex-row items-center justify-evenly">
                                <div className="flex flex-row">
                                <img src={typo}  alt="" />
                                    <p>Typology</p></div>
                                <div className="flex flex-row">
                                    <img src={squareFoot}  alt="" />
                                    <p>Floorarea</p></div>
                                <div className="flex flex-row">
                                    <img src={calendar}  alt="" />
                                    <p>availability</p>
                                </div>
                            </div>
                            <div className="flex flex-row p-5 item-center justify-between">
                                <button type="button" className="flex  justify-center rounded-md bg-blue-950 p-3  text-sm font-semibold leading-6 text-center text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ">Dettagli</button>
                                <button type="button"  className="flex  justify-center rounded-md bg-blue-950 p-3  text-sm font-semibold leading-6 text-center text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "><img src={heart} alt="Like" /></button>
                                
                            </div>
                        </div>
               </div>
           </>
       )
   }
   export default Card;