// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import {
//   fetchCartItems as apiFetchCartItems,
//   updateCartItem as apiUpdateCartItem,
//   removeFromCart as apiRemoveFromCart,
//   clearCart as apiClearCart,
// } from '@/actions/clientActions';
// import { IBusketProduct } from '@/types';

// // Типы
// interface CartState {
//   cartItems: IBusketProduct[];
//   totalQuantity: number;
//   isLoading: boolean;
//   error: string | null;
// }

// // Начальное состояние
// const initialState: CartState = {
//   cartItems: [],
//   totalQuantity: 0,
//   isLoading: false,
//   error: null,
// };

// // Асинхронные действия
// export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async (userId: number, { rejectWithValue }) => {
//   try {
//     const data = await apiFetchCartItems(userId);
//     return data;
//   } catch (error: any) {
//     return rejectWithValue(error.message);
//   }
// });

// export const updateCartItem = createAsyncThunk(
//   'cart/updateCartItem',
//   async ({ id, quantity }: { id: string; quantity: number }, { rejectWithValue }) => {
//     try {
//       await apiUpdateCartItem({ id, quantity });
//       return { id, quantity };
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const removeFromCart = createAsyncThunk(
//   'cart/removeFromCart',
//   async (id: number, { rejectWithValue }) => {
//     try {
//       await apiRemoveFromCart({ id });
//       return id;
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
//   try {
//     await apiClearCart();
//     return true;
//   } catch (error: any) {
//     return rejectWithValue(error.message);
//   }
// });

// // Слайс
// const cartSlice = createSlice({
//   name: 'cart',
//   initialState,
//   reducers: {
//     calculateTotalQuantity(state) {
//       state.totalQuantity = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCartItems.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchCartItems.fulfilled, (state, action: PayloadAction<IBusketProduct[]>) => {
//         state.cartItems = action.payload;
//         state.isLoading = false;
//         state.totalQuantity = action.payload.reduce((sum, item) => sum + item.quantity, 0);
//       })
//       .addCase(fetchCartItems.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<{ id: number; quantity: number }>) => {
//         const { id, quantity } = action.payload;
//         const item = state.cartItems.find((item) => item.id === id);
//         if (item) {
//           item.quantity = quantity;
//           state.totalQuantity = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
//         }
//       })
//       .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<number>) => {
//         state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
//         state.totalQuantity = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
//       })
//       .addCase(clearCart.fulfilled, (state) => {
//         state.cartItems = [];
//         state.totalQuantity = 0;
//       });
//   },
// });

// export const { calculateTotalQuantity } = cartSlice.actions;
// export default cartSlice.reducer;
