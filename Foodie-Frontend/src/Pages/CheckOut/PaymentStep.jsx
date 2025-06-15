import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const PaymentStep = ({ payment, setPayment, onSuccess }) => {
  const [address, setAddress] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const savedAddressJson = localStorage.getItem("selectedAddress");
      const savedAddress = savedAddressJson ? JSON.parse(savedAddressJson) : null;

      if (!token || !savedAddress) {
        Swal.fire("Error", "Missing token or selected address. Please complete previous steps.", "error");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5110/api/CartOrder", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cartRes = await response.json();
        setAddress(savedAddress);
        setTotalAmount(cartRes.totalAmount || 0);
      } catch (error) {
        console.error("Error fetching cart:", error);
        Swal.fire("Error", "Failed to fetch cart data. Please try again.", "error");
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
    return new Date(fullYear, parseInt(month) - 1, 1).toISOString();
  };

  const validateInputs = () => {
    const { cardName, cardNumber, expiryDate, cvv, mode } = payment;

    if (!mode || !cardName || !cardNumber || !expiryDate || !cvv) {
      Swal.fire("Warning", "Please fill in all payment fields.", "warning");
      return false;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
      Swal.fire("Error", "Card number must be exactly 16 digits.", "error");
      return false;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      Swal.fire("Error", "CVV must be 3 or 4 digits.", "error");
      return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      Swal.fire("Error", "Expiry date must be in MM/YY format.", "error");
      return false;
    }

    const now = new Date();
    const expiry = convertExpiryDate(expiryDate);
    if (!expiry || new Date(expiry) < now) {
      Swal.fire("Error", "Expiry date is invalid or in the past.", "error");
      return false;
    }

    if (!address || !address.addressId) {
      Swal.fire("Error", "No delivery address selected.", "error");
      return false;
    }

    if (totalAmount <= 0) {
      Swal.fire("Error", "Cart total amount is zero or invalid.", "error");
      return false;
    }

    return true;
  };

  const handleSubmitPayment = async () => {
    if (!validateInputs()) return;

    const expiryDateISO = convertExpiryDate(payment.expiryDate);

    const payload = {
      name: payment.cardName,
      expiryDate: expiryDateISO,
      cvvNo: parseInt(payment.cvv),
      addressId: address.addressId,
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

      Swal.fire("Success", "✅ Payment saved successfully!", "success");
      if (onSuccess) onSuccess(data.paymentId);
    } catch (error) {
      console.error("Payment saving failed:", error);
      Swal.fire("Error", error.message || "❌ Failed to save payment. Please try again.", "error");
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
        <input
          className="form-control"
          value={`₹${totalAmount.toFixed(2)}`}
          disabled
        />
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
          maxLength={16}
          inputMode="numeric"
          value={payment.cardNumber}
          onChange={(e) => {
            const onlyDigits = e.target.value.replace(/\D/g, "");
            setPayment({ ...payment, cardNumber: onlyDigits });
          }}
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Expiry Date (MM/YY)</label>
          <input
            className="form-control"
            placeholder="MM/YY"
            maxLength={5}
            inputMode="numeric"
            value={payment.expiryDate}
            onChange={(e) => {
              let val = e.target.value.replace(/[^0-9/]/g, "");
              if (val.length === 2 && !val.includes("/")) {
                val += "/";
              }
              setPayment({ ...payment, expiryDate: val });
            }}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>CVV</label>
          <input
            className="form-control"
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={payment.cvv}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              setPayment({ ...payment, cvv: digits });
            }}
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
