// import axios from 'axios';
// import { BASE_URL } from './baseUrl';
// import Cookies from 'js-cookie';
// import { IUser, IUserResponse } from '../types';

// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Регистрация пользователя
// export const registerUser = async (userData: IUser): Promise<IUserResponse> => {
//   const response = await api.post<IUserResponse>('users/register', userData);
//   Cookies.set('accessToken', response.data.token);
//   return response.data;
// };

// // Вход пользователя
// export const loginUser = async (userData: IUser): Promise<IUserResponse> => {
//   const response = await api.post<IUserResponse>('users/login', userData);
//   console.log(response);

//   Cookies.set('accessToken', response.data.token);
//   return response.data;
// };

// // Выход пользователя
// export const logoutUser = async (): Promise<void> => {
//   const token = localStorage.getItem('refreshToken');
//   await api.post<{ message: string }>('users/logout', { token });
//   Cookies.remove('accessToken');
//   localStorage.removeItem('refreshToken');
// };

// export default api;








// import axios from 'axios';
// import { BASE_URL } from './baseUrl';
// import Cookies from 'js-cookie';
// import { IUser, IUserResponse } from '../types';

// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Метод для обновления токена
// const refreshToken = async (): Promise<string> => {
//   try {
//     const refreshToken = localStorage.getItem('refreshToken');
//     const response = await api.post<{ accessToken: string }>('users/refresh-token', { token: refreshToken });

//     console.log(response);


//     // Обновляем access token
//     const newAccessToken = response.data.accessToken;
//     Cookies.set('accessToken', newAccessToken);
//     return newAccessToken;
//   } catch (error) {
//     console.error('Error refreshing token:', error);
//     throw error;
//   }
// };

// // Добавляем interceptor для обработки устаревших токенов
// api.interceptors.response.use(
//   (response) => response,  // Если запрос успешен, просто возвращаем его
//   async (error) => {
//     const originalRequest = error.config;

//     // Если ошибка 401 (Unauthorized) и это не запрос на обновление токена
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;  // Отмечаем, что повторный запрос не отправлялся

//       try {
//         // Обновляем токен
//         const newAccessToken = await refreshToken();

//         // Обновляем заголовок с новым токеном
//         originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

//         // Повторяем оригинальный запрос с новым токеном
//         return api(originalRequest);
//       } catch (err) {
//         // Если обновление токена не удалось, редирект на страницу входа
//         window.location.href = '/login';
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);  // Если это другая ошибка, просто возвращаем её
//   }
// );

// // Регистрация пользователя
// export const registerUser = async (userData: IUser): Promise<IUserResponse> => {
//   const response = await api.post<IUserResponse>('users/register', userData);
//   Cookies.set('accessToken', response.data.accessToken);
//   localStorage.setItem('refreshToken', response.data.refreshToken);  // Сохраняем refresh token
//   return response.data;
// };

// // Вход пользователя
// export const loginUser = async (userData: IUser): Promise<IUserResponse> => {
//   const response = await api.post<IUserResponse>('users/login', userData);
//   Cookies.set('accessToken', response.data.accessToken);
//   localStorage.setItem('refreshToken', response.data.refreshToken);  // Сохраняем refresh token
//   console.log('loginUser ', response);

//   return response.data;
// };

// // Выход пользователя
// export const logoutUser = async (): Promise<void> => {
//   const token = localStorage.getItem('refreshToken');
//   await api.post<{ message: string }>('users/logout', { token });
//   Cookies.remove('accessToken');
//   localStorage.removeItem('refreshToken');
// };

// export default api;






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

// Обновление accessToken
const refreshToken = async (): Promise<string> => {
  try {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const response = await api.post<{ accessToken: string }>('users/refresh-token', { token: storedRefreshToken });
    const newAccessToken = response.data.accessToken;

    Cookies.set('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    throw error;
  }
};

// Interceptor для обработки истечения токенов
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

// Регистрация пользователя
export const registerUser = async (userData: IUser): Promise<IUserResponse> => {
  const response = await api.post<IUserResponse>('users/register', userData);
  Cookies.set('accessToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response.data;
};

// Вход пользователя
export const loginUser = async (userData: IUser): Promise<IUserResponse> => {
  const response = await api.post<IUserResponse>('users/login', userData);
  Cookies.set('accessToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response.data;
};

// Выход пользователя
export const logoutUser = async (): Promise<void> => {
  const refreshToken = localStorage.getItem('refreshToken');
  await api.post('users/logout', { token: refreshToken });
  Cookies.remove('accessToken');
  localStorage.removeItem('refreshToken');
};

export default api;
