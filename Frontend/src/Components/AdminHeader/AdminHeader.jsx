import React from "react";
import "../AdminHeader/AdminHeader.css";

const AdminHeader = () => {
  return (
    <div className="admin-header-container">
      <div className="header-left">
        <h1 className="header-title">Admin Dashboard</h1>
        <div className="breadcrumb">Dashboard</div>
      </div>

      <div className="header-right">
        <div className="notification-bell">
          <i className="fas fa-bell"></i>
          <span className="notification-count">3</span>
        </div>

        <div className="user-profile">
          <div className="profile-image">
            <img src="https://via.placeholder.com/40" alt="Admin" />
          </div>
          <div className="profile-info">
            <h4 className="profile-name">Admin User</h4>
            <p className="profile-role">Super Admin</p>
          </div>
          <i className="fas fa-chevron-down profile-dropdown"></i>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
