'use server';
import axios from 'axios';
import { BASE_URL } from '@/utils/baseUrl';
import { IIProduct, ICategiry } from '@/types';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products/all-products`);
    console.log('response ', response);

    if (response.data && Array.isArray(response.data)) {
      return response.data as IIProduct[];
    }

    console.error('No products field in response');
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Функция для получения категорий
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products/all-categories`);
    console.log('response ', response);

    if (response.data && Array.isArray(response.data)) {
      return response.data as ICategiry[];
    }

    console.error('No categories field in response');
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
