import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCart, removeFromCart } from "../redux/action";
import { Link } from "react-router-dom";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Dummy items for empty cart preview
  const defaultItems = [
    {
      id: 1,
      title: "Cheese Pizza",
      price: 8.99,
      qty: 1,
      image: "https://via.placeholder.com/100x75?text=Cheese+Pizza",
    },
    {
      id: 2,
      title: "Veg Burger",
      price: 5.49,
      qty: 1,
      image: "https://via.placeholder.com/100x75?text=Veg+Burger",
    },
    {
      id: 3,
      title: "Chocolate Cake",
      price: 6.99,
      qty: 1,
      image: "https://via.placeholder.com/100x75?text=Choco+Cake",
    },
    {
      id: 4,
      title: "Cold Coffee",
      price: 3.99,
      qty: 1,
      image: "https://via.placeholder.com/100x75?text=Cold+Coffee",
    },
  ];

  // Increase qty of product in cart
  const addItem = (product) => {
    dispatch(addCart(product));
  };

  // Decrease qty or remove product if qty=1
  const removeItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const ShowCart = ({ items }) => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;

    items.forEach((item) => {
      subtotal += item.price * item.qty;
      totalItems += item.qty;
    });

    return (
      <section className="h-100 gradient-custom">
        <div className="container py-5">
          <div className="row d-flex justify-content-center my-4">
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h5 className="mb-0">Item List</h5>
                </div>
                <div className="card-body">
                  {items.map((item) => (
                    <div key={item.id}>
                      <div className="row d-flex align-items-center">
                        <div className="col-lg-3 col-md-12">
                          <div className="bg-image rounded">
                            <img
                              src={
                                item.image ||
                                "https://via.placeholder.com/100x75?text=No+Image"
                              }
                              alt={item.title}
                              width={100}
                              height={75}
                            />
                          </div>
                        </div>

                        <div className="col-lg-5 col-md-6">
                          <p>
                            <strong>{item.title}</strong>
                          </p>
                        </div>

                        <div className="col-lg-4 col-md-6">
                          <div
                            className="d-flex flex-column align-items-start mb-4"
                            style={{ maxWidth: "350px" }}
                          >
                            <div className="d-flex align-items-center mb-2">
                              <button
                                className="btn btn-outline-dark px-3"
                                onClick={() => removeItem(item.id)}
                              >
                                <i className="fas fa-minus"></i>
                              </button>

                              <span
                                className="mx-3"
                                style={{
                                  fontSize: "1.2rem",
                                  minWidth: "25px",
                                  textAlign: "center",
                                }}
                              >
                                {item.qty}
                              </span>

                              <button
                                className="btn btn-outline-dark px-3"
                                onClick={() => addItem(item)}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>

                            <p
                              className="mb-0"
                              style={{ fontWeight: "600", fontSize: "1rem" }}
                            >
                              ${item.price.toFixed(2)} x {item.qty} = $
                              {(item.price * item.qty).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <hr className="my-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products ({totalItems}) <span>${subtotal.toFixed(2)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Shipping <span>${shipping.toFixed(2)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                      </div>
                      <span>
                        <strong>${(subtotal + shipping).toFixed(2)}</strong>
                      </span>
                    </li>
                  </ul>

                  {items.length > 0 ? (
                    <Link
                      to="/checkout"
                      className="btn btn-dark btn-lg btn-block"
                    >
                      Go to checkout
                    </Link>
                  ) : (
                    <button disabled className="btn btn-dark btn-lg btn-block">
                      Go to checkout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
<div className="container mt-1 mb-5 py-3 px-4">
      {/* <h1 className="text-center">Cart</h1> */}
      <hr />
      {cartItems && cartItems.length > 0 ? (
        <ShowCart items={cartItems} />
      ) : (
        <ShowCart items={defaultItems} />
      )}
    </div>
  );
};

export default Cart;
