import React, { useState } from 'react';
import "./styles/Login.css";


export const Login = () => {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
  }

  return (
      <div className="login">
      <h1>Aletheianomous AI</h1>
      <h2>Login</h2>
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
      <button className="loginButton" type="submit">Login</button>
      <div className="signup-link">
          <a href="Signup">or Sign Up</a>
      </div>
    </div>  
  );
};

export default Login;
