import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from "./actionTypes";

const initialState = {
  cartItems: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const existItem = state.cartItems.find(item => item.menuId === action.payload.menuId);
      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.menuId === existItem.menuId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
        };
      }

    case REMOVE_FROM_CART:
      const targetItem = state.cartItems.find(item => item.menuId === action.payload);
      if (targetItem) {
        if (targetItem.quantity > 1) {
          return {
            ...state,
            cartItems: state.cartItems.map(item =>
              item.menuId === action.payload
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          };
        } else {
          return {
            ...state,
            cartItems: state.cartItems.filter(item => item.menuId !== action.payload),
          };
        }
      }
      return state;

    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
};

export default cartReducer;
