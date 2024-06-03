import TenantDetails from "../components/TenantDetails.jsx"
import { LoadProvider } from '../context/LoadContext.jsx';
function DisplayTenantDetails(){

    return(
    <>
    <LoadProvider>
        <TenantDetails></TenantDetails>
    </LoadProvider>
        
    </>)
}
export default DisplayTenantDetails;