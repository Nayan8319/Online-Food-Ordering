import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Cart = ({ onCartUpdate }) => {
  const [cartData, setCartData] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const token = localStorage.getItem("token");

  // Fetch cart data from API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5110/api/CartOrder", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartData(response.data);
      setErrorMsg("");
      if (onCartUpdate) onCartUpdate(response.data); // Notify parent
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartData({ items: [], totalAmount: 0 });
      setErrorMsg("Failed to load cart. Please try again.");
      if (onCartUpdate) onCartUpdate({ items: [], totalAmount: 0 }); // Notify parent empty cart
    } finally {
      setLoading(false);
    }
  };

  // Update quantity of a cart item
  const updateQty = async (cartId, newQty, menuId) => {
    try {
      if (newQty < 1 || newQty > 10) {
        setErrorMsg("Quantity must be between 1 and 10.");
        return;
      }
      setErrorMsg("");
      const response = await axios.put(
        `http://localhost:5110/api/CartOrder/${cartId}`,
        { menuId: menuId, quantity: newQty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartData(response.data);
      if (onCartUpdate) onCartUpdate(response.data);

      // Dispatch event so header updates cart count live
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error updating quantity:", error);
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to update quantity.";
      setErrorMsg(backendMessage);
    }
  };

  // Remove an item from cart
  const removeItem = async (cartId) => {
    try {
      setErrorMsg("");
      const response = await axios.delete(
        `http://localhost:5110/api/CartOrder/${cartId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartData(response.data);
      if (onCartUpdate) onCartUpdate(response.data);

      // Dispatch event so header updates cart count live
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error removing item:", error);
      setErrorMsg("Failed to remove item. Please try again.");
    }
  };

  // Generate full image URL with fallback logic
  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return "/images/fallback-image.png";
    if (
      imageUrl.startsWith("/CategoryImages") ||
      imageUrl.startsWith("/MenuImages")
    ) {
      return `http://localhost:5110${imageUrl}`;
    }
    return `http://localhost:5110/MenuImages/${imageUrl}`;
  };

  // Automatically clear error message after 3 seconds
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  if (loading)
    return <div className="text-center my-5">Loading your cart...</div>;

  const ShowCart = ({ items, total }) => {
    const shipping = 0.0; // Free shipping now

    return (
      <section className="h-100 gradient-custom">
        <div className="container py-5">
          <div className="row d-flex justify-content-center my-4">
            {/* Cart Items */}
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h5 className="mb-0">Your Cart Items</h5>
                </div>
                <div className="card-body">
                  {errorMsg && (
                    <div className="alert alert-danger" role="alert">
                      {errorMsg}
                    </div>
                  )}
                  {items.map((item) => (
                    <div key={item.cartId}>
                      <div className="row align-items-center mb-4">
                        <div className="col-md-2">
                          <img
                            src={getImageSrc(item.imageUrl)}
                            alt={item.menuName}
                            className="img-fluid rounded"
                            style={{ width: 80, height: 60, objectFit: "cover" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/images/fallback-image.png";
                            }}
                          />
                        </div>
                        <div className="col-md-3">
                          <h6 className="mb-0">{item.menuName}</h6>
                          <small className="text-muted">
                            ₹{item.pricePerItem.toFixed(2)}
                          </small>
                        </div>
                        <div className="col-md-3 d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-dark me-2"
                            onClick={() =>
                              item.quantity > 1
                                ? updateQty(item.cartId, item.quantity - 1, item.menuId)
                                : removeItem(item.cartId)
                            }
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-outline-dark ms-2"
                            onClick={() => {
                              if (item.quantity < 10) {
                                updateQty(item.cartId, item.quantity + 1, item.menuId);
                              } else {
                                setErrorMsg(
                                  "You cannot add more than 10 units of this item."
                                );
                              }
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div className="col-md-2">
                          <strong>₹{item.totalPrice.toFixed(2)}</strong>
                        </div>
                        <div className="col-md-2 text-end">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => removeItem(item.cartId)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      Products ({items.length})
                      <span>₹{total.toFixed(2)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      Shipping
                      <span style={{ color: "blue", fontWeight: "bold" }}>Free</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between fw-bold">
                      Total
                      <span>₹{(total + shipping).toFixed(2)}</span>
                    </li>
                  </ul>
                  <Link to="/checkout" className="btn btn-dark btn-lg w-100 mt-3">
                    Go to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="container mt-2 mb-5 py-3 px-4">
      <hr />
      {cartData?.items?.length > 0 ? (
        <ShowCart items={cartData.items} total={cartData.totalAmount} />
      ) : (
        <div className="text-center py-5">
          <h4>Your cart is empty.</h4>
          <Link to="/menu" className="btn btn-outline-dark mt-3">
            Browse Menu
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
