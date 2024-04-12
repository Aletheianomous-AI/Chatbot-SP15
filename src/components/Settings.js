import React, { useState } from "react";
import "./styles/Settings.css";
import AccountInfoTab from "./AccountInfoTab";
import PrivacyTab from "./PrivacyTab";
//Settings Page inside the ChatPage

const Settings = () => {
  // State to keep track of the active tab
  const [activeTab, setActiveTab] = useState("account");
  return (
    <div className="main-container">
      <div className="left-column">
        <button
          className={`acc-info-btn ${activeTab === "account" ? "active" : ""}`}
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
  );
};

export default Settings;
