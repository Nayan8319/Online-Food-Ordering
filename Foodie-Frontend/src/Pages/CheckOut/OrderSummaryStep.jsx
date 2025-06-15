import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderSummaryStep = ({ cartItems, subtotal, shipping, totalQuantity }) => {
  const [user, setUser] = useState({});
  const [address, setAddress] = useState({});
  const [payment, setPayment] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const totalAmount = subtotal + shipping;

  useEffect(() => {
    const fetchSummaryData = async () => {
      const token = localStorage.getItem("token");
      const paymentId = localStorage.getItem("lastPaymentId");

      if (!token || !paymentId) {
        alert("⚠️ Missing details. Please complete previous steps.");
        navigate("/checkout");
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch user and payment in parallel
        const [userRes, paymentRes] = await Promise.all([
          axios.get("http://localhost:5110/api/Auth/profile", { headers }),
          axios.get(`http://localhost:5110/api/payment/getPaymentById/${paymentId}`, { headers }),
        ]);

        const paymentData = paymentRes.data;
        setUser(userRes.data);
        setPayment(paymentData);

        // Fetch address using AddressId from payment
        const addressRes = await axios.get(`http://localhost:5110/api/address/${paymentData.addressId}`, { headers });
        setAddress(addressRes.data);
      } catch (err) {
        console.error("Failed to fetch order summary:", err);
        alert("❌ Failed to load order summary. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, [navigate]);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    const paymentId = localStorage.getItem("lastPaymentId");

    if (!paymentId || !payment?.addressId) {
      alert("⚠️ Address or Payment ID missing. Cannot place order.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5110/api/Orders/placeOrder",
        {
          addressId: payment.addressId,
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

      // 🔁 Refresh cart count in header after placing order
      window.dispatchEvent(new Event("cartUpdated"));
      localStorage.removeItem("lastPaymentId");

      navigate(`/order-success/${newOrderId}`);
    } catch (error) {
      console.error("Order placement error:", error);
      alert(error?.response?.data?.message || "❌ Order placement failed.");
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
        <h5>Payment Details</h5>
        <p><strong>Payment Mode:</strong> {payment.paymentMode}</p>
        <p><strong>Name on Card:</strong> {payment.name}</p>
        <p><strong>Total Paid:</strong> ₹{payment.totalAmount?.toFixed(2)}</p>
      </div>

      <div className="mb-3">
        <h5>Cart Items</h5>
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
          <strong style={{ color: "blue", fontWeight: "bold" }}>Free</strong>
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
