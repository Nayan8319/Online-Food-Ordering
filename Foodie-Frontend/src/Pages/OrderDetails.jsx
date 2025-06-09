import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5110/api/Orders";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming JWT stored here
        const response = await axios.get(`${API_BASE}/getOrderById/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrder(response.data);
      } catch (err) {
        setError(
          err.response?.data || "Failed to load order details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading)
    return (
      <div className="container py-5">
        <h3>Loading order details...</h3>
      </div>
    );

  if (error)
    return (
      <div className="container py-5 text-danger">
        <h4>Error: {typeof error === "string" ? error : JSON.stringify(error)}</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );

  if (!order) return null;

  return (
    <div className="container py-5">
      <h2>Order Details - #{order.orderNo}</h2>
      <p>
        <strong>Order Date:</strong>{" "}
        {new Date(order.orderDate).toLocaleString()}
      </p>
      <p>
        <strong>Status:</strong> {order.status}
      </p>

      <hr />

      <h4>Items</h4>
      {order.orderDetails.length === 0 && <p>No items in this order.</p>}
      {order.orderDetails.map((item) => (
        <div
          key={item.menuId}
          className="d-flex align-items-center mb-3 border rounded p-2"
        >
          {/* Assuming you have image URLs for menus; adapt if not */}
          {/* <img
            src={item.imageUrl || '/default-image.png'}
            alt={item.menuName}
            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
          /> */}
          <div>
            <h5>{item.menuName}</h5>
            <p>
              Quantity: {item.quantity} &times; ₹{item.price.toFixed(2)} = ₹
              {(item.quantity * item.price).toFixed(2)}
            </p>
          </div>
        </div>
      ))}

      <hr />

      <h4>Total Amount</h4>
      <p>
        <strong>₹{order.totalAmount.toFixed(2)}</strong>
      </p>

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        Back to Orders
      </button>
    </div>
  );
};

export default OrderDetails;
