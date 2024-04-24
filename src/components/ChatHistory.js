import React, { useState, useEffect } from "react";
import "./styles/ChatHistory.css";

function ChatHistory({ backendURL, userId, onSelectChat, onNewChat }) {
  const [recentChats, setRecentChats] = useState([]);

  //FOR TESTING PURPOSE, WILL DELETE LATER
  // const [recentChats, setRecentChats] = useState([
  //   { id: 1, title: "Chat 1" },
  //   { id: 9, title: "Chat 9" },
  //   { id: 10, title: "Chat 10" },
  // ]);

  useEffect(() => {
    fetchChatHistory(); //Fetch chat history on component mount
    fetchChatTitles(); // Fetch chat titles when component mounts
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${backendURL}/get_chat/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat history");
      }
      const data = await response.json();
      console.log(data.chat_history);
      setRecentChats(data.chat_history);
    } catch (error) {
      console.error("Error fetching chat history:", error.message);
    }
  };


 	
  const fetchChatTitles = async () => {
    try {
      const response = await fetch(`${backendURL}/generate_conv_title/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat titles");
      }
      const data = await response.json();
      console.log(data.conversation_title);
      setRecentChats(data.conversation_title);
    } catch (error) {
      console.error("Error fetching chat titles:", error.message);
    }
  };

  return (
    <div className="recent-container">
      <button className="new-chat-button" onClick={onNewChat}>
        New Chat
      </button>
      <h3 className="recent-header">Recent Chats</h3>
      <ul className="recent-chats-list">
        {recentChats.map((chat) => (
          <li
            key={chat.conversation_id}
            className="recent-chat-item"
            onClick={() => onSelectChat(chat)}
          >
            <div className="chat-info">
              <span>{chat.title}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatHistory;
