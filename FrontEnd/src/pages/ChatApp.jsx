import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../AuthContext';
import UniDomusLogo from "/UniDomusLogoWhite.png";
import { API_BASE_URL, matchStatusEnum ,SOCKET_URL} from '../constant';
import useReport from '../hooks/useReport';
import ReportPopup from '../components/ReportPopup';
import reportIcon from '../assets/report.svg';
import trashIcon from '../assets/trash.svg';

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  MessageSeparator
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const socket = io(`${SOCKET_URL}`, { transports: ['websocket'] });

const ChatApp = () => {
  const { matchID } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState({});
  const messagesEndRef = useRef(null);

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
    if (matchID) {
      fetchMatchDetails(matchID);
    } else {
      fetchMatches();
    }

    socket.on('message', (newMessage) => {
      if (newMessage.userID !== userId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.off('message');
    };
  }, [matchID, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMatchDetails = async (matchID) => {
    try {
      const response = await fetch(`${API_BASE_URL}matches/${matchID}`, {
        headers: {
          'x-access-token': localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Match data:', data); // Log match data for debugging
      setMessages(data.match.messages.map((msg) => ({
        message: msg.text,
        direction: msg.userID === userId ? "outgoing" : "incoming",
        sentTime: msg.date,
        sender: msg.userID
      })));

      const otherUserId = data.match.requesterID !== userId ? data.match.requesterID : data.match.receiverID;
      fetchUserDetails(otherUserId);
    } catch (error) {
      console.error('Error fetching match details:', error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}users/${userId}?proPic=1`, {
        headers: {
          'x-access-token': localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      });
      const userData = await response.json();
      console.log('Fetched user data:', userData); // Log user data for debugging
      setOtherUser(userData.user);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}matches/user/${userId}`, {
        headers: {
          'x-access-token': localStorage.getItem("token"),
          'content-type': 'application/json'
        },
      });
      const data = await response.json();
      console.log('Fetched matches:', data); // Log fetched matches for debugging
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
    console.log('Users map:', usersMap); // Log the users map for debugging
    setUsers(usersMap);
  };

  const handleRemoveChat = async (matchID) => {
    try {
      await fetch(`${API_BASE_URL}matches/${matchID}`, {
        method: 'DELETE',
        headers: {
          'x-access-token': localStorage.getItem("token"),
          'content-type': 'application/json'
        },
      });
      setMatches(matches.filter(match => match._id !== matchID));
    } catch (error) {
      console.error("Error removing chat:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (innerMessage) => {
    if (innerMessage.trim()) {
      const newMessage = {
        text: innerMessage,
        userID: userId,
        date: new Date().toISOString()
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: newMessage.text,
          direction: "outgoing",
          sentTime: newMessage.date,
          sender: userId
        }
      ]);

      try {
        await fetch(`${API_BASE_URL}matches/${matchID}/messages`, {
          method: 'POST',
          headers: {
            'x-access-token': localStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMessage),
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleSend = (innerMessage) => {
    sendMessage(innerMessage);
    setMessage(''); // Clear the input after sending
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <div className="mb-4">
          <img className="mx-auto h-28 w-auto" src={UniDomusLogo} alt="Unidomus" />
          <h1 className="text-xl font-semibold leading-7 text-center">Chats</h1>
        </div>
        {matches.length > 0 ? (
          matches.map((match) => {
            const otherUserId = match.requesterID === userId ? match.receiverID : match.requesterID;
            const otherUser = users[otherUserId];

            return (
              <div key={match._id} className="bg-white p-4 mb-4 rounded-lg shadow-md flex justify-between items-center">
                <div className="flex flex-col space-y-2">
                  <Link to={`/chat/${match._id}`}>
                    <div className="flex items-center space-x-2">
                      {otherUser?.proPic ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={otherUser.proPic}
                          alt="Profile"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                      )}
                      <p>{otherUser?.username || "Unknown User"}</p>
                    </div>
                    <p><strong>Type:</strong> {match.matchType}</p>
                    <p><strong>Date:</strong> {formatDate(match.requestDate)}</p>
                  </Link>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleButtonClick('match', match._id)} className="p-1 rounded-md">
                    <img src={reportIcon} alt="Report" className="h-6 w-6" />
                  </button>
                  <button onClick={() => handleRemoveChat(match._id)} className="p-1 rounded-md">
                    <img src={trashIcon} alt="Remove" className="h-6 w-6" />
                  </button>
                </div>
                </div>
            );
          })
        ) : (
          <p className="text-gray-500">No accepted matches found.</p>
        )}
      </div>
      <div className="w-3/4 flex flex-col bg-white">
        {matchID ? (
          <>
            <div className="bg-gray-200 p-4 border-b">
              <button onClick={handleGoBack} className="text-blue-500">
                Go Back
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {otherUser?.proPic ? (
                    <img className="h-10 w-10 rounded-full" src={otherUser.proPic} alt="Profile" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                  )}
                  <h1 className="text-xl font-semibold">{otherUser?.username || "Chat Room"}</h1>
                </div>
                <div className="bg-white rounded-lg p-8 shadow-md flex flex-col" style={{ height: '70vh' }}>
                  <div className="messages flex-grow overflow-y-auto px-4">
                    <MessageSeparator content="Start of conversation" />
                    {messages.map((msg, i) => (
                      <Message key={i} model={{
                        message: msg.message,
                        direction: msg.direction,
                        sentTime: msg.sentTime,
                        sender: msg.sender
                      }} />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <MessageInput
                    placeholder="Type message here"
                    value={message}
                    onChange={(val) => setMessage(val)}
                    onSend={handleSend}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
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
};

export default ChatApp;

           
