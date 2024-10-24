import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchAllUsers,
  createProduct,
  createCategory,
  fetchCategories,
  fetchAllProducts,
  deleteChoosenProduct,
  updateChoosenProduct,
  createOrder,
} from '@/utils/api';
import { IUser, IIProduct, ICategory, IOrder } from '@/types';
import { getErrorMessage } from '@/utils/errorMessage';

export const placeProduct = createAsyncThunk<
  IIProduct,
  {
    categoryId: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: File[] | null;
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

    if (product.images) {
      product.images.forEach((image) => {
        formData.append('images', image); // Используйте 'images', если вы хотите, чтобы на сервере они были доступны как массив
      });
    }

    const response = await createProduct(formData);

    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else {
      return rejectWithValue('Не удалось загрузить продукт');
    }
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const getProducts = createAsyncThunk<
  IIProduct[],
  void,
  { rejectValue: string }
>('products/getProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchAllProducts();

    if (response.status === 200) {
      return response.data;
    } else {
      return rejectWithValue('Не удалось получить категории');
    }
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const placeCategory = createAsyncThunk<
  ICategory,
  { categoryName: string },
  { rejectValue: string }
>('categories/placeCategory', async (category, { rejectWithValue }) => {
  try {
    const response = await createCategory({
      categoryName: category.categoryName,
    });

    if (response.status === 201 || response.status === 200) {
      return response.data as ICategory;
    } else {
      return rejectWithValue('Не удалось создать категорию');
    }
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const getCategory = createAsyncThunk<
  ICategory[],
  void,
  { rejectValue: string }
>('categories/getCategory', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchCategories();

    if (response.status === 200) {
      return response.data;
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
      const response = await fetchAllUsers();
      const usersData = response.data || [];

      return usersData;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteProduct = createAsyncThunk<
  number,
  { productId: number; deleteFlag: string },
  { rejectValue: string }
>(
  'products/deleteProduct',
  async ({ productId, deleteFlag }, { rejectWithValue }) => {
    try {
      const response = await deleteChoosenProduct(productId, deleteFlag);

      if (response.status === 200) {
        return productId;
      } else {
        return rejectWithValue('Не удалось удалить продукт');
      }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateProduct = createAsyncThunk<
  IIProduct,
  { productId: number; updates: Partial<IIProduct>; updateFlag: string },
  { rejectValue: string }
>(
  'products/updateProduct',
  async ({ productId, updates, updateFlag }, { rejectWithValue }) => {
    try {
      const response = await updateChoosenProduct(
        productId,
        updates,
        updateFlag
      );

      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue('Не удалось обновить продукт');
      }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const placeOrder = createAsyncThunk<
  IOrder,
  {
    quantity: number;
    total_price: number;
    userId: number;
    productId: number;
  },
  { rejectValue: string }
>('orders/createOrder', async (orderData, { rejectWithValue }) => {
  try {
    const response = await createOrder(orderData);

    console.log('placeOrder response ', response);

    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
