import { configureStore } from '@reduxjs/toolkit';

const cartReducer = (state = { items: [] }, action) => {
  switch (action.type) {
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: {
    cart: cartReducer
  }
});