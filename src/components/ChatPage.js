import React, { useState } from "react";
import ChatHistory from "./ChatHistory";
import ChatWindow from "./ChatWindow";
import "./styles/ChatPage.css";

//Full chatpage with chatwindow and chathistory
const ChatPage = () => {
  const backendURL = "http://172.208.66.211:5000";
  const [recentChats, setRecentChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null); // State to track current chat

  let decodedCookie = decodeURIComponent(document.cookie);
  console.log("Read cookie: ", decodedCookie);

  let temp_uid = "";

  let ca = decodedCookie.split(';');
  var key = "user_id";
  for (let i = 0; i <ca.length; i++) {
    let c = ca[i];
    c = c.split("=");
    if (c[0] === key) {
      temp_uid = c[1];
      break;
    }
    else {
      temp_uid = c[1];
    }
  }
  
  if (temp_uid === "") {
    throw new Error("Unable to find user id cookie.");
  }
  else {
    console.log(temp_uid);
  }

  const [userId, setUserId] = useState(temp_uid);


  const handleChatSelect = (chat) => {
    setCurrentChat(chat); // Update current chat when a chat is selected
  };

  
  const handleNewChat = async (user_input) => {
    try {

      console.log("Generating new chat title.");
      console.log(user_input); // User input does not return a string of chat message.
// Call the /generate_conv_title/ endpoint to generate conversation title
      const response = await fetch(`${backendURL}/generate_conv_title/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
	      body: JSON.stringify({ chat_data: user_input, debug_mode: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate conversation title");
      }

      console.log("Got conversation title");
      const data = await response.json();
      const conversationTitle = data.conversation_title;
      console.log("Got conversation title", data.conversation_title);
      // Generate a new chat object with the received conversation title
      const newChat = { id: recentChats.length + 1, title: conversationTitle };
      console.log("Created new chat object.");
      // Add the new chat to the list of recent chats
      setRecentChats([...recentChats, newChat]);
      console.log("Appended recent chats");
      // Set the new chat as the current chat
      setCurrentChat(newChat);
      console.log("Set new chat as current object");

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
          recentChats={recentChats}
          setCurrentChat={setCurrentChat}
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
