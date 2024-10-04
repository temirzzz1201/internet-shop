export interface IIProduct {
  id: string
  name: string
  description: string
  price: number | null
  stock: number | null
  imageUrl: string,
  createdAt: string
  updatedAt: string
}

export interface IIProducts {
  products: IIProduct[];
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
  id?: number
  username?: string | null
  email: string
  password: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

export interface IUserResponse {
  accessToken: string;
  refreshToken: string
  user: IUser;
}

export interface IProtectedRoute {
  // onlyUnAuth?: boolean;
  component: React.ReactElement;
}