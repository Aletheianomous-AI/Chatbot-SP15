import React, { useState } from "react";
import ChatHistory from "./ChatHistory";
import ChatWindow from "./ChatWindow";
import "./styles/ChatPage.css";

//Full chatpage with chatwindow and chathistory
const ChatPage = () => {
  const backendURL = "http://172.208.66.211:5000";
  const userId = "1"; // Replace with the actual user ID

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
        <ChatHistory backendURL={backendURL} userId={userId} />
      </div>

      <div className="main-chat-window">
        <ChatWindow backendURL={backendURL} userId={userId} />
      </div>
    </div>
  );
};

export default ChatPage;
