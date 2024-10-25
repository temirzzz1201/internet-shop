import { ReactNode } from 'react';

interface Image {
  id: number;
  imageUrl: string;
  productId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IIProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category?: ICategory;
  images?: Image[];
}

export interface IIProductResponse {
  data: {
    message: string;
    product: IIProduct;
  };
  status: number;
  statusText: string;
}

export interface IIProducts {
  products: IIProduct[];
  isLoading: boolean;
  error: string | null;
}

export interface ICategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryMenuProps {
  categories: ICategory[];
}

export interface ICategires {
  category: ICategory[];
  isLoading: boolean;
  error: string | null;
}

export interface IAuthState {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null | Error;
}

export interface IUser {
  id?: number;
  username?: string | null;
  email: string;
  password: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUsersState {
  users: IUser[];
  isLoading: boolean;
  error: string | null | object;
}

export interface IUserResponse {
  role: string;
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IProtectedRoute {
  component: React.ReactElement;
}

export interface IFormValues {
  username?: string;
  role?: string;
  email: string;
  password: string;
}

export interface IFormErrors {
  username?: string;
  email?: string;
  password?: string;
}

export interface ITableColumn {
  label: string;
  key: string;
  format?: (value: any) => string;
}

export interface IAdminTableProps {
  caption: string;
  columns: ITableColumn[];
  data: any[];
  isLoading: boolean;
  deleteFlag: string;
  updateFlag: string;
}

export interface IHomeProps {
  searchParams: {
    category?: string;
  };
}

export interface IModalProps {
  children: ReactNode;
}

export interface IProductCardProps {
  product: IIProduct;
}

export interface IOrder {
  quantity: number;
  total_price: number;
  userId: number;
  productId: number;
}

export interface IOrdersState {
  orders: IOrder[];
  loading: boolean;
  error: string | null;
}
