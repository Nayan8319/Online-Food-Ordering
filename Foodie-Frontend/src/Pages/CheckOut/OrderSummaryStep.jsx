import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderSummaryStep = ({
  cartItems,
  subtotal,
  shipping,
  totalQuantity,
}) => {
  const [user, setUser] = useState({});
  const [address, setAddress] = useState({});
  const [payment, setPayment] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const totalAmount = subtotal + shipping;

  useEffect(() => {
    const fetchDetails = async () => {
      const token = localStorage.getItem("token");
      const addressId = localStorage.getItem("selectedAddressId");
      const paymentId = localStorage.getItem("lastPaymentId");

      try {
        const [userRes, addressRes, paymentRes] = await Promise.all([
          axios.get("http://localhost:5110/api/Auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5110/api/address/${addressId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5110/api/payment/getPaymentById/${paymentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(userRes.data);
        setAddress(addressRes.data);
        setPayment(paymentRes.data);
      } catch (err) {
        console.error("Failed to fetch summary data:", err);
        alert("⚠️ Failed to load order summary. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    const addressId = localStorage.getItem("selectedAddressId");
    const paymentId = localStorage.getItem("lastPaymentId");

    if (!addressId || !paymentId) {
      alert("⚠️ Address or Payment missing. Please complete all steps.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5110/api/Orders/placeOrder",
        {
          addressId: parseInt(addressId),
          paymentId: parseInt(paymentId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newOrderId = response.data.orderId;
      navigate(`/order-success/${newOrderId}`);
    } catch (error) {
      console.error("Order placement failed:", error);
      alert(error?.response?.data?.message || "❌ Failed to place order. Try again.");
    }
  };

  if (loading) return <div>Loading order summary...</div>;

  return (
    <div className="card p-4">
      <h4 className="mb-4">Order Summary</h4>

      <div className="mb-3">
        <h5>User Info</h5>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.mobile}</p>
      </div>

      <div className="mb-3">
        <h5>Delivery Address</h5>
        <p>{address.street}, {address.city}, {address.state} - {address.zipCode}</p>
      </div>

      <div className="mb-3">
        <h5>Payment Summary</h5>
        <p><strong>Payment Mode:</strong> {payment.paymentMode}</p>
        <p><strong>Name on Card:</strong> {payment.name}</p>
        <p><strong>Total Paid:</strong> ₹{payment.totalAmount?.toFixed(2)}</p>
      </div>

      <div className="mb-3">
        <h5>Items</h5>
        <ul className="list-group list-group-flush">
          {cartItems.map(({ cartId, menu, quantity }) => (
            <li key={cartId} className="list-group-item d-flex justify-content-between">
              {menu.name} x {quantity}
              <span>₹{(menu.price * quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="list-group list-group-flush mt-3">
        <li className="list-group-item d-flex justify-content-between">
          <span>Products ({totalQuantity})</span>
          <strong>₹{subtotal.toFixed(2)}</strong>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <span>Shipping</span>
          <strong>₹{shipping.toFixed(2)}</strong>
        </li>
        <li className="list-group-item d-flex justify-content-between border-0">
          <strong>Total Amount</strong>
          <strong>₹{totalAmount.toFixed(2)}</strong>
        </li>
      </ul>

      <div className="d-grid mt-4">
        <button className="btn btn-primary" onClick={handlePlaceOrder}>
          📦 Place Order
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryStep;
