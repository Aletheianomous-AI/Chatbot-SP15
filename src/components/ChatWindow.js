import React, { useState, useEffect } from "react";
import "./styles/ChatWindow.css";

//Chat window only
const ChatWindow = ({ backendURL, userId, currentChat }) => {
  const [messages, setMessages] = useState([]);

  //FOR TESTING PURPOSE, WILL DELETE LATER
  // const [messages, setMessages] = useState([
  //   { sender: "User", text: "Hello!", ai: false },
  //   { sender: "AI", text: "Hi there! How can I help you?", ai: true },
  // ]);

  const [inputValue, setInputValue] = useState("");
  const [chatTitle, setChatTitle] = useState("");

  useEffect(() => {
    if (currentChat) {
      // Update chat title when current chat changes
      setChatTitle(currentChat.title);
      //Update current message in current chat
      setMessages(messages);
    }
  }, [currentChat]);

  const sendMessageToBackend = async (message) => {
    try {
      const response = await fetch(
        `${backendURL}/post_chat/${userId}`, //Need to update with the actual user ID
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chat_data: message }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      // Handle response if needed
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const getResponseFromAI = async (message) => {
    // Send user message to backend
    await sendMessageToBackend(message);

    // Receive AI response from backend
    try {
      const response = await fetch(
        `${backendURL}/generate_response/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chat_data: message }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to receive AI response");
      }

      const responseData = await response.json();
      const aiResponse = responseData.ai_output;

      // Update chat window with AI response
      setMessages([...messages, { sender: "AI", text: aiResponse.content }]);
    } catch (error) {
      console.error("Error receiving AI response:", error.message);
    }
  };

  const handleSend = async () => {
    if (inputValue.trim()) {
      const userMessage = { sender: "User", text: inputValue };
      setMessages([...messages, userMessage]);
      await getResponseFromAI(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents adding a new line in the input field
      handleSend();
    }
  };

  return (
    <div className="window-container">
      <div className="chat-container">
        <h3>{chatTitle}</h3>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className="chat-message">
              <div className={`sender ${message.sender.toLowerCase()}`}>
                {message.sender}
              </div>
              <div className={`chat-bubble ${message.ai ? "ai" : "user"}`}>
                <span>{message.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* This is the input box at the bottom of the page  */}
      <div className="input-box">
        <div className="chat-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
          />
          <button onClick={handleSend} className="send-button">
            <span className="send-icon">&#8594;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
