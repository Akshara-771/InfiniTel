import React, { useState, useEffect } from "react";
import AdminCard from "../Components/AdminCard/AdminCard";
import { fetchSubscriptions } from "../services/apis";
import "./CSS/SubscribedPlans.css";

const SubscribedPlans = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const subscriptionsData = await fetchSubscriptions();
        setSubscriptions(subscriptionsData);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.user_id?.includes(searchTerm) ||
      sub.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="subscriptions-container">
      <AdminCard>
        <div className="admin-card-header">
          <h2>Subscribed Plans</h2>
          <div className="search-controls">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by User ID or Name"
              className="modern-input"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="loading-spinner">Loading subscriptions...</div>
        ) : (
          <div className="subscriptions-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Subscription ID</th>
                  <th>User ID</th>
                  <th>Plan ID</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.length > 0 ? (
                  filteredSubscriptions.map((sub) => (
                    <tr key={sub._id}>
                      <td>{sub._id}</td>
                      <td>{sub.user_id}</td>
                      <td className="plan-name">{sub.plan_id}</td>
                      <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">
                      No subscriptions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
};

export default SubscribedPlans;
