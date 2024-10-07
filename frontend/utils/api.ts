import axios from 'axios';
import { BASE_URL } from './baseUrl';
import Cookies from 'js-cookie';
import { IUser, IUserResponse } from '../types';

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

    Cookies.set('accessToken', newAccessToken);
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

export const registerUser = async (userData: IUser): Promise<IUserResponse> => {
  const response = await api.post<IUserResponse>('users/register', userData);
  Cookies.set('accessToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response.data;
};

export const loginUser = async (userData: IUser): Promise<IUserResponse> => {
  const response = await api.post<IUserResponse>('users/login', userData);
  Cookies.set('accessToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  Cookies.remove('accessToken');
  localStorage.removeItem('refreshToken');
};

export default api;
