import React, { useState } from 'react';
import "./styles/ChatHistory.css";

function ChatHistory() {
  const [recentChats, setRecentChats] = useState([
    {id: 1, name:'History of AI'},
    {id: 2, name:'React Help'},
  ]);



  return (
    <div className="recent-container">
      <button className='new-chat-button'>New Chat</button>
      <h3 className='recent-header'>Recent</h3>
      <ul className='recent-chats-list'>
        {recentChats.map((chat) => (
          <li key={chat.id} className="recent-chat-item" >
            <div className="chat-name">{chat.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatHistory;
