import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import "../AreaChart/AreaChart.css";

Chart.register(...registerables);

const AreaChart = ({ users }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!users || users.length === 0) {
      // Handle empty state
      return;
    }

    // Process area distribution data
    const areaData = users.reduce((acc, user) => {
      const area = user.area || "Unknown";
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});

    const ctx = chartRef.current.getContext("2d");

    // Destroy previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(areaData),
        datasets: [
          {
            label: "Users",
            data: Object.values(areaData),
            backgroundColor: "rgba(74, 107, 255, 0.7)",
            borderColor: "rgba(74, 107, 255, 1)",
            borderWidth: 1,
            borderRadius: 4,
            hoverBackgroundColor: "rgba(74, 107, 255, 0.9)",
            hoverBorderColor: "rgba(74, 107, 255, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: (context) => `Area: ${context[0].label}`,
              label: (context) => `Users: ${context.raw}`,
            },
            titleFont: {
              family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              size: 13,
              weight: "bold",
            },
            bodyFont: {
              family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              size: 12,
            },
            padding: 12,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            titleColor: "#fff",
            bodyColor: "rgba(255, 255, 255, 0.9)",
            cornerRadius: 6,
            displayColors: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
              drawBorder: false,
            },
            ticks: {
              color: "#777",
              font: {
                size: 11,
              },
              stepSize: 1,
            },
          },
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              color: "#777",
              font: {
                size: 11,
              },
            },
          },
        },
        elements: {
          bar: {
            borderRadius: 4,
          },
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [users]);

  if (!users || users.length === 0) {
    return (
      <div className="area-chart-container">
        <div className="area-chart-empty">
          <div className="area-chart-empty-icon">📊</div>
          <div>No data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="area-chart-container">
      <canvas
        ref={chartRef}
        className="area-chart-canvas"
        aria-label="Users by area chart"
        role="img"
      />
    </div>
  );
};

export default AreaChart;
