import { Request } from 'express';

interface IOrderDetailsForEmail {
  quantity: number;
  total_price: number;
  userId: number;
  productId: number;
  productName: string;
  productPrice: number;
  images: string[];
}

export interface IUserOrderForEmail {
  orderDetails: IOrderDetailsForEmail;
  userEmail: string;
  name: string;
  images: string[];
  quantity: number;
  total_price: number;
  userId: number;
  productId: number;
  productName: string;
  productPrice: number;
  orders: IOrderDetails[];
}

export interface IUserOrderForEmail {
  userEmail: string;
  name: string;
  orders: IOrderDetailsForEmail[];
}

export interface IOrderDetails {
  quantity: number;
  total_price: number;
  userId: number;
  productId: number;
  productName: string;
  productPrice: number;
  images: string[];
}

export interface IUserOrder {
  quantity: number;
  total_price: number;
  userId: number;
  productId: number;
}

export interface IAddToCartRequest extends Request {
  body: {
    userId: string;
    productId: string;
    quantity: number;
  };
}
