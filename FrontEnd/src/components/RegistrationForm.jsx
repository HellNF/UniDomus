
import UniDomusLogo from "/UniDomusLogo.png"
import { useState} from "react"
import PopoverInfo from "./PopoverInfo.jsx";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constant";
export default function RegistrationForm() {
  const navigate = useNavigate();
    const [formData, setFormData]= useState({
      "username":"",
      "email":"",
      "password":""
    })
    const [formDataErr, setFormDataErr]= useState({
      "usernameErr":"",
      "emailErr":"",
      "passwordErr":""
    })
    function handleChangeInput(e){
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      }); 
    }

    function handleSubmit(e){
      e.preventDefault();
      
      
      const bodyForm={
        username: formData.username,
        email: formData.email,
        password: formData.password
      }
      fetch(`${API_BASE_URL}users/registration`,{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyForm)
      })
      .then((res)=>{
         
        
        if(res.ok){
          //console.log("ciao")
          navigate('/');
        }
        else{
          if(res.status=="400"){
            setFormData({username: "", email: "", password :""})
            res.json().then((json)=>{const errors=json.errors;
              errors.map((element)=>{
                setFormDataErr({
                  ...formDataErr,
                  [`${element.field}Err`]: element.message
                })
              })})
              
              
          }
          else if(res.status=="500"){
            res.json().then((json)=>{alert(`${json.message}: ${json.reason}`)})
            
          }
        }
          
      }
      ).catch((e)=>console.log(e))
    }

    return (
      <>
        
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-28 w-auto"
              src={UniDomusLogo}
              alt="Unidomus"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign up to a new account
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit} method="POST">
            <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                  Username
                </label>
                
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={formData.username}
                    onChange={handleChangeInput}
                    className="block w-full rounded-md border-0 py-1.5 text-center text-gray-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6"
                  />
                  {formDataErr.usernameErr && <p className="text-red-600 text-xs mt-1">{formDataErr.usernameErr}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder={formDataErr.emailErr}
                    value={formData.email}
                    onChange={handleChangeInput}
                    className="block w-full rounded-md border-0 py-1.5 text-center text-gray-950 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 " 
                  />
                  {formDataErr.emailErr && <p className="text-red-600 text-xs mt-1">{formDataErr.emailErr}</p>}
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-row justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                    <PopoverInfo className="mx-4 p-3" btnContent="i" title="Password costraints"  description={<ul className="list-disc"><li>Minimum length of 8 characters</li><li>Must contain at least one uppercase letter.</li><li>Must contain at least one number.</li><li>Must contain at least one special character.</li></ul>} ></PopoverInfo>
                  </div>
                  
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-blue-950 hover:text-blue-700">
                      Password dimenticata?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChangeInput}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-950 text-center shadow-sm ring-1 ring-inset ring-gray-300  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6"
                  />
                  {formDataErr.passwordErr && <p className="text-red-600 text-xs mt-1">{formDataErr.passwordErr}</p>}
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-blue-950 px-3 py-1.5 text-sm font-semibold leading-6 text-center text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign up
                </button>
              </div>
            </form>
            <div>
            
            </div>
  
            
          </div>
        </div>
      </>
    )
  }
