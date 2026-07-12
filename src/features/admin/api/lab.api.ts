import { axiosInstance } from '@/lib/axios';

export interface ProcessDatasetResponse {
  success: boolean;
  message: string;
  data: {
    stats: {
      total_before: number;
      duplicate_removed: number;
      price_removed: number;
      rating_removed: number;
      sold_removed: number;
      total_after: number;
    };
    bounds: {
      price: { min: number; max: number };
      rating: { min: number; max: number };
      sales: { min: number; max: number };
    };
    clusters: {
      cluster_id: number;
      label: string;
      total_product: number;
      average_price: number;
      min_price: number;
      max_price: number;
      average_rating: number;
      average_sold: number;
    }[];
    raw_products: {
      id: number | string;
      product_name: string;
      price: number | null;
      rating: number | null;
      sold: number | null;
      category: string;
    }[];
    cleaned_products: {
      id: number;
      product_name: string;
      price: number;
      rating: number;
      sold: number;
      category: string;
      cluster: number;
    }[];
    normalized_products: {
      id: number;
      product_name: string;
      priceNorm: number;
      ratingNorm: number;
      salesNorm: number;
    }[];
    evaluation?: {
      recommended_k: number;
      elbow: { k: number; inertia: number }[];
      silhouette: { k: number; score: number }[];
    };
  };
}

export interface CBFCalcPayload {
  target: {
    price: number;
    rating: number;
    sold: number;
  };
  alt: {
    price: number;
    rating: number;
    sold: number;
  };
  bounds: {
    price: { min: number; max: number };
    rating: { min: number; max: number };
    sales: { min: number; max: number };
  };
}

export interface CBFCalcResponse {
  success: boolean;
  data: {
    target_norm: number[];
    alt_norm: number[];
    dot_product: number;
    magnitude_target: number;
    magnitude_alt: number;
    similarity: number;
  };
}

export const labApi = {
  processDataset: async (file: File): Promise<ProcessDatasetResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.post<ProcessDatasetResponse>('/lab/process-dataset', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  calculateCBF: async (payload: CBFCalcPayload): Promise<CBFCalcResponse> => {
    const response = await axiosInstance.post<CBFCalcResponse>('/lab/cbf-calc', payload);
    return response.data;
  }
};
