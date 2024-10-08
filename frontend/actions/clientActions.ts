import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../utils/baseUrl';
import { loginUser, registerUser, logoutUser } from '@/utils/api';
import { IUser, IIProduct, ICategiry } from '@/types';
import Cookies from 'js-cookie';


const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Произошла ошибка';
  }
  return 'Произошла ошибка';
};

export const placeProduct = createAsyncThunk<
  IIProduct,
  {
    categoryId: number;
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
    formData.append('categoryId', product.categoryId.toString());
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('stock', product.stock.toString());
    if (product.image) {
      formData.append('image', product.image);
    }


    const response = await axios.post(
      `${BASE_URL}/products/create-product`,
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

export const placeCategory = createAsyncThunk<
  ICategiry, { categoryName: string },
  { rejectValue: string }
>('categories/placeCategory', async (product, { rejectWithValue }) => {
  try {
    const categoryData = { categoryName: product.categoryName };

    const response = await axios.post(`${BASE_URL}/products/create-category`, categoryData, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 201 || response.status === 200) {
      return response.data as ICategiry;
    } else {
      return rejectWithValue('Не удалось создать категорию');
    }
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const getCategory = createAsyncThunk<
  ICategiry[],
  void,
  { rejectValue: string }
>('categories/getCategory', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/all-categories`);

    if (response.status === 200) {
      return response.data as ICategiry[];
    } else {
      return rejectWithValue('Не удалось получить категории');
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
      const response = await loginUser(userData);

      if (!response) {
        throw new Error('Response is undefined');
      }


      Cookies.set('role', response.user.role ?? 'customer'); // Укажите значение по умолчанию

      return response;
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


export const getUsers = createAsyncThunk(
  'users/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/users`)
      const usersData = response.data.users || []

      return usersData
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);