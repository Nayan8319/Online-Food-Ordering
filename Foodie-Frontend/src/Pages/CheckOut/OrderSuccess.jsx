import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/order-details/${orderId}`);
    }, 5000);
    return () => clearTimeout(timer);
  }, [orderId, navigate]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <h2 className="text-success">✅ Order Confirmed!</h2>
      <p>🎉 Thank you for your purchase.</p>
      <p>Redirecting to your order details in 5 seconds...</p>
    </div>
  );
};

export default OrderSuccess;
