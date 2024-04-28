import React, { useState } from "react";
import "./styles/Login.css";
import { useNavigate } from "react-router-dom";
export const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const navigate = useNavigate();
  var userIdVar;

  //const handleConfirmationCodeSubmit

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!showAuthCodeInput) {
      console.log(email);
        try {
          const response = await fetch(`http://aletheianomous-ai.com:5000/login`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({"email": email, "password": pass}),
          }
        )
        if (!response.ok) {
            let err_json = await response.response_json();
            if (err_json.exception_type === "ValueError") {
              throw new Error("ValueError: " + err_json.exception_details);
            } else {
              throw new Error("There was a problem authenticating your verification code.");
            }
        }
        var response_json = await response.json();
        //setUserId(response_json.user_id);
        userIdVar = response_json.user_id;
        console.log("userIdVar=", userIdVar);
        document.cookie = "user_id=" + response_json.user_id + ";path/";
        console.log("Cookie= ", document.cookie);
        const mfa_response = await fetch(`http://aletheianomous-ai.com:5000/generate_verification_code/mail/${response_json.user_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"test_mode": true}),
      }
    )
    if (!mfa_response.ok) {
        let err_json = await mfa_response.response_json();
        if (err_json.exception_type === "InvalidCodeException") {
          throw new Error("Invalid Code Exception: " + err_json.exception_details);
        } else {
          throw new Error("There was a problem authenticating your verification code.");
        }
    }
      

      } catch (error) {
        console.error(error);
      }

      setShowAuthCodeInput(true);
      console.log("Expected AuthCodeInput state: True, actual: ", showAuthCodeInput);
    } else {

      //IMPORT CODE HERE
      console.log("Running auth code in Login.js");
      console.log("Expected AuthCodeInput state: True, actual: ", showAuthCodeInput);


      console.log(authCode);

      let userId;
      let decodedCookie = decodeURIComponent(document.cookie);
      console.log("Read cookie: ", decodedCookie);

      let ca = decodedCookie.split(';');
      var key = "user_id";
      for (let i = 0; i <ca.length; i++) {
        let c = ca[i];
        c = c.split("=");
        if (c[0] === key) {
          userId=c[1];
          break;
        }
        else {
          userId = "";
        }
      }
      
      if (userId === "") {
        throw new Error("Unable to find user id cookie.");
      }


      console.log("Sending auth code ", authCode, " for userId: ", userId);
      try {
        const val_response = await fetch(`http://aletheianomous-ai.com:5000/authenticate_verification_code/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({"code": authCode}),
        }
      )
      if (!val_response.ok) {
          let err_json = await val_response.response_json();
          if (err_json.exception_type === "InvalidCodeException") {
            throw new Error("Invalid Code Exception: " + err_json.exception_details);
          } else {
            throw new Error("There was a problem authenticating your verification code.");
          }
      } else {
      navigate("/chatpage");
      }
    } catch (error) {
      console.error(error);
    }
      //END CODE
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
