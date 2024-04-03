import React from "react";
import "./styles/HomePage.css";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();
  const headshotImages = [
    '/images/David-img.jpg',
    '/images/Aimi-img.jpg',
    '/images/Ethan-img.jpg',
    '/images/Matthew-img.jpg',
  ];
  return (
    <div className="homepage">
      <div className="left">
        <h3>SP15</h3>
        <h1>Aletheianomous AI</h1>
        <p>Charting New Horizons in Conversations: Your Partner for Authentic and Insightful Chats.</p>
        <div className="button-group">
          <button className="login-button" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="signup-button" onClick={() => navigate("/signup")}>
            Sign up
          </button>
        </div>
      </div>
      <div className="right">
        <div className="card">
        <h3>Project Overview</h3>
          <div className="overview">
            
            <p>Developed by Team SP-15 as a culmination of our senior project, Aletheianomous Al is an innovative chatbot application poised to revolutionize user engagement in conversations. This intelligent chat companion is crafted with a focus on authenticity, delivering interactions that are genuine and transparent. Explore the future of conversations, where authenticity meets intelligent discourse, with Aletheianomous Al.</p>
          </div>
          <h3>Contributors</h3>
          <div className="contributors">
            {headshotImages.map((imageSrc, index) => (
              <div key={index} style={{ width: '100px', height: '100px', margin: '20px', overflow: 'hidden' }}>
                <img src={imageSrc} alt={`Headshot ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5%' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default HomePage;
