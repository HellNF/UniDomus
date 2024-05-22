import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";
import { API_BASE_URL } from "../constant";
import MapComponent from "../components/MapComponent";
import { useAuth } from "../AuthContext";
import { PhotoIcon } from '@heroicons/react/24/solid'

export default function ListingDetails() {
  const { id } = useParams();
  const [modifyMode, setModifyMode] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const { userId } = useAuth();
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [addressCordinates, setAddressCordinates] = useState({})
  const [listing, setListing] = useState({});
  const [publisher, setPublisher] = useState({ img: "", username: "" });
  const [formData, setFormData] = useState({
    "address": {
      "street": "",
      "city": "",
      "cap": "",
      "houseNum": "",
      "province": "",
      "country": "",
    },
    "typology": "",
    "description": "",
    "price": "",
    "floorArea": "",
    "availability": "",
    "photos": [],
    "publisherID": ""
  })
  const [formDataErr, setFormDataErr] = useState({
    "addressErr": {
      "streetErr": "",
      "cityErr": "",
      "capErr": "",
      "houseNumErr": "",
      "provinceErr": "",
      "countryErr": "",
    },
    "typologyErr": "",
    "descriptionErr": "",
    "priceErr": "",
    "floorAreaErr": "",
    "availabilityErr": "",
    "photosErr": [],
    "publisherIDErr": ""
  })

  function handleChangeInput(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  useEffect(() => {
    fetchListingData();
  }, []);

  useEffect(() => {
    setFormData({...listing.address, typology: listing.typology, description: listing.description, price: listing.price, floorArea: listing.floorArea, availability: listing.availability, photos: listing.photos, publisherID: listing.publisherID});
    setPhotoPreviews(listing.photos);
    if (listing.publisherID && modifyMode === false) {
      
        fetchUserData();
        getCordinatesFromId();
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
  async function getCordinatesFromId(){
        
    await fetch(`${API_BASE_URL}listings/coordinates/${id}`)
    .then((res)=>{
        if(res.ok){
            res.json().then((json)=>{
                setAddressCordinates(
                    json.data
                )
            })
            
        }
        else{
            console.log("Error retrieving coordinates")
        }
    })
    .catch(error => {
        console.error('Error fetching coordinates data:', error);
    });
  }
  const handlePhotoChange = (e) => {
    const files = e.target.files;
    const newPhotoPreviews = [...photoPreviews];

    // Check if adding new photos will exceed the limit of 5
    if (newPhotoPreviews.length + files.length > 10) {
      alert('You can add at most 10 photos.');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onloadend = () => {
        newPhotoPreviews.push(reader.result);
        setPhotoPreviews(newPhotoPreviews);
      };

      reader.readAsDataURL(file);
    }
  };
  const handleRemovePhoto = (index) => {
    const newPhotoPreviews = [...photoPreviews];
    newPhotoPreviews.splice(index, 1);
    setPhotoPreviews(newPhotoPreviews);
};
const handleCancelModify = (e) => {
    e.preventDefault();
    setModifyMode(false);
}
  return (
    <>
      <div className="flex flex-col bg-blue-950 items-center h-full">
        <div className="flex flex-col items-center bg-white w-5/6 h-fit p-4 rounded-md  border-2 shadow overflow-x-hidden  overflow-hidden ">
            { !modifyMode? (
            <><div className="max-w-3xl h-96  object-cover p-4 ">
                          <Carousel>
                              {listing.photos
                                  ? listing.photos.map((element, id) => (
                                      <img
                                          src={element.includes("http") ||
                                              element.includes("data:image/png;base64,")
                                              ? element
                                              : `data:image/png;base64,${element}`}
                                          alt="ciao"
                                          key={id}
                                          className="h-2/4 min-w-full" />
                                  ))
                                  : null}
                          </Carousel>

                      </div><div className="w-2/3 flex flex-col items-center justify-center">
                              <div className="flex flex-row w-full">
                                  <div className="flex flex-col  w-1/2 mx-4">
                                      <div className="flex flex-row items-center">
                                          <div className="p-3 ">
                                              <Link
                                                  to="/"
                                                  className="flex flex-col  space-y-2 items-center"
                                              >
                                                  <img
                                                      className="h-20 w-20 rounded-full"
                                                      src={publisher.img.includes("http") ||
                                                          publisher.img.includes("data:image/png;base64,")
                                                          ? publisher.img
                                                          : `data:image/png;base64,${publisher.img}`}
                                                      alt="propic" />
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

                                  <div className="flex flex-row ">
                                      <div className="flex flex-col items-center justify-center m-4 shadow-lg bg-blue-950 w- h-3/5 text-white rounded-xl space-y-2">
                                          <h1 className="font-bold text-2xl">{listing.price} €/mese</h1>
                                          <div className="flex">
                                              <label className="font-semibold">Disponibilità: </label>
                                              <h2>{listing.availability}</h2>
                                          </div>
                                          <div className="flex flex-row items-center ">
                                              {isLoggedIn && listing.publisherID === userId ? (<button className="bg-white font-bold text-blue-950 p-2 rounded-md m-2" onClick={()=>{setModifyMode(true)}}>Modifica</button>) : (<></>)}
                                              <button className="bg-white font-bold text-blue-950 p-2 rounded-md m-2">Segnala</button>
                                              <button className="bg-white font-bold text-blue-950 p-2 rounded-md m-2">
                                                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="blue-950"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" /></svg>
                                              </button>
                                          </div>


                                      </div>

                                  </div>

                              </div>
                              <div className="h-40vh w-full   bg-slate-500 my-3">
                                  {addressCordinates.latitude && addressCordinates.longitude && <MapComponent tags={addressCordinates}></MapComponent>}
                              </div>
                          </div></> )
            :(<form  className="w-4/6">
                
                    <div className="col-span-full">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">Inserisci foto</h2>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <div className="col-span-full">
                          <div className="text-center">
                            <button
                              type="button"
                              onClick={() => document.getElementById('file-upload').click()}
                              className="relative overflow-hidden w-12 h-12 mx-auto"
                            >
                              <div className={`absolute inset-0 bg-white rounded-full border border-indigo-600 `}>
                                <PhotoIcon className="mx-auto h-8 w-8 text-gray-300 absolute inset-0 m-auto " aria-hidden="true" />
                                <div className="absolute bottom-0 right-0">
                                  <div className="relative rounded-full overflow-hidden w-6 h-6 bg-indigo-600 flex justify-center items-center ">
                                    +
                                  </div>
                                </div>
                              </div>
                            </button>


                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handlePhotoChange} // Add onChange handler
                              multiple // Allow multiple file selection
                              accept="image/*" // Restrict to image files
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">

                          {formDataErr.photosErr.length > 0 && (
                            <div>
                              {formDataErr.photosErr.map((error, index) => (
                                <p key={index} className="text-red-600 text-xs mt-1">{error}</p>
                              ))}
                            </div>
                          )}
                          {photoPreviews.length === 0 && Array.isArray(photoPreviews) ? (
                            <div>
                              <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-4">
                              {photoPreviews.map((imgSrc, index) => (
                                <div key={index} className="relative overflow-hidden">
                                <img
                                    src={imgSrc.includes("http") || imgSrc.includes("data:image/png;base64,")? imgSrc: `data:image/png;base64,${imgSrc}`}
                                    alt={`Uploaded ${index + 1}`}
                                    className="" key={index} width={200} height={200} // Adjust size based on index
                                />
                                <div >
                                    <button
                                        type="button"
                                        
                                        className="absolute top-0 right-0 -mr-1 -mt-1 bg-white rounded-full p-1.5"
                                        onClick={() => handleRemovePhoto(index)}
                                    >
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                                
                              ))}
                              
                            </div>
                            
                          )}

                        </div>

                      </div>
                    </div>
                    </div>
                    {/* indirizzo */}
                    <div className="flex flex-col space-y-4 p-6">
                        <h2 className="text-2xl font-semibold leading-7 text-gray-900">Indirizzo</h2>
                        <div>
                            {/* prima riga */}
                            <div className="flex flex-row space-x-6 justify-around p-2">
                                <div className="flex flex-col w-1/3">
                                <label htmlFor="street" className="block text-sm font-medium leading-6 text-gray-900">
                                Via
                                </label>
                                <div className="street">
                                <input
                                    id="street"
                                    name="street"
                                    type="text"
                                    autoComplete="street"
                                    required
                                    value={formData.street}
                                    onChange={handleChangeInput}
                                    className="block max-w-xs w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {formDataErr.streetErr && <p className="text-red-600 text-xs mt-1">{formDataErr.streetErr}</p>}
                                </div>
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <label htmlFor="houseNum" className="block text-sm font-medium leading-6 text-gray-900">
                                    Civico
                                    </label>
                                    <div className="houseNum">
                                    <input
                                        id="houseNum"
                                        name="houseNum"
                                        type="text"
                                        autoComplete="houseNum"
                                        required
                                        value={formData.houseNum}
                                        onChange={handleChangeInput}
                                        className="block  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {formDataErr.houseNumErr && <p className="text-red-600 text-xs mt-1">{formDataErr.houseNumErr}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                    Città
                                    </label>
                                    <div className="city">
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        autoComplete="=city"
                                        required
                                        value={formData.city}
                                        onChange={handleChangeInput}
                                        className="block max-w-xs w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {formDataErr.cityErr && <p className="text-red-600 text-xs mt-1">{formDataErr.cityErr}</p>}
                                    </div>
                                </div>
                            </div>
                            {/* seconda riga */}
                            <div className="flex flex-row space-x-6 justify-evenly p-2">
                                <div className="flex flex-col w-1/3">
                                    <label htmlFor="province" className="block text-sm font-medium leading-6 text-gray-900">
                                    Provincia
                                    </label>
                                    <div className="province">
                                    <input
                                        id="province"
                                        name="province"
                                        type="text"
                                        autoComplete="province"
                                        required
                                        value={formData.province}
                                        onChange={handleChangeInput}
                                        className="block max-w-xs w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {formDataErr.provinceErr && <p className="text-red-600 text-xs mt-1">{formDataErr.provinceErr}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <label htmlFor="cap" className="block text-sm font-medium leading-6 text-gray-900">
                                    CAP
                                    </label>
                                    <div className="cap">
                                    <input
                                        id="cap"
                                        name="cap"
                                        type="text"
                                        autoComplete="cap"
                                        required
                                        value={formData.cap}
                                        onChange={handleChangeInput}
                                        className="block max-w-xs w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {formDataErr.streetErr && <p className="text-red-600 text-xs mt-1">{formDataErr.streetErr}</p>}
                                    </div>
                                </div>
                                <div className="felx flex-col w-1/3">
                                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                                    Stato
                                    </label>
                                    <div className="coutny">
                                    <select
                                        id="country"
                                        name="country"
                                        autoComplete="country"
                                        required
                                        value={formData.country}
                                        onChange={handleChangeInput}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option>Italia</option>
                                    </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        

                    </div>
                    {/* Dettagli abitazione */}
                    <div className="flex flex-col space-y-4 p-6">
                        <h2 className="text-2xl font-semibold leading-7 text-gray-900">Dettagli abitazione</h2>
                        <div>
                            {/* prima riga */}
                            <div className="flex flex-row space-x-6 justify-evenly p-2">
                                <div className="flex flex-col w-1/3">
                                    <label htmlFor="typology" className="block text-sm font-medium leading-6 text-gray-900">
                                        Tipologia
                                    </label>
                                    <div className="typology">
                                        <select
                                        id="typology"
                                        name="typology"
                                        autoComplete="typology"
                                        required
                                        value={formData.typology}
                                        onChange={handleChangeInput}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                        <option>Camera singola</option>
                                        <option>Camera doppia</option>
                                        <option>Camera tripla</option>
                                        <option>Altro...</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <label htmlFor="floorArea" className="block text-sm font-medium leading-6 text-gray-900">
                                        Metratura
                                    </label>
                                    <div className="floorArea">
                                        <input
                                        id="floorArea"
                                        name="floorArea"
                                        type="text"
                                        autoComplete="floorArea"
                                        required
                                        value={formData.floorArea}
                                        onChange={handleChangeInput}
                                        className="block max-w-xs w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {formDataErr.floorAreaErr && <p className="text-red-600 text-xs mt-1">{formDataErr.floorAreaErr}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                                        Price
                                    </label>
                                    <div className="price">
                                        <input
                                        id="price"
                                        name="price"
                                        autoComplete="price"
                                        required
                                        value={formData.price}
                                        onChange={handleChangeInput}
                                        className="block max-w-xs w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {formDataErr.priceErr && <p className="text-red-600 text-xs mt-1">{formDataErr.priceErr}</p>}
                                    </div>
                                </div>
                               
                            </div>
                            {/* seconda riga */}
                            <div className="flex flex-row space-x-6 justify-evenly p-2">
                                <div className="flex flex-col w-full">
                                    <label htmlFor="availability" className="block text-sm font-medium leading-6 text-gray-900">
                                        Disponibilità
                                    </label>
                                    <div className="availability">

                                        <input
                                        id="availability"
                                        name="availability"
                                        autoComplete="availability"
                                        value={formData.availability}
                                        onChange={handleChangeInput}
                                        className="block w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {formDataErr.availabilityErr && <p className="text-red-600 text-xs mt-1">{formDataErr.availabilityErr}</p>}
                                    </div>
                                </div>
                                
                                
                            </div>
                            <div className="flex flex-row space-x-6 justify-evenly p-2">
                                <div className="flex flex-col w-full">
                                    <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                        Descrizione
                                    </label>
                                    <div className="description">
                                        <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        value={formData.description}
                                        onChange={handleChangeInput}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        defaultValue={''}
                                        />
                                        {formDataErr.descriptionErr && <p className="text-red-600 text-xs mt-1">{formDataErr.descriptionErr}</p>}
                                    </div>
                                </div>

                            </div>
                        </div>
                        

                    </div>
                    
                <div className="flex flex-row items-center justify-evenly">
                    <button
                        type="button"
                        onClick={handleCancelModify}
                        className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                        annulla
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Conferma
                    </button>
                </div> 
            </form>)}
            
            
            
                
            

        </div>
       </div>
    </>
  );
}
