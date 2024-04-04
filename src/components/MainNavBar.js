import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/MainNavBar.css";
import { useNavigate } from "react-router-dom";

// MainNavBar component
function MainNavBar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleH1Click = () => {
    // navigate to the main homepage
    navigate("/");
  };
  const handleAvatarClick = () => {
    // handle avatar click (e.g., show popup)
    // For simplicity, I'll just toggle the login state
    setIsLoggedIn(!isLoggedIn);
  };

  const handleLogout = () => {
    // Add logout logic here
    setIsLoggedIn(false);
  };

  return (
    <nav>
      {/* TODO: Adding brand logo here */}
      <h1 className="brand-name-button" onClick={handleH1Click}>
        ALETHEIANOMOUS AI
      </h1>

      {isLoggedIn ? (
        <div className="user-avatar-container" onClick={handleAvatarClick}>
          {/* User avatar component */}
          <img src="/path/to/avatar.png" alt="Avatar" />
          <div className="avatar-popup">
            <button onClick={handleLogout}>Logout</button>
            <Link to="/settings">Settings</Link>
          </div>
        </div>
      ) : (
        <ul>
          <li>
            <a href="https://github.com/Alethianomous-AI/Chatbot-SP15">
              Github Repo
            </a>
          </li>
          <li>
            <Link to="/final-report">Final Report</Link>
          </li>
          <li>
            <Link to="/video-presentation">Video Presentation</Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default MainNavBar;
