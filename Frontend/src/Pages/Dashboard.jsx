import React, { useState, useEffect } from "react";
import AdminCard from "../Components/AdminCard/AdminCard";
import FilterControls from "../Components/FilterControls/FilterControls";
import UserTable from "../Components/UserTable/UserTable";
import PlanChart from "../Components/PlanChart/PlanChart";
import AreaChart from "../Components/AreaChart/AreaChart";
import { fetchAreas, fetchUsers } from "../services/apis";
import "./CSS/Dashboard.css";

const Dashboard = () => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [areasData, usersData] = await Promise.all([
          fetchAreas(),
          fetchUsers(),
        ]);

        console.log("✅ Areas Received:", areasData);
        console.log("✅ Users Received in Dashboard:", usersData);

        setAreas(areasData);
        setUsers(usersData);
      } catch (error) {
        console.error("❌ Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredUsers = users
    .filter((user) => user.role !== "Admin") // ✅ Also handles issue 1
    .filter((user) => selectedArea === "" || user.area === selectedArea)
    .filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

  return (
    <div className="dashboard-container">
      <AdminCard>
        <div className="admin-card-header">
          <h2>Customer Management</h2>
          <FilterControls
            areas={areas}
            selectedArea={selectedArea}
            onAreaChange={setSelectedArea}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <UserTable users={filteredUsers} />
        )}
      </AdminCard>

      <div className="charts-grid">
        <AdminCard className="chart-card">
          <h3 className="chart-title">Plan Distribution</h3>
          <PlanChart users={users} />
        </AdminCard>
        <AdminCard className="chart-card">
          <h3 className="chart-title">Users by Area</h3>
          <AreaChart users={users} />
        </AdminCard>
      </div>
    </div>
  );
};

export default Dashboard;
