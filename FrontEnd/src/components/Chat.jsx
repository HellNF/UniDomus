import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './../AuthContext';
import UniDomusLogo from "/UniDomusLogoWhite.png";
import { API_BASE_URL } from '../constant';

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
        const otherUserId = data.match.requesterID !== userId ? data.match.requesterID : data.match.responderID;
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
        setOtherUser(userData.user);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchMatchDetails();

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, [matchID, userId]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { user: userId, text: message, date: new Date().toISOString() };
      socket.emit('message', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleRemoveChat = async () => {
    try {
      await fetch(`${API_BASE_URL}matches/${matchID}`, {
        method: 'DELETE',
        headers: {
          'x-access-token': localStorage.getItem("token"),
          'content-type': 'application/json'
        },
      });
      navigate('/chats'); // Redirect to chats list after deleting the chat
    } catch (error) {
      console.error("Error removing chat:", error);
    }
  };

  return (
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
                <div className="messages flex flex-col space-y-2 overflow-y-auto h-80">
                  {messages.map((msg, index) => (
                    <div key={index} className={`message p-2 rounded ${msg.user === userId ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'}`}>
                      <strong>{msg.user === userId ? 'You' : otherUser ? otherUser.username : 'Unknown User'}: </strong>
                      <span>{msg.text}</span>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSubmit} className="mt-4 flex">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                  <button type="submit" className="ml-2 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Send
                  </button>
                </form>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => window.history.back()}
              >
                Back
              </button>
              <button
                type="button"
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleRemoveChat}
              >
                Remove Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
