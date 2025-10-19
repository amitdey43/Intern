import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { socket } from "../utilis/socket.js";


const SendIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2 .01 7z" />
  </svg>
);

const Avatar = ({ user }) => {
  const avatarUrl =
    user === "mentor"
      ? `https://placehold.co/40x40/E2E8F0/4A5568?text=M`
      : `https://placehold.co/40x40/3B82F6/FFFFFF?text=U`;
  return (
    <img src={avatarUrl} alt={`${user} avatar`} className="w-10 h-10 rounded-full" />
  );
};

const MessageBubble = ({ message }) => {
  const { message: text, senderRef } = message;
  const isMentor = senderRef === "Mentor";

  return (
    <div
      className={`flex items-start gap-3 my-4 ${
        isMentor ? "justify-end" : "justify-start"
      }`}
    >
      {!isMentor && <Avatar user="user" />}
      <div
        className={`max-w-xs md:max-w-md p-4 rounded-2xl ${
          isMentor
            ? "bg-green-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-tl-none"
        }`}
      >
        <p className="text-sm">{text}</p>
      </div>
      {isMentor && <Avatar user="mentor" />}
    </div>
  );
};

// --- Main Chat Component ---
export const MentorUserChat = () => {
  let { mentorId, userId } = useParams(); // flipped order in URL maybe
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  // Join room & fetch old messages
  useEffect(() => {
    if (!mentorId || !userId) return;

    socket.emit("join_room", { userid: userId, mentorid: mentorId });

    socket.on("chat:oldMessages", (oldMsgs) => {
      setMessages(oldMsgs);
    });

    socket.on("chat:message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat:oldMessages");
      socket.off("chat:message");
    };
  }, [mentorId, userId]);

  // Auto-scroll to latest
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const msgData = {
      senderSide: mentorId,
      senderRef: "Mentor",
      receiverSide: userId,
      receiverRef: "User",
      message: newMessage,
    };

    socket.emit("chat:message", msgData);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src="https://placehold.co/48x48/3B82F6/FFFFFF?text=U"
                alt="User Avatar"
                className="w-12 h-12 rounded-full"
              />
              <span className="absolute bottom-0 right-0 block h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Chat with User</h1>
              <p className="text-sm text-green-600">Active now</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="container mx-auto">
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={!newMessage.trim()}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};
