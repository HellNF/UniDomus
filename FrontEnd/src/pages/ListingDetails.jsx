import React, { useEffect } from "react";
import UseParams from "react-router-dom";
import ImageSlider from "../components/ImageSlider";

export default function ListingDetails() {
    const listingId= UseParams()
    const [listing,setListing]=useState({});
    useEffect(() => {
        fetchListingData(); 
    });

  return (
    <>
      <div>
        <ImageSlider></ImageSlider>
      </div>
        <p>username</p>
      <div>
        <div>
            <div>
                
            </div>
            <div>
                <h1>Tipologia</h1>
                <h2>Indirizzo</h2>
            </div>
        </div>
        <div>
            <h3>Descrizione</h3>
            <p>Descrizione</p>
        </div>
      </div>
    </>
  );
}
