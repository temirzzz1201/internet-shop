import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICart } from '@/types';
import {
  addToCart,
  removeFromCart,
  fetchCartItems,
  updateCartItem,
  clearCart,
} from '@/actions/clientActions';

interface CartState {
  items: ICart[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  items: [],
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        addToCart.fulfilled,
        (state, action: PayloadAction<ICart | undefined>) => {
          state.status = 'succeeded';
          if (action.payload) {
            state.items.push(action.payload);
          }
        }
      )
      .addCase(addToCart.rejected, (state, action: PayloadAction<unknown>) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Неизвестная ошибка';
      })
      .addCase(removeFromCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        removeFromCart.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = 'succeeded';
          console.log('Удаляемый id:', action.payload);
          state.items = state.items.filter(
            (item) => item.id.toString() !== action.payload
          );
        }
      )
      .addCase(
        removeFromCart.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.status = 'failed';
          state.error = (action.payload as string) || 'Неизвестная ошибка';
        }
      )
      .addCase(clearCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.status = 'succeeded';
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action: PayloadAction<unknown>) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Неизвестная ошибка';
      })
      .addCase(updateCartItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        updateCartItem.fulfilled,
        (state, action: PayloadAction<{ id: string; quantity: number }>) => {
          state.status = 'succeeded';
          const index = state.items.findIndex(
            (item) => item.id.toString() === action.payload.id
          );
          if (index !== -1) {
            state.items[index].quantity = action.payload.quantity;
          } else {
            console.warn(
              `Товар с id ${action.payload.id} не найден в корзине.`
            );
          }
        }
      )
      .addCase(
        updateCartItem.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.status = 'failed';
          state.error = (action.payload as string) || 'Неизвестная ошибка';
        }
      )
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchCartItems.fulfilled,
        (state, action: PayloadAction<ICart[] | undefined>) => {
          state.status = 'succeeded';
          state.items = action.payload ?? []; // Устанавливаем пустой массив, если payload = undefined
        }
      )
      .addCase(
        fetchCartItems.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.status = 'failed';
          state.error = (action.payload as string) || 'Неизвестная ошибка';
        }
      );
  },
});

export default cartSlice.reducer;
