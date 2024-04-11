import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./styles/MainNavBar.css";
import UserNavBar from "./UserNavBar";

// MainNavBar component
function MainNavBar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const handleH1Click = () => {
    // navigate to the main homepage
    navigate("/");
  };
  // const handleLogout = () => {
  //   // Add logout logic here
  //   setIsLoggedIn(false);
  // };

  return (
    <nav>
      {/* TODO: Adding brand logo here */}
      <h1 className="brand-name-button" onClick={handleH1Click}>
        ALETHEIANOMOUS AI
      </h1>

      {location.pathname === "/chatpage" ? (
        <UserNavBar />
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
