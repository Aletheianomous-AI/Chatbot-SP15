import React from "react";
import "./styles/HomePage.css";
import MainNavBar from "../components/MainNavBar";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="homepage">
      <h1>This is the HomePage </h1>
      <div>
        <button className="login-button" onClick={() => navigate("/login")}>
          Login
        </button>

        <button className="signup-button" onClick={() => navigate("/signup")}>
          Sign up
        </button>
      </div>
    </div>
  );
};

export default HomePage;
