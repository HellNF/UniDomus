import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";
import { API_BASE_URL } from "../constant";
import MapComponent from "../components/MapComponent";
import { useAuth } from "../AuthContext";

export default function ListingDetails() {
  const { id } = useParams();
  const { isLoggedIn, logout } = useAuth();
  const { userId } = useAuth();
  const [listing, setListing] = useState({});
  const [publisher, setPublisher] = useState({ img: "", username: "" });
  useEffect(() => {
    fetchListingData();
  }, []);

  useEffect(() => {
    if (listing.publisherID) {
      fetchUserData();
    }
  }, [listing.publisherID]);
  async function fetchListingData() {
    await fetch(`${API_BASE_URL}listings/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setListing(data.listing);
      })
      .catch((error) => {
        console.error("Error fetching listing data:", error);
      });
  }
  async function fetchUserData() {
    // Fetch user data from the backend
    await fetch(`${API_BASE_URL}users/${listing.publisherID}?proPic=1`)
      .then((response) => response.json())
      .then((data) => {
        const userData = data.user;
        console.log(userData.username);
        setPublisher({
          img: userData.proPic[0]
            ? userData.proPic[0]
            : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          username: userData.username,
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }

  return (
    <>
      <div className="flex flex-col bg-blue-950 items-center">
        <div className="flex flex-col items-center bg-white w-5/6 h-fit p-4 rounded-md  border-2 shadow overflow-x-hidden  overflow-hidden ">
            <div className="max-w-3xl h-96  object-cover p-4 ">
                <Carousel>
                    {listing.photos
                        ? listing.photos.map((element, id) => (
                            <img
                            src={
                                element.includes("http") ||
                                element.includes("data:image/png;base64,")
                                ? element
                                : `data:image/png;base64,${element}`
                            }
                            alt="ciao"
                            key={id}
                            className="h-2/4 min-w-full"
                            />
                        ))
                        : null}
                </Carousel>
            </div>

            <div className="w-2/3 flex flex-col  items-center ">
                <div className="flex flex-row ">
                    <div className="flex flex-col   w-1/2">
                        <div className="flex flex-row items-center">
                            <div className="p-3 ">
                                <Link
                                    to="/"
                                    className="flex flex-col  space-y-2 items-center"
                                >
                                    <img
                                    className="h-20 w-20 rounded-full"
                                    src={
                                        publisher.img.includes("http") ||
                                        publisher.img.includes("data:image/png;base64,")
                                        ? publisher.img
                                        : `data:image/png;base64,${publisher.img}`
                                    }
                                    alt="propic"
                                    />
                                    <p>{publisher.username}</p>
                                </Link>
                            </div>
                            <div>
                                <h1 className="font-semibold text-3xl">{listing.typology}</h1>
                                <h2 className="font-medium text-lg">
                                    {listing.address
                                    ? listing.address.street +
                                        " " +
                                        listing.address.houseNum +
                                        ", " +
                                        listing.address.city
                                    : "Address not available"}
                                </h2>
                        </div>
                    </div>
                    <div className="flex flex-col px-2 space-y-3">
                        <label className="font-semibold">Descrizione</label>
                        <p>{listing.description}
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum earum nobis aliquid officiis blanditiis error accusantium rerum quo velit quibusdam? Iusto esse voluptate, sapiente rem porro officia aliquid nam blanditiis?
                        </p>
                        <label className="font-semibold">Metratura</label>
                        <h2>{listing.floorArea} m²</h2>
                        <label className="font-semibold">Inquilini</label>
                        <p>{listing.tenantsID || "non ci sono inquilini"}</p>
                        <label className="font-semibold">Data di pubblicazione dell'annuncio:</label>
                        <p>{new Date(listing.publicationDate).toLocaleDateString('it-IT', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>


                    </div>
                
                    </div>
                                        
                    <div className="flex flex-row  w-1/2">
                        <div className="flex flex-col items-center justify-center m-5 shadow-lg bg-blue-950 w-5/6 h-3/5 text-white rounded-xl space-y-2">
                            <h1 className="font-bold text-2xl">{listing.price} €/mese</h1>
                            <div className="flex">
                                <label className="font-semibold">Disponibilità: </label>
                                <h2>{listing.availability}</h2>
                            </div>
                            <div className="flex flex-row items-center ">
                                {isLoggedIn && listing.publisherID === userId ? (<button className="bg-white font-bold text-blue-950 p-2 rounded-md m-2">Modifica</button> ): (<></>)}
                                <button className="bg-white font-bold text-blue-950 p-2 rounded-md m-2">Segnala</button>
                                <button className="bg-white font-bold text-blue-950 p-2 rounded-md m-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="blue-950"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                                </button>
                            </div>
                            
                            
                        </div>
                        
                    </div>
                    
                </div>
                <div className="h-40vh w-10/12   bg-slate-500 my-3">
                    <MapComponent tags={[]}></MapComponent>
                </div>
            </div>
        </div>
       </div>
    </>
  );
}
