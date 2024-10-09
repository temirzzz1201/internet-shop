import axios from 'axios';
import { AxiosResponse } from 'axios';
import { BASE_URL } from './baseUrl';
import Cookies from 'js-cookie';
import { IUser, IUserResponse, IIProduct, ICategory } from '../types';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshToken = async (): Promise<string> => {
  try {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const response = await api.post<{ accessToken: string }>(
      'users/refresh-token',
      { token: storedRefreshToken }
    );
    const newAccessToken = response.data.accessToken;

    Cookies.set('accessToken', newAccessToken, { secure: true });
    return newAccessToken;
  } catch (error) {
    throw error;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const createProduct = async (formData: FormData): Promise<AxiosResponse<IIProduct>> => {
  const response = await axios.post<IIProduct>(
    `${BASE_URL}/products/create-product`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return response;
};

export const createCategory = async (categoryData: { categoryName: string }): Promise<AxiosResponse<ICategory>> => {
  const response = await axios.post<ICategory>(
    `${BASE_URL}/products/create-category`,
    categoryData,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return response;
};

export const registerUser = async (userData: IUser): Promise<IUserResponse> => {
  const response = await api.post<IUserResponse>('users/register', userData);
  Cookies.set('accessToken', response.data.accessToken, { secure: true });
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response.data;
};

export const fetchCategories = async (): Promise<AxiosResponse<ICategory[]>> => {
  const response = await axios.get<ICategory[]>(
    `${BASE_URL}/products/all-categories`
  );
  return response;
};

export const fetchProducts = async (): Promise<AxiosResponse<IIProduct[]>> => {
  const response = await axios.get<IIProduct[]>(
    `${BASE_URL}/products/all-products`
  );
  return response;
};

export const loginUser = async (userData: IUser): Promise<IUserResponse> => {
  const response = await api.post<IUserResponse>('users/login', userData);
  Cookies.set('accessToken', response.data.accessToken, { secure: true });
  localStorage.setItem('refreshToken', response.data.refreshToken);

  console.log(response.data.user.username);

  localStorage.setItem('userName', response.data.user.username || '');

  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  Cookies.remove('accessToken');
  Cookies.remove('role');

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
