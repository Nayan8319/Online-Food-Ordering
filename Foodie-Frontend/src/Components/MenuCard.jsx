import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MenuCard = ({ menuId, price, heading, imgsrc, description }) => {
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to add items to cart.');
        return;
      }

      await axios.post('http://localhost:5110/api/Cart', {
        userId,
        menuId,
        quantity: 1
      });

      alert('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart.');
    }
  };

  const handleViewProduct = () => {
    navigate(`/menu/${menuId}`);
  };

  return (
    <div className="box">
      <div>
        <div className="img-box" onClick={handleViewProduct} style={{ cursor: 'pointer' }}>
          <img src={imgsrc} alt={heading} />
        </div>
        <div className="detail-box">
          <h5 onClick={handleViewProduct} style={{ cursor: 'pointer' }}>{heading}</h5>
          <p>{description}</p>
          <div className="options">
            <h6>₹{price?.toFixed(2)}</h6>
            <button className="btn p-0 border-0 bg-transparent" onClick={handleAddToCart}>
              <i className="fa-solid fa-cart-shopping"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
