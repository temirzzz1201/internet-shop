import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCartItems,
  updateCartItem,
  removeFromCart,
  clearCart,
  addToCart,
} from '@/actions/clientActions';
import { ICartItem } from '@/types';

interface CartState {
  cartItems: ICartItem[];
  totalQuantity: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartItems: [],
  totalQuantity: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.cartItems = action.payload as any;

        // @ts-ignore: should type products
        state.totalQuantity = action.payload.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        state.isLoading = false;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch cart items';
      })

      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const newItem = action.payload;

        const existingItem = state.cartItems.find(
          (item) => item.id === newItem!.id
        );
        if (existingItem) {
          existingItem.quantity += newItem!.quantity;
        } else {
          // @ts-ignore: posible undefined
          state.cartItems.push(newItem);
        }

        state.totalQuantity = state.cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        state.isLoading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add item to cart';
      })

      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { id, quantity } = action.payload;
        const item = state.cartItems.find((item) => item.id === id);
        if (item) {
          item.quantity = quantity;
        }
        state.totalQuantity = state.cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        state.isLoading = false;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update cart item';
      })

      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== action.payload
        );
        state.totalQuantity = state.cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        state.isLoading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to remove cart item';
      })

      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cartItems = [];
        state.totalQuantity = 0;
        state.isLoading = false;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to clear cart';
      });
  },
});

export default cartSlice.reducer;
