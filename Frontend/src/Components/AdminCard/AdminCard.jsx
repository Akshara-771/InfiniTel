import React from "react";
import "./AdminCard.css";

const AdminCard = ({ children, className = "" }) => {
  return <div className={`admin-card ${className}`}>{children}</div>;
};

export default AdminCard;
