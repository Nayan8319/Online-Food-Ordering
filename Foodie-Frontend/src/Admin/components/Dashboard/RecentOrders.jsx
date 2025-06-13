import React from "react";
import { Card, Table } from "react-bootstrap";
import { Typography } from "@mui/material";

const RecentOrders = ({ orders }) => (
  <Card className="p-4">
    <Typography variant="h5" className="mb-3">Last 5 Orders</Typography>
    <Table responsive borderless size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Customer</th>
          <th>Status</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customer}</td>
            <td>
              <span className={`badge ${
                order.status === "Delivered"
                  ? "bg-success"
                  : order.status === "Pending"
                  ? "bg-warning"
                  : order.status === "Cancelled"
                  ? "bg-danger"
                  : "bg-primary"
              }`}>
                {order.status}
              </span>
            </td>
            <td>{order.total}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Card>
);

export default RecentOrders;
