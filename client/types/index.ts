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
  images: { imageUrl: string }[];
}

interface IProductImage {
  imageUrl: string;
}

export interface IOrder {
  id: number;
  userId: number;
  createdAt: string;
  total_price: number;
  quantity: number;
  productId: number;
  Product: IIProduct | null;
  description: string;
}

export interface IBusketProduct {
  id: number;
  product: IIProduct;
  quantity: number;
  setTotalQuantityInBusket?: number;
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
  currentProduct: IIProduct | null;
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
  isARegistrated: boolean;
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
  message: string;
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
  selectedCategory?: string;
}

export interface IOrdersState {
  orders: IOrder[];
  loading: boolean;
  error: string | null;
}

export interface ICartItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface ICart {
  id: number;
  userId: string;
  items: ICartItem[];
  totalAmount: number;
  quantity: number;
}

export interface IContainerProps {
  title?: string;
  children: ReactNode;
  myClass: string;
}

export interface AppModalProps extends IModalProps {
  modalSize: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export interface ICartSummaryProps {
  totalQuantity: number;
  totalPrice: number;
  onOrder: () => void;
  onClear: () => void;
}

export interface ResetPasswordError {
  message: string;
}

export interface ICartQuantityResponse {
  totalQuantity: number;
}

export interface ICartItem {
  id: number;
  quantity: number;
  product: IIProduct;
}
