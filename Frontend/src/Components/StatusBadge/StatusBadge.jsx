import React from "react";
import PropTypes from "prop-types";
import "../StatusBadge/StatusBadge.css";

const StatusBadge = ({ status, size = "medium", withIcon = false }) => {
  // Normalize status to lowercase for consistent styling
  const normalizedStatus = status.toLowerCase();

  // Get appropriate icon for each status
  const getStatusIcon = () => {
    switch (normalizedStatus) {
      case "active":
        return "✓";
      case "inactive":
        return "✕";
      case "pending":
        return "⏳";
      case "completed":
        return "✓";
      case "failed":
        return "⚠";
      case "expired":
        return "⌛";
      default:
        return "";
    }
  };

  return (
    <span className={`status-badge ${normalizedStatus} ${size}`}>
      {withIcon && <span className="status-icon">{getStatusIcon()}</span>}
      <span className="status-text">{status}</span>
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  withIcon: PropTypes.bool,
};

export default StatusBadge;
