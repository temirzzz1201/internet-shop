import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { placeCategory, getCategory } from '@/actions/clientActions';
import { ICategires, ICategiry } from '../types';

export const initialState: ICategires = {
  category: [],
  isLoading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategory.fulfilled, (state, action: PayloadAction<ICategiry[]>) => {
        state.isLoading = false;
        state.category = action.payload;
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить категории';
      })
      .addCase(placeCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        placeCategory.fulfilled,
        (state, action: PayloadAction<ICategiry>) => {
          state.isLoading = false;
          state.category.push(action.payload);
        }
      )
      .addCase(placeCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Что-то пошло не так';
      });
  },
});

export default categorySlice.reducer;

