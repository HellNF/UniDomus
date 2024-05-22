import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import UniDomusLogo from "/UniDomusLogoWhite.png";
import { API_BASE_URL } from '../constant';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  MessageSeparator
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const socket = io('http://localhost:5050', { transports: ['websocket'] }); // Ensure this URL matches your backend server

const Chat = () => {
  const { matchID } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

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
              <button onClick={handleGoBack} className="mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700">
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
