import axios from 'axios';
import Cookies from 'js-cookie';
import { AxiosResponse } from 'axios';
import { BASE_URL } from './baseUrl';
import {
  IUser,
  IUserResponse,
  IIProduct,
  ICategory,
  IOrder,
  ICart,
} from '../types';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
});

const refreshToken = async (): Promise<string | null> => {
  try {
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (!storedRefreshToken) {
      throw new Error('Refresh token not found');
    }

    const response = await api.post<{ accessToken: string }>(
      'users/refresh-token',
      { token: storedRefreshToken }
    );

    const newAccessToken = response.data.accessToken;

    Cookies.set('accessToken', newAccessToken, { secure: true });
    return newAccessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } else {
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const registerUser = async (
  userData: IUser
): Promise<IUserResponse | undefined> => {
  try {
    const response = await api.post<IUserResponse>('users/register', userData);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    Cookies.set('accessToken', response.data.accessToken, { secure: true });

    return response.data;
  } catch (error) {
    // @ts-ignore: can be undefined
    throw error.response?.data?.message || 'Ошибка регистрации';
  }
};

export const loginUser = async (
  userData: IUser
): Promise<IUserResponse | undefined> => {
  try {
    const response = await api.post<IUserResponse>('users/login', userData);

    if (response.data.message === 'авторизация успешна') {
      const { id, username, role } = response.data.user;

      const safeUserData = {
        id: id,
        username: username,
        role: role,
      };

      localStorage.setItem('refreshToken', response.data.refreshToken);
      Cookies.set('accessToken', response.data.accessToken, { secure: true });
      Cookies.set('user', JSON.stringify(safeUserData), { secure: true });
    }

    return response.data;
  } catch (error) {
    console.error(`Ошибка авторизации пользователя: ${error}`);
    throw error;
  }
};

export const fetchAllUsers = async (): Promise<
  AxiosResponse<IUser[]> | undefined
> => {
  try {
    return await api.get<IUser[]>('/users/get-users');
  } catch (error) {
    console.error(`Ошибка получения пользователей: ${error}`);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    Cookies.remove('accessToken');
    Cookies.remove('user');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('busket');
  } catch (error) {
    console.error(`Ошибка выхода пользователя: ${error}`);
    throw error;
  }
};

export const fetchCategories = async (): Promise<
  AxiosResponse<ICategory[]> | undefined
> => {
  try {
    return (await api.get<ICategory[]>('category/all-categories')) || [];
  } catch (error) {
    console.error(`Ошибка получения категорий: ${error}`);
    throw error;
  }
};

export const createCategory = async (categoryData: {
  categoryName: string;
}): Promise<AxiosResponse<ICategory> | undefined> => {
  try {
    return await api.post<ICategory>('category/create-category', categoryData, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Ошибка создания категории: ${error}`);
    throw error;
  }
};

export const fetchAllProducts = async (): Promise<
  AxiosResponse<IIProduct[]> | undefined
> => {
  try {
    return (await api.get<IIProduct[]>('products/all-products')) || [];
  } catch (error) {
    console.error(`Ошибка получения продуктов: ${error}`);
    throw error;
  }
};

export const createProduct = async (
  formData: FormData
): Promise<AxiosResponse<IIProduct> | undefined> => {
  try {
    return await api.post<IIProduct>('products/create-product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.error(`Ошибка создания продукта: ${error}`);
    throw error;
  }
};

export const deleteChoosenProduct = async (
  productId: number,
  deleteFlag: string
): Promise<AxiosResponse | undefined> => {
  try {
    return await axios.delete(`${BASE_URL}/${deleteFlag}/${productId}`);
  } catch (error) {
    console.error(`Ошибка удаления продукта: ${error}`);
    throw error;
  }
};

export const updateChoosenProduct = async (
  productId: number,
  updates: Partial<IIProduct>,
  updateFlag: string
): Promise<AxiosResponse<IIProduct> | undefined> => {
  try {
    return await axios.put(`${BASE_URL}/${updateFlag}/${productId}`, updates);
  } catch (error) {
    console.error(`Ошибка обновления продукта: ${error}`);
    throw error;
  }
};

export const createOrder = async (orderData: {
  quantity: number;
  total_price: number;
  userId: number;
  productId: number;
}): Promise<AxiosResponse<IOrder> | undefined> => {
  try {
    const response = await api.post<IOrder>('orders/create-order', orderData, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response) return response || [];
  } catch (error) {
    console.error(`Ошибка создания заказа: ${error}`);
    throw error;
  }
};

export const fetchUserOrder = async (
  userId: string
): Promise<AxiosResponse<IOrder[]>> => {
  try {
    const response = await api.get(`orders/get-user-order`, {
      params: { userId },
    });

    return response;
  } catch (error) {
    console.error('Ошибка в fetchUserOrder:', error);
    throw error;
  }
};

export const createCartProduct = async (productData: {
  userId: string;
  productId: string;
  quantity: number;
}): Promise<AxiosResponse<ICart> | undefined> => {
  try {
    const response = await api.post<ICart>('cart/add', productData, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response;
  } catch (error) {
    console.error(`Ошибка добавления в корзину: ${error}`);
    throw error;
  }
};

export const deleteCartProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`cart/remove/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Ошибка удаления из корзины: ${error}`);
    throw error;
  }
};

export const deleteAllfromCart = async (): Promise<void> => {
  try {
    await api.delete(`cart/remove-all`, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Ошибка очистки корзины: ${error}`);
    throw error;
  }
};

export const updateCartProduct = async (
  id: number,
  productData: { quantity: number }
): Promise<void> => {
  try {
    await api.put(`cart/update/${id}`, productData, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Ошибка обновления корзины: ${error}`);
    throw error;
  }
};

export const getCartProducts = async (
  userId: string
): Promise<AxiosResponse<ICart[]> | undefined> => {
  try {
    return await api.get<ICart[]>(`cart/${userId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Ошибка получения заказов корзины: ${error}`);
    throw error;
  }
};

export const getOneProduct = async (
  id: string
): Promise<IIProduct | undefined> => {
  try {
    const response: AxiosResponse<IIProduct> = await api.get(
      `/products/find-one`,
      {
        params: { id },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Ошибка получения продукта: ${error}`);
    throw error;
  }
};

export const sendPassword = async (email: string) => {
  try {
    const response = await api.post('users/forgot-password', { email });

    return response;
  } catch (error) {
    console.error('Ошибка в sendPassword: ', error);
    throw error;
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await api.post(`users/reset-password/${token}`, {
      password,
    });
    return response;
  } catch (error) {
    console.error('Ошибка в resetPassword: ', error);
    throw error;
  }
};

export default api;
