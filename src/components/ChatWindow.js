import React, { useState} from "react";
import "./styles/ChatWindow.css";

//Chat window only
const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { ai: true, sender:"Aletheianomous AI", text: "Hello! How can I help you?" },
    { ai: false, sender:"User", text: "Hi, I need help with my React project." },
    {
      ai: true,
      sender:"Aletheianomous AI",
      text: "Sure, I can help you with that. What seems to be the problem?",
    },
  ]);

  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage = { ai: false, sender: "User", text: inputValue };
      setMessages([...messages, newMessage]);
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
            <h3>Chat Header</h3>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className="chat-message">
                <div className={`sender ${message.sender.toLowerCase()}`}>{message.sender}</div>
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
