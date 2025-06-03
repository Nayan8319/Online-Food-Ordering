import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from "./actionTypes";

// Add product to cart
export const addCart = (product) => {
  return {
    type: ADD_TO_CART,
    payload: product,
  };
};

// Remove product from cart (optional)
export const removeFromCart = (productId) => {
  return {
    type: REMOVE_FROM_CART,
    payload: productId,
  };
};

// Clear cart (optional)
export const clearCart = () => {
  return {
    type: CLEAR_CART,
  };
};
