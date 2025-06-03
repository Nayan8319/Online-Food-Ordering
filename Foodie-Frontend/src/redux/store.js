import { createStore, combineReducers } from "redux";
import cartReducer from "./cartReducer";

// If you have other reducers, combine them here
const rootReducer = combineReducers({
  cart: cartReducer,
  // other reducers ...
});

const store = createStore(
  rootReducer,
  // Enable Redux DevTools extension if available
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
