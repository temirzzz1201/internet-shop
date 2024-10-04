import { configureStore } from "@reduxjs/toolkit";
import productSlice from './productReducer'
import authSlice from "./authReducer";

const store = configureStore({
  reducer: {
    products: productSlice,
    auth: authSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;



