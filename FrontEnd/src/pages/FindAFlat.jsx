import Navbar from "../components/Navbar.jsx"
import DisplayListings from "../components/DisplayListings.jsx";

function FindAFlat(){

    return(
    <>
        <Navbar current={'Trova un appartamento'}></Navbar>
        <DisplayListings></DisplayListings>
    
    </>)
}
export default FindAFlat;