import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CSS/Auth.css";

const API_BASE_URL = "http://localhost:5000/api/auth"; // Backend API URL

const Auth = () => {
  const [activeTab, setActiveTab] = useState("user");
  const [userIdOrPhone, setUserIdOrPhone] = useState("");
  const [signupVisible, setSignupVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [signupPassword, setSignupPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser));
    }
  }, []);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        _id: userIdOrPhone,
        phone: userIdOrPhone,
        password: loginPassword,
      });

      console.log("🔹 Full Response from Backend:", response); // Logs full Axios response
      console.log("🔹 Extracted Data:", response.data); // Logs extracted data from response

      const { accessToken, user } = response.data;
      console.log("🔹 Extracted Token in Frontend:", accessToken);

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken); // ✅ Store token
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        console.log("Token stored:", accessToken); // 🔍 Debugging
      } else {
        console.error("No access token received");
      }

      setLoggedInUser(user);
      setMessage("Login successful!");

      navigate(user.role === "Admin" ? "/admin" : "/");
    } catch (error) {
      console.error("Login error:", error); // 🔍 Debugging

      if (error.response?.status === 400) {
        setSignupVisible(true);
        setMessage("User not found. Please sign up.");
      } else {
        setMessage("Login failed. Check credentials.");
      }
    }
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        _id: document.getElementById("signup-userId").value,
        name: document.getElementById("signup-name").value,
        phone: document.getElementById("signup-phone").value,
        area: document.getElementById("signup-area").value,
        password: signupPassword,
        status: "Active", // Automatically assign status
      };

      // Ensure status is only sent if it's valid
      const statusElement = document.getElementById("signup-status");
      if (statusElement && statusElement.value) {
        userData.status = statusElement.value;
      }

      console.log("🚀 Signup Data Being Sent:", userData);

      const response = await axios.post(`${API_BASE_URL}/register`, userData);

      setMessage("Signup successful! You can now log in.");
      setSignupVisible(false);
    } catch (error) {
      setMessage(error.response?.data?.error || "Signup failed.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    setMessage("You have logged out.");
    navigate("/");
  };

  return (
    <div className="auth-wrapper">
      {loggedInUser ? (
        <div className="logged-in">
          <h2>
            Welcome, {loggedInUser.name} ({loggedInUser.role})
          </h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <>
          <form className="auth-form" onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
              type="text"
              placeholder="User ID or Phone"
              value={userIdOrPhone}
              onChange={(e) => setUserIdOrPhone(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
            {(message.includes("Login") || message.includes("User")) && (
              <p className="auth-message">{message}</p>
            )}
          </form>

          {/* Signup form always visible */}
          <form
            className="auth-form"
            onSubmit={handleSignup}
            style={{ marginTop: "2rem" }}
          >
            <h2>Sign Up</h2>
            <input
              id="signup-userId"
              type="text"
              placeholder="User ID"
              required
            />
            <input
              id="signup-name"
              type="text"
              placeholder="Full Name"
              required
            />
            <input
              id="signup-phone"
              type="text"
              placeholder="Phone Number"
              required
            />
            <input id="signup-area" type="text" placeholder="Area" required />
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />

            <button type="submit">Sign Up</button>
            {message.toLowerCase().includes("signup") && (
              <p className="auth-message">{message}</p>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default Auth;
