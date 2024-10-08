'use server';
import axios from 'axios';
import { BASE_URL } from '@/utils/baseUrl';
import { IIProduct, ICategiry } from '@/types';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products/all-products`);

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

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products/all-categories`);

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
