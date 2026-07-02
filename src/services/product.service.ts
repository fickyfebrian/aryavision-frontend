import { axiosInstance } from '@/lib/axios';
import type { Product, ProductCluster } from '@/features/product/types';

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

interface BackendProduct {
  id: number;
  product_name: string;
  image_url: string;
  price: number;
  rating: number;
  sold: number;
  description?: string;
  brand?: string;
  category?: string;
}

interface BackendPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

interface BackendPaginatedResponse {
  success: boolean;
  message: string;
  data: {
    items: BackendProduct[];
    pagination: BackendPagination;
  };
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export const productService = {
  getProducts: async (params: GetProductsParams): Promise<PaginatedResponse<Product>['data']> => {
    const response = await axiosInstance.get<BackendPaginatedResponse>('/products', { params });
    const backendData = response.data.data;
    
    const items: Product[] = backendData.items.map(item => {
      let cluster: ProductCluster = 'budget';
      if (item.price >= 1000000) {
        cluster = 'premium';
      } else if (item.price >= 300000) {
        cluster = 'mid-range';
      }
      
      return {
        id: String(item.id),
        name: item.product_name,
        imageUrl: item.image_url,
        price: item.price,
        rating: item.rating || 0,
        soldCount: item.sold || 0,
        description: item.description,
        cluster
      };
    });

    return {
      items,
      total: backendData.pagination.total_items,
      page: backendData.pagination.page,
      limit: backendData.pagination.limit,
      total_pages: backendData.pagination.total_pages
    };
  }
};
