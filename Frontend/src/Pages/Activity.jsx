import React, { useState, useEffect } from "react";
import AdminCard from "../Components/AdminCard/AdminCard";
import { fetchUserActivity } from "../services/apis";
import "../Pages/CSS/Activity.css";

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const activityData = await fetchUserActivity(filter);
        setActivities(activityData);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, [filter]);

  return (
    <div className="activity-container">
      <AdminCard>
        <div className="admin-card-header">
          <h2>User Activity</h2>
          <div className="activity-filters">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="modern-select"
            >
              <option value="all">All Users</option>
              <option value="active">Active Users</option>
              <option value="inactive">Inactive Users</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-spinner">Loading activities...</div>
        ) : (
          <div className="activity-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Plan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.length > 0 ? (
                  activities.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.name}</td>
                      <td>{user.phone}</td>
                      <td>{user.subscription_plans || "N/A"}</td>
                      <td>
                        <span
                          className={`status-badge ${user.status?.toLowerCase()}`}
                        >
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No user activity found
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

export default Activity;
