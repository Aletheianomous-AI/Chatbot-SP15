import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/ChatWindow.css";
import { useNavigate } from "react-router-dom";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { ai: true, text: "Hello! How can I help you?" },
    { ai: false, text: "Hi, I need help with my React project." },
    {
      ai: true,
      text: "Sure, I can help you with that. What seems to be the problem?",
    },
  ]);

  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage = { ai: false, text: inputValue };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  return (
    <div className="container">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.ai ? "ai" : "user"}`}
          >
            <span>{message.text}</span>
          </div>
        ))}
        <div className="input-box">
          <div className="chat-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message here..."
            />
            <button onClick={handleSend} className="send-button">
              <span className="send-icon">&#8594;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
