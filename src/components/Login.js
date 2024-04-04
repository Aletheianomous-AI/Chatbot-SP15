import React, { useState } from "react";
import "./styles/Login.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);
  const [authCode, setAuthCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!showAuthCodeInput) {
      console.log(email);
      // Add login logic here
      // If login is successful, set showAuthCodeInput to true
      setShowAuthCodeInput(true); //For demonstation ONLY
    } else {
      console.log(authCode);
      // Add authentication code logic here
    }
  };

  return (
    <div className="login-page">
      <div className="containter-card">
        <div className="login-content">
          <h1>Aletheianomous AI</h1>
          <h2>Login</h2>
          {!showAuthCodeInput && (
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <span className="icon"></span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
                <label>Email</label>
              </div>
              <div className="input-box">
                <span className="icon"></span>
                <input
                  type="password"
                  required
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                ></input>
                <label>Password</label>
              </div>
              <button className="loginButton" type="submit">
                Login
              </button>
            </form>
          )}
          {showAuthCodeInput && (
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <span className="icon"></span>
                <input
                  type="text"
                  required
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                />
                <label>Authentication Code</label>
              </div>
              <button className="loginButton" type="submit">
                Submit
              </button>
            </form>
          )}
          <div className="signup-link">
            <a href="Signup">or Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
