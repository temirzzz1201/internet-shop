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