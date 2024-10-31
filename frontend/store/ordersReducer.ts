import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrdersState, IOrder } from '../types';
import { getUserOrders, placeOrder } from '@/actions/clientActions';

const initialState: IOrdersState = {
  orders: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action: PayloadAction<IOrder>) => {
        state.orders.push(action.payload);
        state.loading = false;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка при создании заказа';
      })
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserOrders.fulfilled,
        (state, action: PayloadAction<IOrder[]>) => {
          state.orders = action.payload;
          state.loading = false;
        }
      )
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? 'Ошибка при получении заказов пользователя';
      });
  },
});

export default ordersSlice.reducer;
