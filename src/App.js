import React, { useState } from "react";
import MainNavBar from "./components/MainNavBar.js";
import UserNavBar from "./components/UserNavBar";
import HomePage from "./components/HomePage.js";
import Contact from "./components/Contact.js";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  //const [userId, setUserId] = useState(-1);
  const location = useLocation();


  return (
    <div className="App">
      { <MainNavBar /> }
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
