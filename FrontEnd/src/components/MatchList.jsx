import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constant";
import { Link } from 'react-router-dom';
import { useAuth } from './../AuthContext';
import UniDomusLogo from "/UniDomusLogoWhite.png";

export default function MatchesList() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [matches, setMatches] = useState([]);

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
      setMatches(data.matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!matches) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-950">
      <div className="bg-blue-950 max-w-7xl w-full p-6">
        <div className="bg-blue-950 object-center">
          <div className="flex max-w-6xl min-h-full flex-1 flex-col justify-center px-12 py-4 lg:px-8">
            <div className="space-y-6">
              <div className="space-y-3 border-gray-900/10 py-2 flex flex-col items-center justify-center">
                <img className="mx-auto h-28 w-auto" src={UniDomusLogo} alt="Unidomus" />
                <h1 className="text-4xl font-semibold leading-7 text-white">Matches</h1>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h2 className="text-2xl font-semibold leading-7 text-gray-900">List of Matches</h2>
                <div className="mt-10">
                  {matches.length > 0 ? (
                    matches.map((match) => (
                      <div key={match._id} className="bg-gray-100 p-4 mb-4 rounded-lg shadow-md">
                        <p><strong>Match Type:</strong> {match.matchType}</p>
                        <p><strong>Match Status:</strong> {match.matchStatus}</p>
                        <p><strong>Request Date:</strong> {formatDate(match.requestDate)}</p>
                    
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No matches found.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Link to="/" className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
