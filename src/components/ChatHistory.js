import React, { useState, useEffect } from "react";
import "./styles/ChatHistory.css";

function ChatHistory({ backendURL, userId }) {
  const [recentChats, setRecentChats] = useState([]);
  useEffect(() => {
    fetchChatHistory();
  }, []); // Fetch chat history on component mount

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${backendURL}/get_chat/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat history");
      }
      const data = await response.json();
      setRecentChats(data.chat_history);
    } catch (error) {
      console.error("Error fetching chat history:", error.message);
    }
  };

  return (
    <div className="recent-container">
      <button className="new-chat-button">New Chat</button>
      <h3 className="recent-header">Recent</h3>
      <ul className="recent-chats-list">
        {recentChats.map((chat) => (
          <li key={chat.id} className="recent-chat-item">
            <div className="chat-name">{chat.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatHistory;
