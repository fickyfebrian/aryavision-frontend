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
  product_url?: string;
  cluster?: number | string;
  updated_at?: string;
  similarity_score?: number;
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

export interface DashboardStats {
  total_products: number;
  total_brands: number;
  budget_cluster: number;
  mid_range_cluster: number;
  premium_cluster: number;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  cluster?: number;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  max_rating?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

    export const getFullImageUrl = (url: string | undefined | null) => {
      if (!url) return 'https://images.unsplash.com/photo-1557825835-b453e020e980?w=500&q=80';
      if (url.startsWith('/uploads')) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        const serverUrl = baseUrl.replace(/\/api\/?$/, '');
        return `${serverUrl}${url}`;
      }
      return url;
    };

export const productService = {
  _mapBackendProductToFrontend: (item: BackendProduct): Product => {
    let cluster: ProductCluster = 'budget';
    if (item.cluster === 1 || item.cluster === 'Mid Range') {
      cluster = 'mid-range';
    } else if (item.cluster === 2 || item.cluster === 'Premium') {
      cluster = 'premium';
    } else if (item.cluster === 0 || item.cluster === 'Budget') {
      cluster = 'budget';
    }
    
    return {
      id: String(item.id),
      name: item.product_name,
      imageUrl: getFullImageUrl(item.image_url),
      price: item.price,
      rating: item.rating || 0,
      soldCount: item.sold || 0,
      description: item.description,
      cluster,
      brand: item.brand,
      category: item.category,
      productUrl: item.product_url,
      updatedAt: item.updated_at,
      similarityScore: item.similarity_score
    };
  },

  getProducts: async (params: GetProductsParams): Promise<PaginatedResponse<Product>['data']> => {
    const response = await axiosInstance.get<BackendPaginatedResponse>('/products', { params });
    const backendData = response.data.data;
    const items: Product[] = backendData.items.map(productService._mapBackendProductToFrontend);

    return {
      items,
      total: backendData.pagination.total_items,
      page: backendData.pagination.page,
      limit: backendData.pagination.limit,
      total_pages: backendData.pagination.total_pages
    };
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await axiosInstance.get<{ success: boolean; message: string; data: BackendProduct }>(`/products/${id}`);
    return productService._mapBackendProductToFrontend(response.data.data);
  },

  getRecommendations: async (productId: string, limit: number = 4): Promise<{ selectedProduct: Product, recommendations: Product[] }> => {
    const response = await axiosInstance.get<{ 
      success: boolean; 
      message: string; 
      data: {
        selected_product: BackendProduct;
        recommendations: BackendProduct[];
      }
    }>(`/recommendations/${productId}`, { params: { limit } });
    
    return {
      selectedProduct: productService._mapBackendProductToFrontend(response.data.data.selected_product),
      recommendations: response.data.data.recommendations.map(productService._mapBackendProductToFrontend)
    };
  },


  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get<{ success: boolean; message: string; data: DashboardStats }>('/dashboard/stats');
    return response.data.data;
  },

  // CMS Endpoints
  createProduct: async (data: Partial<BackendProduct>) => {
    const response = await axiosInstance.post('/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<BackendProduct>) => {
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.post('/products/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.image_url;
  }
};
