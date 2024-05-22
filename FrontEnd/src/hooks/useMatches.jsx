import { useState, useEffect } from 'react';
import { API_BASE_URL, matchStatusEnum } from '../constant';
import { useAuth } from '../AuthContext';

const useMatches = () => {
  const { userId } = useAuth();
  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState({});

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
      const filteredMatches = data.matches.filter(match => match.matchStatus === matchStatusEnum.ACCEPTED);
      setMatches(filteredMatches);
      fetchUsers(filteredMatches);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const fetchUsers = async (matches) => {
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

  return { matches, users };
};

export default useMatches;
