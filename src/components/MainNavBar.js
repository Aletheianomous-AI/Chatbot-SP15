import React, { useState } from "react";

import { useNavigate, Link, useLocation } from "react-router-dom";
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

  return (
    <nav>
      <h1 className="brand-name-button" onClick={handleH1Click}>
        ALETHEIANOMOUS AI
      </h1>
        <ul>
          <li>
            <Link to="/contact" className="">
              Contact Us
            </Link>
          <li>
            {/* TODO: Insert the static website for final report here */}
            <a href="https://aletheianomous-ai.github.io/">Our Team</a>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default MainNavBar;
