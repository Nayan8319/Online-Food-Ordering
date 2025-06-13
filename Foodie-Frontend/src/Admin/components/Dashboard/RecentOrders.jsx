import React, { useEffect, useState } from "react";
import { Card, Spinner, Table } from "react-bootstrap";
import { Typography } from "@mui/material";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5110/api/dashboard/latest-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch((error) => console.error("Failed to fetch latest orders:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="p-4 text-center">
        <Spinner animation="border" variant="primary" />
      </Card>
    );
  }

  if (!orders.length) {
    return (
      <Card className="p-4 text-center">
        <Typography variant="body1" color="error">
          No recent orders found.
        </Typography>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <Typography variant="h5" className="mb-3">
        Last 5 Orders
      </Typography>
      <Table responsive borderless size="sm">
<thead>
  <tr>
    <th className="fw-bold">Order ID</th>
    <th className="fw-bold">Customer</th>
    <th className="fw-bold">Status</th>
    <th className="fw-bold">Total</th>
  </tr>
</thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.orderNo}>
              <td>{order.orderNo}</td>
              <td>{order.username}</td>
              <td>
                <span
                  className={`badge ${
                    order.status === "Delivered"
                      ? "bg-success"
                      : order.status === "Pending"
                      ? "bg-warning"
                      : order.status === "Cancelled"
                      ? "bg-danger"
                      : "bg-primary"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td>₹{order.totalAmount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default RecentOrders;
