import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "@/utils/baseUrl";
import axios from "axios";
import { IIProducts, IIProduct } from "../types";

export const initialState: IIProducts = {
  products: [],
  isLoading: false,
  error: null,
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Произошла ошибка';
  }
  return 'Произошла ошибка';
};

export const placeProduct = createAsyncThunk<
  IIProduct,
  { name: string; description: string; price: number; stock: number; image: File | null },
  { rejectValue: string }
>(
  "products/placeProduct",
  async (product, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price.toString());
      formData.append('stock', product.stock.toString());
      if (product.image) {
        formData.append('image', product.image);
      }

      const response = await axios.post(`${BASE_URL}/admin/upload-product`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201 || response.status === 200) {
        return response.data as IIProduct;
      } else {
        return rejectWithValue("Не удалось загрузить продукт");
      }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(placeProduct.fulfilled, (state, action: PayloadAction<IIProduct>) => {
        state.isLoading = false;
        state.products.push(action.payload);
      })
      .addCase(placeProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Что-то пошло не так';
      });
  },
});

export default productSlice.reducer;
