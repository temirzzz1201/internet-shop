import { configureStore } from '@reduxjs/toolkit';
import productSlice from './productReducer';
import authSlice from './authReducer';
import usersSlice from './usersReducer';
import categorySlice from './categoryReduser';

const store = configureStore({
  reducer: {
    products: productSlice,
    auth: authSlice,
    users: usersSlice,
    category: categorySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
