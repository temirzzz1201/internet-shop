'use server'
import axios from "axios";
import { BASE_URL } from "@/utils/baseUrl";
import { IIProducts } from "@/types";

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);

    return response.data as IIProducts || [];
  } catch (error) {
    console.error(error);
  }
}



