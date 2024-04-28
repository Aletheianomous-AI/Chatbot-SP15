import React from "react";
import { Link } from "react-router-dom";
import "./styles/UserNavBar.css";
import { useNavigate } from "react-router-dom";

function UserNavBar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Add logout logic here
  };
  const handleH1Click = () => {
    // navigate to the main homepage
    navigate("/");
  };

  return (
    <nav className="user-nav">
      <div className="user-nav-left">
        {/* TODO: Adding brand logo here */}
        <h1 className="brand-name-button" onClick={handleH1Click}>
          ALETHEIANOMOUS AI
        </h1>
      </div>
      <div className="user-nav-right">
        <ul>
          <li>
            <Link to="/settings" className="">
              Settings
            </Link>
          </li>
          <li>
            <Link to="/login" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default UserNavBar;
