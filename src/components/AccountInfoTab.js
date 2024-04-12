import React, { useState } from "react";
import "./styles/AccountInfoTab.css";

//Account information tab in settings page

const AccountInfoTab = () => {
  // State variables to manage edit mode and user information
  const [editMode, setEditMode] = useState(false);
  const [userName, setUserName] = useState("John Doe");
  const [email, setEmail] = useState("sample-email@gmail.com");
  const [dob, setDob] = useState("1/1/1970");

  // Function to handle edit button click
  const handleEditClick = () => {
    setEditMode(!editMode); // Toggle edit mode
  };
  return (
    <div className="settings-container">
      <div className="settings-bar">SETTINGS</div>
      <h2 className="right-heading">Account & Security</h2>
      <div className="account-info">
        <h3>ACCOUNT INFORMATION</h3>
        <div className="info-box">
          <img
            className="user-avatar"
            src="/images/avatar.png"
            alt="user-avatar"
          ></img>
          <div className="info-content">
            {/* Display editable inputs in edit mode */}
            {editMode ? (
              <>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="user-name"
                />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email"
                />
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="dob"
                />
              </>
            ) : (
              <>
                <p className="user-name">{userName}</p>
                <p className="email">Email: {email}</p>
                <p className="dob"> DOB: {dob}</p>
              </>
            )}
            <button className="edit-btn" onClick={handleEditClick}>
              {editMode ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      </div>
      <div className="password-update">
        <h3>PASSWORDS</h3>
        <button className="update-pw-btn">Update Password</button>
      </div>
      <div className="enable-mfa">
        <h3>MULTI-FACTOR AUTHENTICATION</h3>
        <button className="mfa-btn">Enable MFA</button>
      </div>
    </div>
  );
};

export default AccountInfoTab;
