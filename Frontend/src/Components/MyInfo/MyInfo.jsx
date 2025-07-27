import React, { useEffect, useState } from "react";
import "../MyInfo/MyInfo.css";
import axios from "axios";

const MyInfo = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  // Password change fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!token || !storedUser || !storedUser._id) {
      setUser("unauthenticated");
      return;
    }

    axios
      .get(`http://localhost:5000/api/users/${storedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setName(res.data.name);
        setArea(res.data.area);
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
        setUser("unauthenticated");
      });
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        { name, area },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setEditing(false);
      alert("✅ Profile updated!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("❌ New passwords do not match");
      return;
    }

    const token = localStorage.getItem("accessToken");

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/change-password/${user._id}`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error("Password update failed:", err);
      alert("❌ Failed to change password");
    }
  };

  if (user === "unauthenticated") {
    return <div className="myinfo-container">Must login to access</div>;
  }

  if (!user) return <div className="myinfo-container">Loading...</div>;

  return (
    <div className="myinfo-container">
      <h2>My Info</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "info" ? "active-tab" : ""}
          onClick={() => setActiveTab("info")}
        >
          Profile Info
        </button>
        <button
          className={activeTab === "password" ? "active-tab" : ""}
          onClick={() => setActiveTab("password")}
        >
          Change Password
        </button>
      </div>

      {/* Profile Info Tab */}
      {activeTab === "info" && (
        <div className="info-card">
          <div className="info-row">
            <label>Name:</label>
            {editing ? (
              <input value={name} onChange={(e) => setName(e.target.value)} />
            ) : (
              <span>{user.name}</span>
            )}
          </div>

          <div className="info-row">
            <label>Phone:</label>
            <span>{user.phone}</span>
          </div>

          <div className="info-row">
            <label>Area:</label>
            {editing ? (
              <input value={area} onChange={(e) => setArea(e.target.value)} />
            ) : (
              <span>{user.area}</span>
            )}
          </div>

          <div className="info-row">
            <label>Plan:</label>
            <span>{user.subscription_plans || "None"}</span>
          </div>

          <div className="info-row">
            <label>Payment Status:</label>
            <span>{user.payment_status || "Unpaid"}</span>
          </div>

          <div className="info-row">
            <label>Status:</label>
            <span>{user.status}</span>
          </div>

          <div className="info-row">
            <label>Role:</label>
            <span>{user.role}</span>
          </div>

          <div className="action-buttons">
            {editing ? (
              <button className="save-btn" onClick={handleSave}>
                Make Changes
              </button>
            ) : (
              <button className="edit-btn" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === "password" && (
        <div className="password-card">
          <div className="info-row">
            <label>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="info-row">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="info-row">
            <label>Confirm New Password:</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>

          <div className="action-buttons">
            <button className="save-btn" onClick={handleChangePassword}>
              Change Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInfo;
