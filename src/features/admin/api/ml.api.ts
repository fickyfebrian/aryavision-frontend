import { axiosInstance } from '@/lib/axios';

export interface MLStatusResponse {
  status: string;
  message: string;
  data: {
    needs_retrain: boolean;
    last_trained_at: string | null;
    last_dataset_update: string | null;
    model_status: string;
    model_version: number;
  };
}

export interface MLClusteringResponse {
  status: string;
  message: string;
  data: {
    total_product_processed: number;
    total_clusters: number;
    distribution: Record<string, number>;
    preprocessing_stats: any;
  };
}

export interface MLCBFResponse {
  status: string;
  message: string;
  data: {
    total_products: number;
    similarity_shape: number[];
  };
}

export const mlApi = {
  getStatus: async (): Promise<MLStatusResponse> => {
    const response = await axiosInstance.get('/ml/status');
    return response.data;
  },

  retrainClustering: async (): Promise<MLClusteringResponse> => {
    const response = await axiosInstance.get('/ml/clustering');
    return response.data;
  },

  retrainCBF: async (): Promise<MLCBFResponse> => {
    const response = await axiosInstance.get('/ml/cbf/test');
    return response.data;
  },
};
