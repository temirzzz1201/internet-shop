'use server';
import axios from 'axios';
import { BASE_URL } from '@/utils/baseUrl';
import { IIProduct } from '@/types';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
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
