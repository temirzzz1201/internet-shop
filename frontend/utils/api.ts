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
    return null;
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

export const registerUser = async (userData: IUser): Promise<IUserResponse | undefined> => {
  try {
    const response = await api.post<IUserResponse>('users/register', userData);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    Cookies.set('accessToken', response.data.accessToken, { secure: true });

    return response.data;
  } catch (error) {
    console.error(`Ошибка регистрации пользователя: ${error}`);
    return undefined;
  }
};

export const loginUser = async (userData: IUser): Promise<IUserResponse | undefined> => {
  try {
    const response = await api.post<IUserResponse>('users/login', userData);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    Cookies.set('accessToken', response.data.accessToken, { secure: true });
    Cookies.set('user', JSON.stringify(response.data.user), { secure: true });
    return response.data;
  } catch (error) {
    console.error(`Ошибка авторизации пользователя: ${error}`);
    return undefined;
  }
};

export const fetchAllUsers = async (): Promise<AxiosResponse<IUser[]> | undefined> => {
  try {
    return await api.get<IUser[]>('/users/get-users');
  } catch (error) {
    console.error(`Ошибка получения пользователей: ${error}`);
    return undefined;
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
  }
};

export const fetchCategories = async (): Promise<
  AxiosResponse<ICategory[]> | undefined
> => {
  try {
    return (await api.get<ICategory[]>('products/all-categories')) || [];
  } catch (error) {
    console.error(`Ошибка получения категорий: ${error}`);
    return undefined;
  }
};

export const fetchAllProducts = async (): Promise<
  AxiosResponse<IIProduct[]> | undefined
> => {
  try {
    return (await api.get<IIProduct[]>('products/all-products')) || [];
  } catch (error) {
    console.error(`Ошибка получения продуктов: ${error}`);
    return undefined;
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
    return undefined;
  }
};

export const createCategory = async (categoryData: {
  categoryName: string;
}): Promise<AxiosResponse<ICategory> | undefined> => {
  try {
    return await api.post<ICategory>('products/create-category', categoryData, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Ошибка создания категории: ${error}`);
    return undefined;
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
    return undefined;
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
    return undefined;
  }
};

export const createOrder = async (orderData: {
  quantity: number;
  total_price: number;
  userId: number;
  productId: number;
}): Promise<AxiosResponse<IOrder> | undefined> => {
  try {
    return await api.post<IOrder>('orders/create-order', orderData, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Ошибка создания заказа: ${error}`);
    return undefined;
  }
};

export const fetchUserOrder = async (
  userId: string
): Promise<AxiosResponse<IOrder[]>> => {
  try {
    const response = await api.get(`orders/get-user-order`, {
      params: { userId },
    });
    console.log('fetchUserOrder ', response);

    return response;
  } catch (error) {
    console.error('Ошибка в fetchUserOrder:', error);
    throw error;
  }
};

export const createCartProduct = async (
  productData: {
    userId: string;
    productId: string;
    quantity: number;
  }
): Promise<AxiosResponse<ICart> | undefined> => { 
  try {
    return await api.post<ICart>('cart/add', productData, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Ошибка добавления в корзину: ${error}`);
    return undefined; 
  }
};


export const deleteCartProduct = async (id: string): Promise<void> => {
  try {
    console.log('deleteCartProduct ', id);
    
    await api.delete(`cart/remove/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Ошибка удаления из корзины: ${error}`);
  }
};


export const deleteAllfromCart = async (): Promise<void> => {
  try {
    await api.delete(`cart/remove-all`, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Ошибка очистки корзины: ${error}`);
  }
};

export const updateCartProduct = async (
  id: string,
  productData: { quantity: number }
): Promise<void> => {
  try {
    await api.put(`cart/update/${id}`, productData, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Ошибка обновления корзины: ${error}`);
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
    return undefined; 
  }
};

export const getOneProduct = async (id: string): Promise<IIProduct | undefined> => {
  try {
    const response: AxiosResponse<IIProduct> = await api.get(`/products/find-one`, {
      params: { id },
    });

    // Возвращаем только данные продукта, если они есть
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения продукта: ${error}`);
    return undefined; 
  }
};

export default api;
