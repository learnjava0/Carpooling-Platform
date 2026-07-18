import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { chatService } from '../../services/chatService';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { Send, ArrowLeft, User as UserIcon } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const trip = location.state?.trip || null;
  
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!trip) return;

    const initChat = async () => {
      try {
        const history = await chatService.getChatHistory(trip.id);
        setMessages(history || []);
      } catch (err) {
        console.error('Failed to fetch chat history', err);
      }

      // Connect WebSocket
      const socket = new SockJS('http://localhost:8080/ws');
      const client = Stomp.over(socket);
      
      client.debug = () => {};

      client.connect({}, () => {
        client.subscribe(`/topic/chat/${trip.id}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prev) => {
            // Prevent duplicates if STOMP delivers a message we just sent/loaded
            if (prev.some(m => m.timestamp === receivedMessage.timestamp && m.senderEmail === receivedMessage.senderEmail)) {
               return prev;
            }
            return [...prev, receivedMessage];
          });
        });
      }, (error) => {
        console.error('STOMP error:', error);
      });

      setStompClient(client);
    };

    initChat();

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, [trip]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim() && stompClient && stompClient.connected) {
      const chatMessage = {
        tripId: trip.id,
        senderName: `${user.firstName} ${user.lastName}`,
        senderEmail: user.email,
        message: currentMessage.trim(),
        timestamp: new Date().toISOString()
      };
      
      stompClient.send(`/app/chat/${trip.id}`, {}, JSON.stringify(chatMessage));
      setCurrentMessage('');
    }
  };

  if (!trip) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-bold">No Active Trip Selected</h2>
        <button onClick={() => navigate(-1)} className="text-primary-500 mt-4 underline">Go Back</button>
      </div>
    );
  }

  const otherPersonName = trip.ride?.driver?.email === user.email 
    ? trip.passenger?.firstName 
    : trip.ride?.driver?.firstName;

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-3 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">{otherPersonName || 'Chat'}</h2>
              <p className="text-xs text-green-500 font-medium flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Online
              </p>
            </div>
          </div>
        </div>
        <div className="text-xs bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 font-medium">
          Trip #{trip.id}
        </div>
      </div>

      {/* Chat Messages Window */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
        
        <div className="text-center text-xs text-slate-400 my-4">
          Chat started securely. Messages are not saved after the trip.
        </div>

        {messages.map((msg, idx) => {
          const isMe = msg.senderEmail === user.email;
          return (
            <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-slate-400 mb-1 px-1">{isMe ? 'You' : msg.senderName}</span>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                isMe 
                  ? 'bg-primary-600 text-white rounded-br-sm' 
                  : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-600 rounded-bl-sm shadow-sm'
              }`}>
                {msg.message || msg.content}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input 
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-full px-5 focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
          />
          <button 
            type="submit"
            disabled={!currentMessage.trim()}
            className="w-12 h-12 rounded-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white flex items-center justify-center transition-colors shrink-0 shadow-sm"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default Chat;
