import React, { useState } from "react";
import MainNavBar from "./components/MainNavBar.js";
import UserNavBar from "./components/UserNavBar";
import HomePage from "./components/HomePage.js";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import ChatPage from "./components/ChatPage.js";
import Settings from "./components/Settings.js";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
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
    <div className="App">
      {/* <MainNavBar /> */}
      {location.pathname === "/chatpage" ||
      location.pathname === "/settings" ? (
        <UserNavBar />
      ) : (
        <MainNavBar />
      )}
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        {/* Add a route for the ChatWindow component */}
        <Route
          exact
          path="/chatpage"
          element={<ChatPage loggedIn={loggedIn} />}
        />
        <Route exact path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
