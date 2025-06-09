import React, { useEffect, useState } from "react";
import axios from "axios";
import UserInfoStep from "./CheckOut/UserInfoStep";
import DeliveryAddressStep from "./CheckOut/DeliveryAddressStep";
import PaymentStep from "./CheckOut/PaymentStep";
import OrderSummaryStep from "./CheckOut/OrderSummaryStep";
import OrderSuccess from "./CheckOut/OrderSuccess";
import { useNavigate } from "react-router-dom";

const API_BASE_CART = "http://localhost:5110/api/CartOrder";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [orderId, setOrderId] = useState(null);

  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    type: "Home",
    addressId: null,
  });

  const [payment, setPayment] = useState({
    mode: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [paymentDone, setPaymentDone] = useState(
    localStorage.getItem("paymentDone") === "true"
  );

  const token = localStorage.getItem("token");
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_CART, { headers: authHeaders });

      const items = response.data.items.map((item) => ({
        cartId: item.cartId,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        menu: {
          menuId: item.menuId,
          name: item.menuName,
          price: item.pricePerItem,
          imageUrl: item.imageUrl,
        },
      }));

      if (items.length === 0) {
        navigate("/menu");
        return;
      }

      setCartItems(items);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      alert("Failed to load cart. Please login again.");
      navigate("/menu");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!paymentDone) {
      fetchCart();
    }
  }, [paymentDone]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("paymentDone");
    };
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.menu.price * item.quantity, 0);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const shipping = 0;
  const totalAmount = subtotal + shipping;

  const nextStep = () => {
    if (paymentDone && currentStep >= 3) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    if (paymentDone && currentStep >= 4) return;
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  if (orderId) return <OrderSuccess orderId={orderId} />;

  if (loading)
    return <div className="container py-5">Loading cart from server...</div>;

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 mt-5">Checkout</h2>

      <div className="row">
        <div className="col-md-8">
          <div className="d-flex justify-content-between mb-4">
            {["User Info", "Delivery", "Payment", "Summary"].map((label, index) => (
              <div
                key={index}
                className={`text-center flex-fill ${
                  currentStep === index + 1 ? "fw-bold text-primary" : ""
                }`}
              >
                {index + 1}. {label}
              </div>
            ))}
          </div>

          {currentStep === 1 && <UserInfoStep user={user} setUser={setUser} />}
          {currentStep === 2 && !paymentDone && (
            <DeliveryAddressStep
              address={address}
              setAddress={setAddress}
              onSaveSuccess={(savedId) => {
                setAddress((prev) => ({ ...prev, addressId: savedId }));
                nextStep();
              }}
            />
          )}
          {currentStep === 3 && !paymentDone && (
            <PaymentStep
              payment={payment}
              setPayment={setPayment}
              addressId={address.addressId}
              totalAmount={totalAmount}
              onSuccess={() => {
                setPaymentDone(true);
                localStorage.setItem("paymentDone", "true");
                nextStep();
              }}
            />
          )}
          {currentStep === 4 && (
            <OrderSummaryStep
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              totalQuantity={totalQuantity}
              payment={payment}
              addressId={address.addressId}
              totalAmount={totalAmount}
              onOrderSuccess={(id) => setOrderId(id)}
            />
          )}

          <div className="d-flex justify-content-between mt-4">
            {currentStep > 1 && (
              <button className="btn btn-secondary" onClick={prevStep}>
                Back
              </button>
            )}
            {currentStep < 4 && (
              <button className="btn btn-primary" onClick={nextStep}>
                Next
              </button>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-bold">In Your Cart</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Shipping</span>
                <span className="text-primary fw-semibold">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-bold">You Added These Items</h5>
            </div>
            <div className="card-body">
              {cartItems.map(({ cartId, menu, quantity }) => (
                <div className="d-flex mb-3" key={cartId}>
                  <img
                    src={`http://localhost:5110${menu.imageUrl}`}
                    alt={menu.name}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginRight: "10px",
                    }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{menu.name}</div>
                    <div className="d-flex justify-content-between mt-1 align-items-center">
                      <span>{quantity}x</span>
                      <span>₹{menu.price.toFixed(2)}</span>
                      <span className="fw-bold">
                        ₹{(menu.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <button
                className="btn btn-primary w-100 mt-3"
                onClick={() => {
                  if (paymentDone) {
                    alert("You can't modify the cart after placing the order.");
                  } else {
                    window.location.href = "/cart";
                  }
                }}
              >
                Go to Cart to Edit Items
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
