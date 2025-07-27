import React from "react";
import "../AdminSidebar/AdminSidebar.css";

const AdminSidebar = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "payment-details", icon: "💳", label: "Payment Details" },
    { id: "subscribed-plans", icon: "📋", label: "Subscribed Plans" },
    { id: "activity", icon: "🔄", label: "Activity" },
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Infinitel</h2>
        <p>Admin Dashboard</p>
      </div>
      <ul className="admin-nav">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={`admin-nav-link ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => setActivePage(item.id)}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
