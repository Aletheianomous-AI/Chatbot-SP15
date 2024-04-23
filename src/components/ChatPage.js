import React, { useState } from "react";
import ChatHistory from "./ChatHistory";
import ChatWindow from "./ChatWindow";
import "./styles/ChatPage.css";

//Full chatpage with chatwindow and chathistory
const ChatPage = () => {
  const backendURL = "http://172.208.66.211:5000";
  const [recentChats, setRecentChats] = useState([]);
  const userId = "1"; // Replace with the actual user ID
  const [currentChat, setCurrentChat] = useState(null); // State to track current chat

  const handleChatSelect = (chat) => {
    setCurrentChat(chat); // Update current chat when a chat is selected
  };

  const handleNewChat = async (user_input) => {
    try {
      // Call the /generate_conv_title/ endpoint to generate conversation title
      const response = await fetch(`${backendURL}/generate_conv_title`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: user_input }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate conversation title");
      }

      const data = await response.json();
      const conversationTitle = data.conversation_title;

      // Generate a new chat object with the received conversation title
      const newChat = { id: recentChats.length + 1, title: conversationTitle };

      // Add the new chat to the list of recent chats
      setRecentChats([...recentChats, newChat]);

      // Set the new chat as the current chat
      setCurrentChat(newChat);

      console.log("Opening a new chat window with title:", conversationTitle); // for testing purpose
    } catch (error) {
      console.error("Error generating conversation title:", error.message);
    }
  };

  //Make the history sidebar resizeable
  const [width, setWidth] = useState(300);
  const [mouseDown, setMouseDown] = useState(false);

  const handleMouseDown = (event) => {
    setMouseDown(true);
    event.preventDefault();
  };

  const handleMouseUp = (_event) => {
    setMouseDown(false);
  };

  const handleMouseMove = (event) => {
    if (mouseDown) {
      setWidth(event.pageX);
    }
  };
  //----------------------

  return (
    <div
      className="container"
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div
        className="recent-column"
        style={{ width: width }}
        onMouseDown={handleMouseDown}
      >
        <ChatHistory
          backendURL={backendURL}
          userId={userId}
          onSelectChat={handleChatSelect}
          onNewChat={handleNewChat}
          recentChats={recentChats}
        />
      </div>

      <div className="main-chat-window">
        <ChatWindow
          backendURL={backendURL}
          userId={userId}
          currentChat={currentChat}
        />
      </div>
    </div>
  );
};

export default ChatPage;
