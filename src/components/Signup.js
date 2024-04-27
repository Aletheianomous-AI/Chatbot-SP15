import React, { useState } from "react";
import "./styles/Signup.css";
import { useNavigate } from "react-router-dom";
//import { userId, setUserId} from "../App";

const Signup = () => {
  const [formData, setFormData] = useState({
    date_of_birth: "",
    email: "",
    password: "",
    name: ""

  });


  const [showConfirmationCodeInput, setShowConfirmationCodeInput] =
    useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const [redirect, setRedirect] = useState(false); // State to manage redirection
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmationCodeInput(true); // For demonstration purpose ONLY

    try {
      // Send sign-up data to backend server using fetch API
      const response = await fetch("http://aletheianomous-ai.com:5000/create_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"username": formData.name, 
        "email": formData.email,
        "password": formData.password,
        "dob": formData.date_of_birth,
        "share_conv_for_training": false
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      var response_json = await response.json();
      console.log(response_json);
      const userId = response_json.user_id;
      console.log(userId);

      const authCodeResponse = await fetch(`http://aletheianomous-ai.com:5000/generate_verification_code/mail/${userId}`,
        {
          method: "PUT",
         headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({"test_mode": true}),
        }
      )
      if (!authCodeResponse.ok) {
        throw new Error("Unable to communicate with mail server to send authentication code.");
      }
      // Set redirect to true after successful sign-up
      setRedirect(true);
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleConfirmationCodeSubmit = async (e) => {
    e.preventDefault();
    console.log(confirmationCode);

    let userId;
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    var temp_id = ""
    var key = "user_id"
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf("user_id=") === 0) {
        temp_id =  c.substring(key.length, c.length);
      }
    }
    temp_id = "";
    if (temp_id !== "") {
      userId = temp_id;
    }

    try {
      const response = await fetch(`http://aletheianomous-ai.com:5000/generate_verification_code/mail/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"test_mode": true}),
      }
    )
    if (!response.ok) {
        let err_json = await response.response_json();
        if (err_json.exception_type === "InvalidCodeException") {
          throw new Error("Invalid Code Exception: " + err_json.exception_details);
        } else {
          throw new Error("There was a problem authenticating your verification code.");
        }
    }
    navigate("/chatpage");
  } catch (error) {
    console.error(error);
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
          {!showConfirmationCodeInput && (
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
              <div className="input-box">
                <span className="icon"></span>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />
                <label>Date of Birth</label>
              </div>
              <button className="signupButton" type="submit">
                Sign up
              </button>
            </form>
          )}
          {showConfirmationCodeInput && (
            <form onSubmit={handleConfirmationCodeSubmit}>
              <div className="input-box">
                <span className="icon"></span>
                <input
                  type="text"
                  required
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                />
                <label>Confirmation Code</label>
              </div>
              <button className="signupButton" type="submit">
                Submit
              </button>
            </form>
          )}
          <div className="login-link">
            <a href="/login">or Login</a> {/* Link to login page */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
