import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import "../PlanChart/PlanChart.css";

Chart.register(...registerables);

const PlanChart = ({ users }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (users.length === 0) return;

    // Process user data to get plan distribution
    const planCounts = users.reduce((acc, user) => {
      const plan = user.subscription_plans || "Unknown";
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    }, {});

    const planLabels = Object.keys(planCounts);
    const planData = Object.values(planCounts);

    const ctx = chartRef.current.getContext("2d");

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: planLabels,
        datasets: [
          {
            data: planData,
            backgroundColor: [
              "#4a6bff",
              "#ff6b6b",
              "#6bff6b",
              "#ffcc6b",
              "#6bd4ff",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [users]);

  return <canvas ref={chartRef} />;
};

export default PlanChart;
