import React, { useState } from "react";
import MainNavBar from "./components/MainNavBar.js";
import HomePage from "./components/HomePage.js";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import ChatWindow from "./components/ChatWindow.js";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // Add your login logic here
    // For simplicity, let's toggle the login state
    setLoggedIn(true);
  };

  const handleLogout = () => {
    // Add your logout logic here
    // For simplicity, let's toggle the login state
    setLoggedIn(false);
  };

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <MainNavBar />
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            {/* Add a route for the ChatWindow component */}
            <Route
              exact
              path="/chatwindow"
              element={<ChatWindow loggedIn={loggedIn} />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
