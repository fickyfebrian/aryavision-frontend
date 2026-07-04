import { axiosInstance } from '@/lib/axios';

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
  retrainClustering: async (): Promise<MLClusteringResponse> => {
    const response = await axiosInstance.get('/ml/clustering');
    return response.data;
  },

  retrainCBF: async (): Promise<MLCBFResponse> => {
    const response = await axiosInstance.get('/ml/cbf/test');
    return response.data;
  },
};
