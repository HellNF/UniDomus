import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from './../AuthContext';
import { API_BASE_URL,SOCKET_URL } from '../constant';
import useMatches from '../hooks/useMatches';

import {
  MinChatUiProvider,
  MainContainer,
  MessageContainer,
  MessageList,
  MessageHeader,
  Message
} from "@minchat/react-chat-ui";
import sendIcon from '../assets/send.svg';


const socket = io(`${SOCKET_URL}`, { transports: ['websocket'] });

const Chat = () => {
  const { matchID } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { matches, users } = useMatches();
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!matchID) return;

    const fetchMatchDetails = async () => {
      try {
        console.log('Fetching match details'); // Debug log
        const response = await fetch(`${API_BASE_URL}matches/${matchID}`, {
          headers: {
            'x-access-token': localStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setMessages(data.match.messages.map(msg => ({ ...msg, read: false }))); // Add read property

        // Fetch details of the other user
        const otherUserId = data.match.requesterID !== userId ? data.match.requesterID : data.match.receiverID;
        fetchUserDetails(otherUserId);
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    const fetchUserDetails = async (userId) => {
      try {
        console.log('Fetching user details'); // Debug log
        const response = await fetch(`${API_BASE_URL}users/${userId}`, {
          headers: {
            'x-access-token': localStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
        });
        const userData = await response.json();
        const user = userData.user;
        if (user.proPic) {
          user.proPic = `data:image/png;base64,${user.proPic}`;
        }
        setOtherUser(user);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchMatchDetails();

    socket.on('message', (newMessage) => {
      console.log('New message received:', newMessage); // Debug log
      if (newMessage.matchID === matchID) {
        setMessages((prevMessages) => [...prevMessages, { ...newMessage, read: false }]);
        scrollToBottom();
      }
    });

    return () => {
      socket.off('message');
    };
  }, [matchID, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (message.trim()) {
      console.log('Sending message:', message); // Debug log
      const tempMessage = { text: message, userID: userId, date: new Date().toISOString(), matchID };

      setMessage(''); // Clear the input after sending

      // Emit the message to the socket for real-time update
      socket.emit('message', tempMessage);
      console.log('Emitted message to socket:', tempMessage); // Debug log

      try {
        const response = await fetch(`${API_BASE_URL}matches/${matchID}/messages`, {
          method: 'POST',
          headers: {
            'x-access-token': localStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: tempMessage.text, userID: tempMessage.userID }),
        });

        console.log('Message sent, server response:', response); // Debug log
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.log('Message is empty'); // Debug log
    }
  };

  const handleSend = () => {
    console.log('handleSend called'); // Debug log
    sendMessage();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!matchID) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-gray-900">No chat selected</h2>
        </div>
      </div>
    );
  }

  return (
    <MinChatUiProvider theme="#6ea9d7">

      <div className="flex items-center justify-center min-h-screen bg-blue-950">
        <div className="bg-white max-w-7xl w-full p-6 rounded-lg shadow-lg">
          <div className="flex flex-col items-center justify-center bg-white py-4">
            <h1 className="text-3xl font-semibold leading-7 text-gray-900">Chat Room</h1>

          </div>
          <div className="flex h-full">
            <div className="bg-gray-100 pt-10 pl-2 overflow-y-auto rounded-lg shadow-md flex flex-col ">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900">Matches</h2>
              <div className="mt-4 pt-2 h-flex h-full">
                {matches.length > 0 ? (
                  matches.map((match) => {
                    const otherUserId = match.requesterID === userId ? match.receiverID : match.requesterID;
                    const otherUser = users[otherUserId];

                    return (
                      <Link to={`/chat/${match._id}`} key={match._id} className="flex items-center p-2  hover:bg-gray-200 rounded-md">
                        {otherUser && (
                          <div className="flex items-center">
                            {otherUser.proPic ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={otherUser.proPic}
                                alt="propic"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                            )}
                            <div className="ml-3 ">
                              <p className="font-semibold text-gray-900">{otherUser.username}</p>
                              <p className="text-sm text-gray-500">{match.matchType}</p>
                            </div>
                          </div>
                        )}
                      </Link>
                    );
                  })
                ) : (
                  <p className="text-gray-500">Nessun match accettato</p>
                )}
              </div>
              <button onClick={handleGoBack} className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 m-4">
                Indietro
              </button>
            </div>
            {
              matchID == "index" ? "" :

                <div className="flex flex-1 flex-col bg-white p-2 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
                  <MainContainer style={{ height: '100%' }}>
                    <MessageContainer>
                      <MessageHeader title={otherUser ? otherUser.username : "Loading..."} />
                      <MessageList
                        currentUserId={userId}
                        messages={messages.map(msg => ({
                          text: msg.text,
                          user: { id: msg.userID },
                          timestamp: msg.date,
                          read: msg.read
                        }))}
                      />
                      <div className="flex mt-2">
                        <input
                          type="text"
                          placeholder="Scrivi un messaggio"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1 p-2 border border-gray-300 rounded"
                        />
                        <button onClick={handleSend} className="ml-2 p-2">
                          <img src={sendIcon} alt="Send" className="h-12 w-12 bg-slate-300 rounded-md" />
                        </button>
                      </div>
                    </MessageContainer>
                  </MainContainer>
                  <div ref={messagesEndRef} />
                </div>
            }
          </div>
        </div>
      </div>

    </MinChatUiProvider>
  );
};

export default Chat;
