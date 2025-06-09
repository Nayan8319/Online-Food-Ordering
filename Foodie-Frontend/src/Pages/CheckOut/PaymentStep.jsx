import React, { useEffect, useState } from "react";

const PaymentStep = ({ payment, setPayment, onSuccess }) => {
  const [address, setAddress] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      // Get address from localStorage
      const savedAddressJson = localStorage.getItem("selectedAddress");
      const savedAddress = savedAddressJson ? JSON.parse(savedAddressJson) : null;

      if (!token || !savedAddress) {
        alert("Missing token or selected address. Please complete previous steps.");
        setLoading(false);
        return;
      }

      try {
        // Assuming you still want to fetch cart total amount from API
        const response = await fetch("http://localhost:5110/api/CartOrder", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartRes = await response.json();

        setAddress(savedAddress);
        setTotalAmount(cartRes.totalAmount || 0);
      } catch (error) {
        console.error("Error fetching cart:", error);
        alert("Failed to fetch cart data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const convertExpiryDate = (mmYY) => {
    const [month, year] = mmYY.split("/");
    if (!month || !year || isNaN(month) || isNaN(year)) return null;

    const fullYear = parseInt("20" + year);
    const isoDate = new Date(fullYear, parseInt(month) - 1, 1).toISOString();
    return isoDate;
  };

  const handleSubmitPayment = async () => {
    const savedAddressJson = localStorage.getItem("selectedAddress");
    const selectedAddress = savedAddressJson ? JSON.parse(savedAddressJson) : null;

    if (
      !payment.mode ||
      !payment.cardName ||
      !payment.cardNumber ||
      !payment.expiryDate ||
      !payment.cvv
    ) {
      alert("Please fill in all payment fields.");
      return;
    }

    const expiryDateISO = convertExpiryDate(payment.expiryDate);
    if (!expiryDateISO) {
      alert("Invalid expiry date format. Use MM/YY.");
      return;
    }

    if (!selectedAddress || !selectedAddress.addressId) {
      alert("No delivery address selected.");
      return;
    }

    if (totalAmount <= 0) {
      alert("Cart total amount is zero or invalid.");
      return;
    }

    const payload = {
      name: payment.cardName,
      expiryDate: expiryDateISO,
      cvvNo: parseInt(payment.cvv),
      addressId: selectedAddress.addressId,
      paymentMode: payment.mode,
      totalAmount: parseFloat(totalAmount),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5110/api/payment/addPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment failed");
      }

      const data = await response.json();
      localStorage.setItem("lastPaymentId", data.paymentId);

      alert("✅ Payment saved successfully!");
      if (onSuccess) onSuccess(data.paymentId);
    } catch (error) {
      console.error("Payment saving failed:", error);
      alert(error.message || "❌ Failed to save payment. Please try again.");
    }
  };

  if (loading) return <div>Loading payment details...</div>;

  return (
    <div className="card p-4 mb-3">
      <h4>Payment Details</h4>

      <div className="mb-3">
        <label>Delivery Address</label>
        <input
          className="form-control"
          value={
            address
              ? `${address.street}, ${address.city}, ${address.state} - ${address.zip}`
              : ""
          }
          disabled
        />
      </div>

      <div className="mb-3">
        <label>Total Amount</label>
        <input className="form-control" value={`₹${totalAmount.toFixed(2)}`} disabled />
      </div>

      <div className="mb-3">
        <label>Payment Mode</label>
        <select
          className="form-select"
          value={payment.mode}
          onChange={(e) => setPayment({ ...payment, mode: e.target.value })}
        >
          <option value="">Select</option>
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>PayPal</option>
        </select>
      </div>

      <div className="mb-3">
        <label>Name on Card</label>
        <input
          className="form-control"
          value={payment.cardName}
          onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label>Card Number</label>
        <input
          className="form-control"
          value={payment.cardNumber}
          onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Expiry Date (MM/YY)</label>
          <input
            className="form-control"
            placeholder="MM/YY"
            maxLength={5}
            value={payment.expiryDate}
            onChange={(e) => setPayment({ ...payment, expiryDate: e.target.value })}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>CVV</label>
          <input
            className="form-control"
            type="password"
            maxLength={4}
            value={payment.cvv}
            onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
          />
        </div>
      </div>

      <button className="btn btn-success mt-2" onClick={handleSubmitPayment}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentStep;
