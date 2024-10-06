import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../utils/baseUrl';
import { loginUser, registerUser, logoutUser } from '@/utils/api';
import { IUser, IIProduct } from '@/types';

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Произошла ошибка';
  }
  return 'Произошла ошибка';
};

export const placeProduct = createAsyncThunk<
  IIProduct,
  {
    name: string;
    description: string;
    price: number;
    stock: number;
    image: File | null;
  },
  { rejectValue: string }
>('products/placeProduct', async (product, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('stock', product.stock.toString());
    if (product.image) {
      formData.append('image', product.image);
    }

    const response = await axios.post(
      `${BASE_URL}/admin/upload-product`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    if (response.status === 201 || response.status === 200) {
      return response.data as IIProduct;
    } else {
      return rejectWithValue('Не удалось загрузить продукт');
    }
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const register = createAsyncThunk(
  'auth/register',
  async (userData: IUser, { rejectWithValue }) => {
    try {
      return await registerUser(userData);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData: IUser, { rejectWithValue }) => {
    try {
      return await loginUser(userData);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      return await logoutUser();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
