import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './../AuthContext';
import UniDomusLogo from "/UniDomusLogoWhite.png";
import { API_BASE_URL } from '../constant';
import {
  MinChatUiProvider,
  MainContainer,
  MessageInput,
  MessageContainer,
  MessageList,
  MessageHeader
} from "@minchat/react-chat-ui";

const socket = io('http://localhost:5050', { transports: ['websocket'] }); // Ensure this URL matches your backend server

const Chat = () => {
  const { matchID } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}matches/${matchID}`, {
          headers: {
            'x-access-token': localStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setMessages(data.match.messages);

        // Fetch details of the other user
        const otherUserId = data.match.requesterID !== userId ? data.match.requesterID : data.match.receiverID;
        fetchUserDetails(otherUserId);
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    const fetchUserDetails = async (userId) => {
      try {
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
      // Only add the message if it's not from the current user
      if (newMessage.userID !== userId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.off('message');
    };
  }, [matchID, userId]);

  const sendMessage = async () => {
    if (message.trim()) {
      const tempMessage = { text: message, userID: userId, date: new Date().toISOString(), _id: `temp-${Date.now()}` };

      // Add the message to the UI immediately
      setMessages((prevMessages) => [...prevMessages, tempMessage]);
      setMessage(''); // Clear the input after sending

      // Emit the message to the socket for real-time update
      socket.emit('message', tempMessage);

      try {
        const response = await fetch(`${API_BASE_URL}matches/${matchID}/messages`, {
          method: 'POST',
          headers: {
            'x-access-token': localStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: tempMessage.text, userID: tempMessage.userID }),
        });
        const data = await response.json();
        
        // Replace the temporary message with the one from the server
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === tempMessage._id ? data.match.messages[data.match.messages.length - 1] : msg
          )
        );
      } catch (error) {
        console.error('Error sending message:', error);
        // Remove the temporary message if there was an error
        setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== tempMessage._id));
      }
    }
  };

  const handleSendMessage = (text) => {
    setMessage(text);
    sendMessage();
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <MinChatUiProvider theme="#6ea9d7">
      <div className="flex items-center justify-center min-h-screen bg-blue-950">
        <div className="bg-blue-950 max-w-7xl w-full p-6">
          <div className="bg-blue-950 object-center">
            <div className="flex max-w-6xl min-h-full flex-1 flex-col justify-center px-12 py-4 lg:px-8">
              <div className="space-y-6">
                <div className="space-y-3 border-gray-900/10 py-2 flex flex-col items-center justify-center">
                  <img className="mx-auto h-28 w-auto" src={UniDomusLogo} alt="Unidomus" />
                  <h1 className="text-4xl font-semibold leading-7 text-white">Chat Room</h1>
                  {otherUser && (
                    <h2 className="text-2xl font-semibold leading-7 text-white">{otherUser.username}</h2>
                  )}
                </div>
                <div className="bg-white rounded-lg p-8 shadow-md">
                  <MainContainer style={{ height: '70vh' }}>
                    <MessageContainer>
                      <MessageHeader title={otherUser ? otherUser.username : "Loading..."} />
                      <MessageList
                        currentUserId={userId}
                        messages={messages.map(msg => ({
                          text: msg.text,
                          user: { id: msg.userID },
                          timestamp: msg.date
                        }))}
                      />
                      <MessageInput placeholder="Type message here" onSend={handleSendMessage} />
                    </MessageContainer>
                  </MainContainer>
                </div>
                <button onClick={handleGoBack} className="mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700">
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MinChatUiProvider>
  );
};

export default Chat;
