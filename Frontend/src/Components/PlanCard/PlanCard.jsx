import React from "react";
import "../PlanCard/PlanCard.css";
import axios from "axios";

const PlanCard = ({
  _id,
  name = "Plan Name",
  price = "0.00",
  features = [],
  isPopular = false,
  payment_terms = "",
}) => {
  const planFeatures = Array.isArray(features) ? features : [];

  const handleSelect = async () => {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!token || !user) {
      alert("You must be logged in to select a plan.");
      return;
    }

    // Use correct user identifier
    const userId = user._id || user.userId; // fallback in case it's stored differently

    console.log("📤 Sending to backend:", {
      user_id: userId,
      plan_id: _id,
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/subscribe",
        {
          user_id: userId,
          plan_id: _id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Plan subscribed successfully!");
      console.log("✅ Subscription response:", response.data);
    } catch (error) {
      console.error("❌ Subscription failed:", error.response?.data || error);
      alert("❌ Failed to subscribe. Try again.");
    }
  };

  return (
    <div className={`plan-card ${isPopular ? "popular" : ""}`}>
      {isPopular && <div className="popular-badge">Most Popular</div>}

      <div className="plan-header">
        <h3 className="plan-name">{name}</h3>
        <div className="plan-price">
          <span className="price-amount">${price}</span>
        </div>
        <div className="payment-terms">Payment: {payment_terms}</div>
      </div>

      {planFeatures.length > 0 ? (
        <ul className="plan-features">
          {planFeatures.map((feature, index) => (
            <li key={index} className="feature-item">
              <span className="feature-icon">✓</span>
              {feature || `Feature ${index + 1}`}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-features">No features listed</p>
      )}

      <button className="select-plan-btn" onClick={handleSelect}>
        Select Plan
      </button>
    </div>
  );
};

export default PlanCard;
