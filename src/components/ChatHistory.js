import React, { useState, useEffect } from "react";
import "./styles/ChatHistory.css";

//Mock data test, will remove it later
// const mockRecentChats = [
//   { id: 1, title: "Chat 1" },
//   { id: 2, title: "Chat 2" },
//   { id: 3, title: "Chat 3" },
// ];

function ChatHistory({ backendURL, userId, onSelectChat }) {
  const [recentChats, setRecentChats] = useState([]);
  //Fetch chat history on component mount
  useEffect(() => {
    fetchChatHistory();
  }, []);

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
          <li
            key={chat.id}
            className="recent-chat-item"
            onClick={() => onSelectChat(chat)}
          >
            <div className="chat-info">
              <span
                className={chat.is_from_bot ? "bot-message" : "user-message"}
              >
                {chat.content}
              </span>
              {"\n"}
              <span className="time">{chat.time_in_edt}</span>
            </div>
          </li>
        ))}

        {/* This is used for mock data test, will remove it later  */}
        {/* {mockRecentChats.map((chat) => (
          <li
            key={chat.id}
            className="recent-chat-item"
            onClick={() => onSelectChat(chat)}
          >
            <div className="chat-info">
              <span>{chat.title}</span>
            </div>
          </li>
        ))} */}
      </ul>
    </div>
  );
}

export default ChatHistory;
