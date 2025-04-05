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
          Thank you for using Aletheianomous AI. At this time, we are no longer offering this service. For more information about how this project was created, click on "Learn More", or "Contact Us". Note that clicking "Learn More" will redirect you to an external site.
        </p>
	 <p>
		<b>Disclaimer: </b>
The views expressed on this site are not representative of Accenture, Avanade, or the employers of the developers who created the site.
	  </p>
        <div className="button-group">
          <button className="learn-more-button" onClick={() => window.location.replace("http://aletheianomous-ai.github.io")}>
            Learn More
          </button>
          <button className="contact-button" onClick={() => navigate("/contact")}>
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
