import React, { useState } from "react";
import "./styles/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [redirect, setRedirect] = useState(false); // State to manage redirection

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send sign-up data to backend server using fetch API
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      // Set redirect to true after successful sign-up
      setRedirect(true);
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  // Redirect to login page if redirect state is true
  if (redirect) {
    window.location.href = "/login";
  }

  return (
    <div className="signup-page">
      <div className="containter-card">
        <div className="signup-content">
          <h1>Aletheianomous AI</h1>
          <h2>Sign up</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <span className="icon"></span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Email</label>
            </div>
            <div className="input-box">
              <span className="icon"></span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label>Password</label>
            </div>
            <div className="input-box">
              <span className="icon"></span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label>Name</label>
            </div>
            <button className="signupButton" type="submit">
              Sign up
            </button>
          </form>
          <div className="login-link">
            <a href="/login">or Login</a> {/* Link to login page */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
