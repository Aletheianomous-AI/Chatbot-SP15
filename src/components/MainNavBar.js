import React, { useState } from "react";
import "./styles/MainNavBar.css";
import { useNavigate } from "react-router-dom";

// MainNavBar component
function MainNavBar() {
  const navigate = useNavigate();

  const handleH1Click = () => {
    // navigate to the main homepage
    navigate("/");
  };
  return (
    <nav>
      {/* TODO: Adding brand logo here */}
      <h1 className="brand-name-button" onClick={handleH1Click}>
        ALETHEIANOMOUS AI
      </h1>

      <ul className="nav-links">
        <li>
          <a
            href="https://github.com/Alethianomous-AI/Chatbot-SP15"
            target="_blank"
            rel="noreferrer"
          >
            Github Repo
          </a>
        </li>
        <li>
          <a href="/final-report">Final Report</a>
        </li>
        <li>
          <a href="/video-presentation">Video Presentation</a>
        </li>
      </ul>
    </nav>
  );
}

export default MainNavBar;
