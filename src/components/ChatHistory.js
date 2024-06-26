import React, { useState, useEffect } from "react";
import "./styles/ChatHistory.css";

function ChatHistory({ backendURL, userId, onSelectChat, setCurrentChat }) {
  const [recentChats, setRecentChats] = useState([]);

  //FOR TESTING PURPOSE, WILL DELETE LATER
  // const [recentChats, setRecentChats] = useState([
  //   {
  //     id: 1,
  //     title: "ID 1",
  //     messages: [
  //       { sender: "User", text: "Who is Glamrock Freddy?", ai: false },
  //       {
  //         sender: "AI",
  //         text: "Glamrock Freddy is an animatronic From Five Nights at Freddy's, Security Breach.",
  //         ai: true,
  //       },
  //     ],
  //   },
  //   { id: 9, title: "ID 9" },
  //   { id: 10, title: "ID 10" },
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
      console.log("New state of recentChats: ", recentChats);
    } catch (error) {
      console.error("Error fetching chat history:", error.message);
    }
  };

  const fetchChatTitles = async () => {
    try {
      const response = await fetch(
        `${backendURL}/generate_conv_title/${userId}`
      );
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

  const handleNewChat = async () => {
    try {
      const response = await fetch(
        `${backendURL}/create_new_conversation/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ conversation_title: "New Chat" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create new chat");
      }

      const data = await response.json();
      const newChat = { id: data.new_conversation_id, title: "New Chat" };
      setRecentChats([...recentChats, newChat]);
      setCurrentChat(newChat); // Update current chat to the newly created chat
    } catch (error) {
      console.error("Error creating new chat:", error.message);
    }
  };

  //FOR TESTING PURPOST, WILL DELETE LATER
  // const handleNewChat = async () => {
  //   try {
  //     const newChatId = recentChats.length + 1;
  //     const newChat = {
  //       id: newChatId,
  //       title: `New Chat ${newChatId}`,
  //       messages: [],
  //     };
  //     setRecentChats([...recentChats, newChat]);
  //     setCurrentChat(newChat);
  //   } catch (error) {
  //     console.error("Error creating new chat:", error.message);
  //   }
  // };

  return (
    <div className="recent-container">
      <button className="new-chat-button" onClick={handleNewChat}>
        New Chat
      </button>
      <h3 className="recent-header">Recent Chats</h3>
      <ul className="recent-chats-list">
        {recentChats.map((chat) => (
          <li
            key={chat.id}
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
