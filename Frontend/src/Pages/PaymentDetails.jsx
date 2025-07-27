import React, { useState, useEffect } from "react";
import AdminCard from "../Components/AdminCard/AdminCard";
import { fetchPayments } from "../services/apis";
import "./CSS/PaymentDetails.css";

const PaymentDetails = () => {
  const [payments, setPayments] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const paymentsData = await fetchPayments(searchId);
        setPayments(paymentsData);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPayments();
  }, [searchId]);

  return (
    <div className="payment-details-container">
      <AdminCard>
        <div className="admin-card-header">
          <h2>Payment Details</h2>
          <div className="payment-search-controls">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Search by User ID"
              className="modern-input"
            />
            <button className="modern-search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-spinner">Loading payments...</div>
        ) : (
          <div className="payments-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment._id}>
                      <td>{payment._id}</td>
                      <td>{payment.user_id}</td>
                      <td>{payment.name || "N/A"}</td>
                      <td className="amount-cell">
                        ${payment.amount?.toFixed(2)}
                      </td>
                      <td>
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td>{payment.payment_mode}</td>
                      <td>
                        <span
                          className={`status-badge ${payment.payment_status?.toLowerCase()}`}
                        >
                          {payment.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No payment records found
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

export default PaymentDetails;
