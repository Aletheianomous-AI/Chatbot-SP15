import React, { useState } from "react";
import "./styles/PrivacyTab.css";

//Privacy tab in settings page

const PrivacyTab = () => {
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  return (
    <div className="privacy-container">
      <div className="settings-bar">SETTINGS</div>
      <h2 className="right-heading">PRIVACY</h2>
      <div className="data-collection">
        <h3>DATA COLLECTION</h3>
        <div className="collection-box">
          <div className="check-box">
            <p>Share my data to improve AI performance and features</p>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              style={{ transform: "scale(2)" }}
              className="checkmark"
            />
          </div>
          <p className="sub-note">
            When enabled, data including your chat history will be used to
            improve our services, including how Alethianomous responds. Our
            contractors will take a look at your chat history, but will not be
            able to see when you have sent the messages to the chat bot, or who
            you are.
          </p>
        </div>
      </div>
      <div className="chat-history">
        <h3>CHAT HISTORY</h3>
        <div className="delete-container">
          <p>Clear my conversation with Aletheianomous in the:</p>
          <select className="delete-dropdown">
            <option value="last-hour">Last Hour</option>
            <option value="last-day">Last Day</option>
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
            <option value="last-year">Last Year</option>
            <option value="entire-time">Entire Time</option>
          </select>
        </div>
        <button className="delete-btn">DELETE HISTORY</button>
      </div>
    </div>
  );
};

export default PrivacyTab;
