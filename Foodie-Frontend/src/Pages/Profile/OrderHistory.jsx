// src/components/Profile/OrderHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5110/api/Orders/getAllOrders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data || []);
      } catch (err) {
        setError("Failed to fetch order history.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
    else {
      setError("User is not logged in.");
      setLoading(false);
    }
  }, [token]);

  if (loading) return <p>Loading order history...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h3 className="mb-4">Order History</h3>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th>#Order No</th>
                <th>Date</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total (₹)</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>#{order.orderNo}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString("en-GB")}</td>
                  <td>{order.status}</td>
                  <td>{order.orderDetails.length}</td>
                  <td>{order.totalAmount.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate(`/order-details/${order.orderId}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
