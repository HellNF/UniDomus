
import {Link} from "react-router-dom"
import UniDomusLogo from "/UniDomusLogo.png"
function Navbar(){

return(<>
    <div className="  object-top flex flex-row  bg-blue-950  text-blue-100 font-bold justify-around " >
       <div className="object-left   flex items-center mx-10 ">
            <img src={UniDomusLogo} alt="UniDomus Logo" className="w-16 "/>
       </div>
       <div className="object-center flex flex-row text-center">
          
            <Link className="m-4 p-4 hover:text-blue-400"><p>Home</p></Link>
            <Link className="m-4 p-4 hover:text-blue-400"><p>Trova appartamento</p></Link>
            <Link className="m-4 p-4 hover:text-blue-400"><p>Trova coinquilino</p></Link>
            
       </div>
        <div className="object-right -mx-7">
            <Link><button type="button" className="bg-blue-500 m-4 p-3 border-1 rounded-lg hover:text-blue-500 hover:bg-blue-100">Log in</button></Link>
            <Link to="/registration"><button type="button" className="bg-blue-500 m-4 p-3 border-1 rounded-lg hover:text-blue-500 hover:bg-blue-100w" >Sign up</button></Link>
            
        </div>
    </div>
    


</> )
    

}
export default Navbar