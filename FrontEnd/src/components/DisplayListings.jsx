
import { useEffect } from "react";
import Card from "./Card";
import { useState } from "react";
import MapComponent from "./MapComponent.jsx";
import search from '../assets/search.svg'
import Slider from './Slider'



 function DisplayListings(){
    const priceMin =10
    const priceMax=10000
    const [prices,setPrices] = useState([priceMin,priceMax]);
    const floorAreaMin = 10
    const floorAreaMax = 10000
    const [floorArea,setFloorArea] = useState([floorAreaMin,floorAreaMax]);
    const [typology,setTypology]=useState("")
    const [listings,setListings]=useState([]);
    const [addressCordinates,setAddressCordinates]=useState([])
    useEffect(()=>{
        fetchListings();
        getCordinatesFromAddresses()
 },[])
 
    function getCordinatesFromAddresses(){
        
        fetch('http://localhost:5050/api/listing/coordinates?'+ new URLSearchParams({
            typology: typology,
            priceMin: prices[0],
            priceMax: prices[1],
            floorAreaMin: floorArea[0],
            floorAreaMax: floorArea[1],
        }))
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
        .catch(error => {
            console.error('Error fetching coordinates data:', error);
        });
        
        
    }
    function fetchListings(){
        fetch(`http://localhost:5050/api/listing?`+ new URLSearchParams({
            typology: typology,
            priceMin: prices[0],
            priceMax: prices[1],
            floorAreaMin: floorArea[0],
            floorAreaMax: floorArea[1],
        }))
        .then(response => response.json())
        .then(data => {
            
            setListings(data.listings)
            
        })
        .catch(error => {
            console.error('Error fetching listings data:', error);
        });
    }
    
    function handleChangeTypology(e){
        const {value} = e.target;
        setTypology(value)
    }
    function handleSubmit(e){
        e.preventDefault()
        fetchListings();
        getCordinatesFromAddresses()
        
    }

    

 return(
        <>
            <div className="h-14 w-full bg-gray-300   flex flex-row items-center  justify-center">
                
                <form  onSubmit={handleSubmit} className="flex items-center space-x-12 text-sm justify-between">
                    <h1 className="text-xl font-bold">Filters:</h1>
                    <select id="typology" name="typology" onChange={handleChangeTypology}  value={typology} className="block w-30 text- rounded-md border-0 h-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-950 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option></option>
                        <option>Camera singola</option>
                        <option>Camera doppia</option>
                        
                    </select>
                    <div className="flex flex-row items-center space-x-4">
                        <label htmlFor="price"> prezzo:</label>
                        <div className="w-48  ">
                            
                            <Slider min={priceMin} max={priceMax} values={prices} setValues={setPrices} className=""></Slider>
                        </div>
                    </div>
                    <div className="flex flex-row items-center space-x-4">
                        <label htmlFor="floorArea"> metratura:</label>
                        <div className="w-48  ">
                            
                            <Slider min={floorAreaMin} max={floorAreaMax} values={floorArea} setValues={setFloorArea} className=""></Slider>
                        </div>
                    </div>
                    
                    <button type="submit" className="flex  justify-center rounded-md bg-blue-950  p-1 m-1 md:p-2  text-sm font-semibold leading-6 text-center text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ">
                        <img src={search} alt="Search" className="text-lg"></img>
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