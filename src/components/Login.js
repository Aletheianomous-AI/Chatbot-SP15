import React, { useState } from "react";
import "./styles/Login.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
  };

  return (
    <div className="login-page">
      <div className="containter-card">
        <div className="login-content">
          <h1>Aletheianomous AI</h1>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <span className="icon"></span>
              <input type="email" required></input>
              <label>Email</label>
            </div>
            <div className="input-box">
              <span className="icon"></span>
              <input type="password" required></input>
              <label>Password</label>
            </div>
            <button className="loginButton" type="submit">
              Login
            </button>
          </form>
          <div className="signup-link">
            <a href="Signup">or Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
