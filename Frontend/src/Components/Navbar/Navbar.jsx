import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onSectionChange }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    setIsLoggedIn(!!user);
  }, []);

  const handleMyInfoClick = () => {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      alert("Must login to access");
    } else {
      navigate("/myinfo");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("accessToken");
    alert("Logged out successfully.");
    setIsLoggedIn(false);
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">InfiniTel</h2>
      <ul className="nav-links">
        <li onClick={() => onSectionChange("home")}>Home</li>
        <li onClick={() => onSectionChange("about")}>About</li>
        <li onClick={() => onSectionChange("contact")}>Contact Us</li>
        {!isLoggedIn ? (
          <li>
            <a href="/auth">Login/SignUp</a>
          </li>
        ) : (
          <>
            <li>
              <button className="nav-button" onClick={handleMyInfoClick}>
                My Info
              </button>
            </li>
            <li>
              <button className="nav-button logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
