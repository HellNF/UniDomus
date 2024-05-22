import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { API_BASE_URL, matchStatusEnum } from "../constant";
import { useAuth } from '../AuthContext';
import UniDomusLogo from "/UniDomusLogoWhite.png";
import useReport from '../hooks/useReport';
import ReportPopup from '../components/ReportPopup';
import reportIcon from '../assets/report.svg';

export default function ChatsList() {
  const { userId } = useAuth();
  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState({});
  const {
    showPopup,
    currentReportType,
    currentTargetID,
    currentMessageID,
    handleButtonClick,
    handleClosePopup,
    handleSubmitReport
  } = useReport();

  useEffect(() => {
    if (userId) {
      fetchMatches();
    }
  }, [userId]);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}matches/user/${userId}`, {
        headers: {
          'x-access-token': localStorage.getItem("token"),
          'content-type': 'application/json'
        },
      });
      const data = await response.json();
      // Filter matches to show only those with status ACCEPTED
      const filteredMatches = data.matches.filter(match => match.matchStatus === matchStatusEnum.ACCEPTED);
      setMatches(filteredMatches);
      fetchUsers(filteredMatches);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const fetchUsers = async (matches) => {
    // Map through matches to find the other user ID
    const userIds = matches.map(match => match.requesterID === userId ? match.receiverID : match.requesterID);
    const uniqueUserIds = [...new Set(userIds)];

    const userPromises = uniqueUserIds.map(async (id) => {
      if (id) {
        try {
          const response = await fetch(`${API_BASE_URL}users/${id}?proPic=1`, {
            headers: {
              'x-access-token': localStorage.getItem("token"),
              'content-type': 'application/json'
            },
          });
          const userData = await response.json();
          const user = userData.user;

          if (user && user.proPic) {
            const proPicData = user.proPic;
            user.proPic = `data:image/png;base64,${proPicData}`;
          }

          return { id, userData: user };
        } catch (error) {
          console.error(`Error fetching user data for ID ${id}:`, error);
          return { id, userData: null };
        }
      }
    });

    const userDataArray = await Promise.all(userPromises);
    const usersMap = userDataArray.reduce((acc, { id, userData }) => {
      if (userData) {
        acc[id] = userData;
      }
      return acc;
    }, {});
    setUsers(usersMap);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-950">
      <div className="bg-blue-950 max-w-7xl w-full p-6">
        <div className="bg-blue-950 object-center">
          <div className="flex max-w-6xl min-h-full flex-1 flex-col justify-center px-12 py-4 lg:px-8">
            <div className="space-y-6">
              <div className="space-y-3 border-gray-900/10 py-2 flex flex-col items-center justify-center">
                <img className="mx-auto h-28 w-auto" src={UniDomusLogo} alt="Unidomus" />
                <h1 className="text-4xl font-semibold leading-7 text-white">Chats</h1>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h2 className="text-2xl font-semibold leading-7 text-gray-900">Accepted Matches</h2>
                <div className="mt-10">
                  {matches.length > 0 ? (
                    matches.map((match) => {
                      const otherUserId = match.requesterID === userId ? match.receiverID : match.requesterID;
                      const otherUser = users[otherUserId];

                      return (
                        <div key={match._id} className="bg-gray-100 p-4 mb-4 rounded-lg shadow-md flex justify-between items-center">
                          <div>
                            {otherUser ? (
                              <Link to={`/chat/${match._id}`} className="flex flex-col space-y-2">
                                <div className="flex flex-row space-x-2 items-center">
                                  {otherUser.proPic ? (
                                    <img
                                      className="h-8 w-8 rounded-full"
                                      src={otherUser.proPic}
                                      alt="propic"
                                    />
                                  ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                                  )}
                                  <p>{otherUser.username || "Unknown User"}</p>
                                </div>
                                <p><strong>Tipologia:</strong> {match.matchType}</p>
                                <p><strong>Data:</strong> {formatDate(match.requestDate)}</p>
                              </Link>
                            ) : (
                              <p>Loading user data...</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleButtonClick('match', match._id)} // Report button for the match
                              className="p-1 rounded-md hover:bg-yellow-700"
                            >
                              <img src={reportIcon} alt="Report" className="h-6 w-6" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500">No accepted matches found.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Link to="/" className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Go to Home
              </Link>
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
        messageID={currentMessageID}
      />
    </div>
  );
}
