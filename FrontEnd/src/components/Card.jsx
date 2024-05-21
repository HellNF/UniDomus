import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from "./ImageSlider";
import typo from "../assets/typology.svg";
import heart from "../assets/favorite.svg";
import heartFilled from "../assets/favorite_filled.svg"; // Import a filled heart icon
import calendar from "../assets/calendar.svg";
import location from "../assets/location.svg";
import squareFoot from "../assets/square_foot.svg";
import { API_BASE_URL } from "../constant";
import { useAuth } from './../AuthContext';

function Card({ listing }) {
    const { userId, sessionToken } = useAuth();
    const [publisher, setPublisher] = useState({ img: "", username: "" });
    const [isLiked, setIsLiked] = useState(false); // State to manage the liked status

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        fetch(`${API_BASE_URL}users/${listing.publisherID}?proPic=1`)
            .then(response => response.json())
            .then(data => {
                const userData = data.user;
                setPublisher({
                    img: userData.proPic[0] ? userData.proPic[0] : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                    username: userData.username
                });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    };

    const handleLikeButtonClick = () => {
        const matchData = {
            requesterID: userId,
            receiverID: listing.publisherID,
            matchType: "Appartamento"
        };

        fetch(`${API_BASE_URL}matches`, {
            method: 'POST',
            headers: {
                'x-access-token': sessionToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(matchData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Match request sent successfully:', data);
                setIsLiked(true); // Set the liked state to true
            })
            .catch(error => {
                console.error('Error sending match request:', error);
            });
    };

    return (
        <div className="flex flex-row bg-white h-60 m-3 rounded-lg items-center lg:object-contain 2xl:object-contain hover:shadow-lg">
            <div className="h-full w-2/4 items-center max-w-lg object-cover">
                <Carousel className="object-contain">
                    {listing.photos.map((element, id) => (
                        <img src={element.includes("http") || element.includes("data:image/png;base64,") ? element : `data:image/png;base64,${element}`} alt="Listing" key={id} className="h-2/4 min-w-full" />
                    ))}
                </Carousel>
            </div>
            <div className="flex flex-col h-full w-9/12 rounded-lg text-black p-7 space-y-2 object-contain">
                <div className="flex flex-row justify-evenly font-bold text-xs sm:text-base xl:text-xl 2xl:text-2xl">
                    <h1 className="hover:underline"><p>{listing.price}€</p></h1>
                    <Link to='/' className="flex flex-row space-x-2 items-center">
                        <img className="h-8 w-8 rounded-full" src={publisher.img.includes("http") || publisher.img.includes("data:image/png;base64,") ? publisher.img : `data:image/png;base64,${publisher.img}`} alt="propic" />
                        <p>{publisher.username}</p>
                    </Link>
                </div>
                <div className="flex flex-row text-lg p-3 font-semibold justify-center">
                    <img src={location} alt="" />
                    <h2 className="hover:underline text-xs sm:text-base xl:text-xl 2xl:text-2xl">
                        <p>{listing.address.street + " " + listing.address.houseNum + ", " + listing.address.city}</p>
                    </h2>
                </div>
                <div className="flex flex-row md:flex-col items-center justify-evenly">
                    <div className="flex flex-col md:flex-row items-center justify-evenly text-xs sm:text-base xl:text-lg 2xl:text-xl lg:space-x-3">
                        <div className="flex flex-row">
                            <img src={typo} alt="" />
                            <p>{listing.typology}</p>
                        </div>
                        <div className="flex flex-row">
                            <img src={squareFoot} alt="" />
                            <p>{listing.floorArea + "m²"}</p>
                        </div>
                        <div className="flex flex-row">
                            <img src={calendar} alt="" />
                            <p>{listing.availability}</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row p-5 item-center md:justify-between md:w-full">
                        <button type="button" className="flex justify-center rounded-md bg-blue-950 p-1 m-1 md:p-3 text-sm font-semibold leading-6 text-center text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Dettagli</button>
                        <button type="button" onClick={handleLikeButtonClick} className="flex justify-center rounded-md bg-blue-950 p-1 m-1 md:p-3 text-sm font-semibold leading-6 text-center text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                            <img src={isLiked ? heartFilled : heart} alt="Like" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
