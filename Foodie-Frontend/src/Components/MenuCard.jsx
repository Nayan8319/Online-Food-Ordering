import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import './MenuCard.css'; // Ensure this file exists

const MenuCard = ({ menuId, price, heading, imgsrc, description, quantity }) => {
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Unauthorized", "Please log in to add items to cart.", "warning");
        return;
      }

      await axios.post(
        "http://localhost:5110/api/CartOrder",
        { menuId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire("Added!", `${heading} has been added to your cart.`, "success");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire(
        "Error",
        error.response?.data || "Failed to add item to cart.",
        "error"
      );
    }
  };

  const handleViewProduct = () => {
    navigate(`/menu/${menuId}`);
  };

  return (
    <div className="box">
      <div className="img-box-wrapper" onClick={handleViewProduct}>
        <div className="img-box" style={{ cursor: "pointer" }}>
          <img src={imgsrc} alt={heading} />
          {quantity === 0 && <span className="out-of-stock">Out of Stock</span>}
        </div>
      </div>
      <div className="detail-box">
        <h5 onClick={handleViewProduct} style={{ cursor: "pointer" }}>
          {heading}
        </h5>
        <p>{description}</p>
        <div className="options">
          <h6>₹{price?.toFixed(2)}</h6>
          <button
            className="btn p-2 border-0 rounded btn-warning text-black transition"
            onClick={handleAddToCart}
            title="Add to Cart"
            disabled={quantity === 0}
          >
            <i className="fa-solid fa-cart-shopping"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
