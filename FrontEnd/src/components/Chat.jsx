// FrontEnd/src/components/Chat.jsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './../AuthContext';
import UniDomusLogo from "/UniDomusLogoWhite.png";

const socket = io('http://localhost:5050'); // Ensure this URL matches your backend server

const Chat = () => {
  const { userId } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Listen for messages from the server
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { user: userId, text: message });
      setMessages((prevMessages) => [...prevMessages, { user: userId, text: message }]);
      setMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-950">
      <div className="bg-blue-950 max-w-7xl w-full p-6">
        <div className="bg-blue-950 object-center">
          <div className="flex max-w-6xl min-h-full flex-1 flex-col justify-center px-12 py-4 lg:px-8">
            <div className="space-y-6">
              <div className="space-y-3 border-gray-900/10 py-2 flex flex-col items-center justify-center">
                <img
                  className="mx-auto h-28 w-auto"
                  src={UniDomusLogo}
                  alt="Unidomus"
                />
                <h1 className="text-4xl font-semibold leading-7 text-white">Chat Room</h1>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-md">
                <div className="messages flex flex-col space-y-2 overflow-y-auto h-80">
                  {messages.map((msg, index) => (
                    <div key={index} className={`message p-2 rounded ${msg.user === userId ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'}`}>
                      <strong>{msg.user}: </strong>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
