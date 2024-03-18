import React from 'react';
import ChatHistory from './ChatHistory';
import ChatWindow from './ChatWindow';
import "./styles/ChatPage.css";

//Full chatpage with chatwindow and chathistory

const ChatPage = () => {
  return (
    <div className="container">
        <div className="recent-column">
            <ChatHistory />
        </div>
        <div className="main-chat-window">
            <ChatWindow />
        </div>
  </div>
  );
};

export default ChatPage;