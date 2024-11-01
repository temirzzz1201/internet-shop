'use server';
import axios from 'axios';
import { BASE_URL } from '@/utils/baseUrl';
import { IIProduct, ICategory } from '@/types';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

export const fetchAllProducts = async ({ page = 1, limit = 30 } = {}) => {
  try {
    const response = await axiosInstance.get('/products/all-products', {
      params: { page, limit },
    });

    if (
      Array.isArray(response.data.products) &&
      typeof response.data.totalPages === 'number'
    ) {
      return {
        products: response.data.products as IIProduct[],
        totalPages: response.data.totalPages,
      };
    }

    console.error('Unexpected response format for products:', response.data);
    throw new Error('Неверный формат ответа при получении продуктов');
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching products:', error.message);
    } else if (error instanceof Error) {
      console.error('Error fetching products:', error.message);
    } else {
      console.error('Unexpected error fetching products:', error);
    }
    throw new Error('Ошибка при получении продуктов');
  }
};


// export const fetchOneProducts = async (id: string) => {
//   try {
//     const response = await axiosInstance.get(`/products/find-one`, {
//       params: { id },
//     });

//     if (response) return response.data

//   } catch (error: unknown) {
//     console.error(`Ошибка получения продукта: ${error}`);
//   }
// };

export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get('/products/all-categories');

    if (Array.isArray(response.data)) {
      return response.data as ICategory[];
    }

    console.error('Unexpected response format for categories:', response.data);
    return [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching categories:', error.message);
    } else if (error instanceof Error) {
      console.error('Error fetching categories:', error.message);
    } else {
      console.error('Unexpected error fetching categories:', error);
    }
    return [];
  }
};
