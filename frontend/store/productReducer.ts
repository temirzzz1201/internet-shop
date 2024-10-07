import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { placeProduct } from '@/actions/clientActions';
import { IIProducts, IIProduct } from '../types';

export const initialState: IIProducts = {
  products: [],
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        placeProduct.fulfilled,
        (state, action: PayloadAction<IIProduct>) => {
          state.isLoading = false;
          state.products.push(action.payload);
        }
      )
      .addCase(placeProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Что-то пошло не так';
      });
  },
});

export default productSlice.reducer;
