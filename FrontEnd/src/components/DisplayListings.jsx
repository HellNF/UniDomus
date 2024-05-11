
import { useEffect } from "react";
import Card from "./Card";
import { useState } from "react";

 function DisplayListings(){
    const [listings,setListings]=useState([]);
    useEffect(()=>{
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
    },[])
 return(
        <>
            <div className="bg-gray-500 w-full  h-14">

            </div>
            <div className="bg-blue-50 md:w-7/12 xl:w-6/12 2xl:w-7/12 h-screen overflow-y-scroll no-scrollbar">
                    {listings.map((element)=>(<Card listing={element} key={element._id}></Card>))}
                    

                    

            </div>
        </>
    )
}
export default DisplayListings;