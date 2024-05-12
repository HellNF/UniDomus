
import { useEffect } from "react";
import Card from "./Card";
import { useState } from "react";
import MapComponent from "./MapComponent.jsx";
import search from '../assets/search.svg'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

 function DisplayListings(){
    const [listings,setListings]=useState([]);
    const [addressCordinates,setAddressCordinates]=useState([])
    useEffect(()=>{
        fetchListings();
        getCordinatesFromAddresses()
 },[])
 
    function getCordinatesFromAddresses(){
        
        fetch('http://localhost:5050/api/listing/coordinates',)
        .then((res)=>{
            if(res.ok){
                res.json().then((json)=>{
                    setAddressCordinates([
                        ...json.data
                    ])
                })
                
            }
            else{
                console.log("Error retrieving coordinates")
            }
        })
        
        
    }
    function fetchListings(){
        fetch(`http://localhost:5050/api/listing`,{method: 'GET',
        headers:{
          'Content-Type': 'application/json'
        }})
        .then(response => response.json())
        .then(data => {
            
            setListings(data.listings)
            
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }
    

    

 return(
        <>
            <div className="h-14 w-full bg-gray-300   flex flex-row items-center space-x-2 justify-center">
                
                <form className="flex items-center space-x-6 text-sm">
                    <h1 className="text-xl font-bold">Filters:</h1>
                    <select id="country" name="country" autocomplete="country-name" class="block w-30 text- rounded-md border-0 h-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-950 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option>Stanza singola</option>
                        <option>Stanza doppia</option>
                        
                    </select>
                    <div className=" flex flex-row items-center space-x-2">
                        <label htmlFor="PrezzoMin"> prezzo min</label>
                        <input type="number" className="block w-20 rounded-md border-0 h-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-950 sm:max-w-xs sm:text-sm sm:leading-6" />
                    </div>
                    <div className=" flex flex-row items-center space-x-2">
                        <label htmlFor="PrezzoMin"> prezzo max</label>
                        <input type="number" className="block w-20 rounded-md border-0  h-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-950 sm:max-w-xs sm:text-sm sm:leading-6" />
                    </div>
                    <div className=" flex flex-row items-center space-x-2">
                        <label htmlFor="PrezzoMin">m² min</label>
                        <input type="number" className="block w-20 rounded-md border-0 h-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-950 sm:max-w-xs sm:text-sm sm:leading-6" />
                    </div>
                    <div className=" flex flex-row items-center space-x-2">
                        <label htmlFor="PrezzoMin"> prezzo min</label>
                        <input type="number" className="block w-20 rounded-md border-0 h-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-950 sm:max-w-xs sm:text-sm sm:leading-6" />
                    </div>
                    <button type="submit" className="flex  justify-center rounded-md bg-blue-950  p-1 m-1 md:p-2  text-sm font-semibold leading-6 text-center text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ">
                        <img src={search} alt="Search"></img>
                    </button>
                    
                    
                </form>
            </div>
            <div className="flex z-0">
                <div className="bg-blue-50 md:w-7/12 xl:w-6/12 2xl:w-7/12 h-83vh overflow-y-scroll no-scrollbar">
                        {listings.map((element)=>(<Card listing={element} key={element._id}></Card>))}
                        
                </div>
                <div className="h-full md:w-5/12 xl:w-6/12 2xl:w-5/12">
                    <MapComponent tags={addressCordinates}></MapComponent>
                </div>
                
            </div>
            
        </>
    )
}
export default DisplayListings;