import ListingDetails from "../components/ListingDetails.jsx"
import { LoadProvider } from '../context/LoadContext.jsx';
function DisplayListingDetails(){

    return(
    <>
    <LoadProvider>
        <ListingDetails></ListingDetails>
    </LoadProvider>
        
    </>)
}
export default DisplayListingDetails;