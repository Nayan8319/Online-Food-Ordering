import React, { useEffect, useState } from "react";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    username: "john_doe",
    email: "john@example.com",
    phone: "9876543210",
  });

  useEffect(() => {
    // MOCK DATA SIMULATE FETCH
    const mockCartItems = [
      {
        cartId: 1,
        quantity: 2,
        totalPrice: 21.98,
        menu: {
          menuId: 1,
          name: "Menu Item 1",
          price: 10.99,
          imageUrl: "menu1.jpg",
        },
      },
      {
        cartId: 2,
        quantity: 1,
        totalPrice: 15.49,
        menu: {
          menuId: 2,
          name: "Menu Item 2",
          price: 15.49,
          imageUrl: "menu2.jpg",
        },
      },
    ];

    setTimeout(() => {
      setCartItems(mockCartItems);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div className="container py-5">Loading cart...</div>;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.menu.price || 0) * item.quantity,
    0
  );
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const shipping = 30.0;
  const totalAmount = subtotal + shipping;

  return (
    <div className="container py-5">
      <h1 className="mb-4  mt-4 text-center">Checkout</h1>
      <div className="row">
        {/* Order Summary */}
        <div className="col-md-4 order-md-last">
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5>Order Summary</h5>
            </div>
            <ul className="list-group list-group-flush">
              {cartItems.map(({ cartId, menu, quantity }) => (
                <li
                  key={cartId}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {menu.name} x {quantity}
                  <span>${(menu.price * quantity).toFixed(2)}</span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <span>Products ({totalQuantity})</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Shipping</span>
                <strong>${shipping.toFixed(2)}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between border-0">
                <strong>Total Amount</strong>
                <strong>${totalAmount.toFixed(2)}</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Billing + Payment */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">
              <h4>User Information</h4>
            </div>
            <div className="card-body">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <hr />
              <button
                className="btn btn-outline-primary mb-3"
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                {showAddressForm ? "Cancel Address" : "Add Address"}
              </button>

              {showAddressForm && (
                <>
                  <h5 className="mb-3">Billing Address</h5>
                  <form>
                    {/* Address Fields */}
                    <div className="mb-3">
                      <label htmlFor="street" className="form-label">Street</label>
                      <input type="text" id="street" className="form-control" required />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="city" className="form-label">City</label>
                        <input type="text" id="city" className="form-control" required />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="state" className="form-label">State</label>
                        <input type="text" id="state" className="form-control" required />
                      </div>
                      <div className="col-md-2 mb-3">
                        <label htmlFor="zip" className="form-label">Zip</label>
                        <input type="text" id="zip" className="form-control" required />
                      </div>
                    </div>

                    {/* Address Type */}
                    <div className="mb-3">
                      <label className="form-label d-block">Address Type</label>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="addressType"
                          id="home"
                          value="Home"
                          defaultChecked
                        />
                        <label className="form-check-label" htmlFor="home">Home</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="addressType"
                          id="other"
                          value="Other"
                        />
                        <label className="form-check-label" htmlFor="other">Other</label>
                      </div>
                    </div>
                    <hr />
                  </form>
                </>
              )}

              <h4 className="mb-3">Payment</h4>
              <form>
                <div className="mb-3">
                  <label htmlFor="paymentMode" className="form-label">Payment Mode</label>
                  <select id="paymentMode" className="form-select" required>
                    <option value="">Select Payment Mode</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="cardName" className="form-label">Name on Card</label>
                  <input type="text" id="cardName" className="form-control" required />
                </div>

                <div className="mb-3">
                  <label htmlFor="cardNumber" className="form-label">Card Number</label>
                  <input type="text" id="cardNumber" className="form-control" required />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                    <input type="text" id="expiryDate" className="form-control" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cvv" className="form-label">CVV</label>
                    <input type="text" id="cvv" className="form-control" required />
                  </div>
                </div>

                <button type="submit" className="btn btn-success btn-lg w-100" disabled>
                  Place Order
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
