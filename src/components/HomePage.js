import React from "react";
import "./styles/HomePage.css";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <div className="title-container">
        <img src="/images/alethe-logo.png" alt="aletheianomous-AI-logo"></img>

        <h1>Aletheianomous AI</h1>
        <p>
          Charting New Horizons in Conversations: Your Partner for Authentic and
          Insightful Chats.
        </p>
        <div className="button-group">
          <button className="login-button" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="signup-button" onClick={() => navigate("/signup")}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
