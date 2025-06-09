import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MenuCard = ({ menuId, price, heading, imgsrc, description }) => {
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token"); // Use JWT token for authorization
      if (!token) {
        alert("Please log in to add items to cart.");
        return;
      }

      // API expects { menuId, quantity } in POST body, userId is extracted from token on server side
      await axios.post(
        "http://localhost:5110/api/CartOrder",
        {
          menuId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Item added to cart!");

      // Dispatch event so Header updates cart count live
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response && error.response.data) {
        alert(`Failed to add item to cart: ${error.response.data}`);
      } else {
        alert("Failed to add item to cart.");
      }
    }
  };

  const handleViewProduct = () => {
    navigate(`/menu/${menuId}`);
  };

  return (
    <div className="box">
      <div>
        <div
          className="img-box"
          onClick={handleViewProduct}
          style={{ cursor: "pointer" }}
        >
          <img src={imgsrc} alt={heading} />
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
            >
              <i className="fa-solid fa-cart-shopping"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
