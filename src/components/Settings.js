import React, { useState } from "react";

import "./styles/Settings.css";
import AccountInfoTab from "./AccountInfoTab";
import PrivacyTab from "./PrivacyTab";
import { useNavigate } from "react-router-dom";

//Settings Page inside the ChatPage

const Settings = () => {
  const navigate = useNavigate(); // Initialize useHistory hook
  // State to keep track of the active tab
  const [activeTab, setActiveTab] = useState("account");
  const handleCloseButtonClick = () => {
    // Navigate back to the chat page
    navigate("/chatpage");
  };
  return (
    <div className="setting-container">
      <div className="settings-bar">
        <h1 className="settings-heading">SETTINGS</h1>
        <button className="close-btn" onClick={handleCloseButtonClick}>
          X
        </button>
      </div>

      <div className="main-container">
        <div className="left-column">
          <button
            className={`acc-info-btn ${
              activeTab === "account" ? "active" : ""
            }`}
            onClick={() => setActiveTab("account")}
          >
            Account & Security
          </button>
          <button
            className={`privacy-btn ${activeTab === "privacy" ? "active" : ""}`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy
          </button>
        </div>
        <div className="right-column">
          {activeTab === "account" ? <AccountInfoTab /> : <PrivacyTab />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
