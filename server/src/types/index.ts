import { Request, Response } from 'express';

interface IOrderDetailsForEmail {
  quantity: number;
  total_price: number;
  userId: number;
  productId: number;
}

export interface IUserOrderForEmail {
  orderDetails: IOrderDetailsForEmail;
  userEmail: string;
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
