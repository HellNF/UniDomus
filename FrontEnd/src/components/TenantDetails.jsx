import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UniDomusLogo from "/UniDomusLogoWhite.png";
import Carousel from "../components/Carousel";
import genericUser from "../assets/genericUser.svg";
import { API_BASE_URL, reportTypeEnum } from "../constant";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import heartFilled from "../assets/favorite_filled.svg";
import reportIcon from "../assets/report.svg"; // Import the report icon
import useReport from "../hooks/useReport";
import ReportPopup from "../components/ReportPopup";

export default function TenantDetails() {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const { userId } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    showPopup,
    currentReportType,
    currentTargetID,
    handleButtonClick,
    handleClosePopup,
    handleSubmitReport
  } = useReport();

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      const response = await fetch(`${API_BASE_URL}users/${id}?proPic=True`);
      const data = await response.json();
      setUser(data.user);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function calculateAge(birthdateISO) {
    const birthdate = new Date(birthdateISO);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    return age;
  }

  function formatDate(dateString) {
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');
    return `${day} - ${month} - ${year}`;
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="bg-blue-950 min-h-screen flex flex-col items-center p-8 pt-20">
        <div className="flex flex-col items-center space-y-3">
          <img className="h-28 w-auto" src={UniDomusLogo} alt="Unidomus" />
          <h1 className="text-4xl font-semibold leading-7 text-white">Profilo</h1>
        </div>

        <div className="bg-white w-full max-w-4xl mt-6 rounded-lg p-8 shadow-md">
          <div className="flex justify-between space-x-4">
            <div className="flex-1 flex flex-col items-center space-y-6">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900 mb-4">
                {user.username}
              </h2>
              {user.proPic && user.proPic.length > 0 ? (
                <div className="w-64">
                  <Carousel className="flex items-center justify-center">
                    {user.proPic.map((element, id) => (
                      <img
                        src={element.includes("http") || element.includes("data:image/png;base64,") ? element : `data:image/png;base64,${element}`}
                        alt="ciao"
                        key={id}
                        className="h-1/2 min-w-full rounded-full object-cover"
                      />
                    ))}
                  </Carousel>
                </div>
              ) : (
                <img
                  src={genericUser}
                  alt="Generic User"
                  className="rounded-full object-cover"
                />
              )}
            </div>

            <div className="flex-1 flex flex-col py-8 space-y-2">
              <div className="flex py-2 items-center">
                <label htmlFor="name" className="block text-xl font-bold leading-6 text-gray-900">
                  Informazioni personali
                </label>
              </div>
              <div className="flex py-2 items-center">
                <label htmlFor="name" className="block text-ld font-bold leading-6 text-gray-900">
                  Nome:
                </label>
                {user.name  ? (<span className="block text-ld font-medium leading-6 text-gray-900 ml-2">{user.name}</span>
                 ) : (
                <span className="block text-sm font-small leading-6 text-gray-600 ml-2">Non specificato</span>)}
              </div>
              <div className="flex py-2 items-center">
                <label htmlFor="name" className="block text-ld font-bold leading-6 text-gray-900">
                  Cognome:
                </label>
                {user.surname  ? (<span className="block text-ld font-medium leading-6 text-gray-900 ml-2">{user.surname}</span>
                 ) : (
                <span className="block text-sm font-small leading-6 text-gray-600 ml-2">Non specificato</span>)}
              </div>

              <div className="flex py-2 items-center">
                <label htmlFor="name" className="block text-ld font-bold leading-6 text-gray-900">
                  Età:
                </label>
                {user.birthDate  ? (<span className="block text-ld font-medium leading-6 text-gray-900 ml-2">{calculateAge(user.birthDate)}</span>
                 ) : (
                <span className="block text-sm font-small leading-6 text-gray-600 ml-2">Non specificata</span>)}
              </div>
              <div className="flex py-2 items-center">
                <label htmlFor="name" className="block text-ld font-bold leading-6 text-gray-900">
                  Compleanno:
                </label>
                {user.birthDate  ? (<span className="block text-ld font-medium leading-6 text-gray-900 ml-2">{formatDate(user.birthDate)}</span>
                 ) : (
                <span className="block text-sm font-small leading-6 text-gray-600 ml-2">Non specificato</span>)}
              </div>

              <div className="flex justify-between py-8">
                {isLoggedIn && user._id !== userId && (
                  <button onClick={() => handleButtonClick(reportTypeEnum.USER, user._id)} className="bg-transparent">
                    <img src={reportIcon} alt="Report" className="h-8 w-8"/>
                  </button>
                )}
                {isLoggedIn && user._id === userId && (
                  <Link className="bg-blue-950 font-bold text-white p-2 rounded-md m-2" to="/editprofile">Modifica</Link>
                )}
                {isLoggedIn && user._id !== userId && (
                  <button className="bg-blue-950 font-bold text-white p-2 rounded-md m-2" >
                    {
                      !isLiked ?
                        (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" /></svg>)
                        :
                        (<img src={heartFilled} alt="Like" />)
                    }
                  </button>
                )}
              </div>
            </div>
          </div>
 
          <div className="flex justify-between space-x-4 mt-6">
            <div className="flex-1 p-4 shadow-lg border-gray-100 border-2 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Abitudini</h3>
              {user.habits && user.habits.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.habits.map((habit, index) => (
                    <span key={index} className="tag-label">{habit}</span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">Nessuna abitudine specificata</span>
              )}
            </div>
            <div className="flex-1 p-4 shadow-md border-gray-100 border-2 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hobbies</h3>
              {user.hobbies && user.hobbies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.hobbies.map((hobby, index) => (
                    <span key={index} className="tag-label">{hobby}</span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">Nessun hobby specificato</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <ReportPopup
        show={showPopup}
        onClose={handleClosePopup}
        onSubmit={handleSubmitReport}
        reportType={currentReportType}
        targetID={currentTargetID}
      />
    </form>
  );
}
