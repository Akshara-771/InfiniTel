import React from "react";
import StatusBadge from "../StatusBadge/StatusBadge";
import "../UserTable/UserTable.css";

const UserTable = ({ users }) => {
  const filteredUsers = users.filter((user) => user.role !== "Admin"); // ✅ exclude Admins

  if (filteredUsers.length === 0) {
    return <div className="no-users">No users found</div>;
  }

  return (
    <div className="table-responsive">
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Plan</th>
            <th>Payment Status</th>
            <th>Area</th>
            <th>Phone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.role !== "Admin") // ✅ filter out Admin
            .map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.subscription_plans || "N/A"}</td>
                <td>{user.payment_status || "N/A"}</td>
                <td>{user.area}</td>
                <td>{user.phone}</td>
                <td>
                  <StatusBadge status={user.status} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
