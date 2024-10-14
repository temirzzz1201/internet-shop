import axios from 'axios';
import Cookies from 'js-cookie';
import { AxiosResponse } from 'axios';
import { BASE_URL } from './baseUrl';
import { IUser, IUserResponse, IIProduct, ICategory } from '../types';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshToken = async (): Promise<string | null> => {
  try {
    const storedRefreshToken = localStorage.getItem('refreshToken');

    console.log('storedRefreshToken ', storedRefreshToken);
    

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

export const registerUser = async (userData: IUser): Promise<IUserResponse> => {
  const response = await api.post<IUserResponse>('users/register', userData);
  localStorage.setItem('refreshToken', response.data.refreshToken); 
  Cookies.set('accessToken', response.data.accessToken, { secure: true }); 
  return response.data;
};

export const loginUser = async (userData: IUser): Promise<IUserResponse> => {
  const response = await api.post<IUserResponse>('users/login', userData);
  localStorage.setItem('refreshToken', response.data.refreshToken); 
  localStorage.setItem('userName', response.data.user.username ?? ''); 

  Cookies.set('accessToken', response.data.accessToken, { secure: true });
  return response.data;
};

export const fetchCategories = async (): Promise<AxiosResponse<ICategory[]>> => {
  return await api.get<ICategory[]>('products/all-categories');
};

export const fetchProducts = async (): Promise<AxiosResponse<IIProduct[]>> => {
  return await api.get<IIProduct[]>('products/all-products');
};

export const createProduct = async (formData: FormData): Promise<AxiosResponse<IIProduct>> => {
  return await api.post<IIProduct>(
    'products/create-product',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
};

export const createCategory = async (categoryData: { categoryName: string }): Promise<AxiosResponse<ICategory>> => {
  return await api.post<ICategory>(
    'products/create-category',
    categoryData,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const logoutUser = async (): Promise<void> => {
  Cookies.remove('accessToken'); 
  localStorage.removeItem('refreshToken'); 
  localStorage.removeItem('userName'); 
};

export const deleteChoosenProduct = async (productId: number, deleteFlag: string): Promise<AxiosResponse> => {
  return await axios.delete(`${BASE_URL}/${deleteFlag}/${productId}`);
};

export const updateChoosenProduct = async (productId: number, updates: Partial<IIProduct>, updateFlag: string): Promise<AxiosResponse<IIProduct>> => {
  return await axios.put(`${BASE_URL}/${updateFlag}/${productId}`, updates);
};

export default api;
