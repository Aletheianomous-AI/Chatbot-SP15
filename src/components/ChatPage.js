import React from "react";
import ChatHistory from "./ChatHistory";
import ChatWindow from "./ChatWindow";
import "./styles/ChatPage.css";

//Full chatpage with chatwindow and chathistory

const ChatPage = () => {
  const backendURL = "http://172.208.66.211:5000";
  const userId = "1"; // Replace with the actual user ID
  return (
    <div className="container">
      <div className="recent-column">
        <ChatHistory backendURL={backendURL} userId={userId} />
      </div>
      <div className="main-chat-window">
        <ChatWindow backendURL={backendURL} userId={userId} />
      </div>
    </div>
  );
};

export default ChatPage;
