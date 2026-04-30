
import { configureStore } from '@reduxjs/toolkit';
import authReducer    from '../features/auth/authSlice';
import cartReducer    from '../features/cart/cartSlice';
import productReducer from '../features/products/productSlice';

const store = configureStore({
  reducer: {
    auth:     authReducer,
    cart:     cartReducer,
    products: productReducer,
  },
});

export default store;