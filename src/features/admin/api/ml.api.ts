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

export interface ClusterSummary {
  cluster_id: number | string;
  label: string;
  total_product: number;
  average_price: number;
  min_price: number;
  max_price: number;
  average_rating: number;
  average_sold: number;
}

export interface ProductDataPoint {
  id: number;
  product_name: string;
  price: number;
  rating: number;
  category: string;
  cluster: number;
}

export interface MLClusterSummaryResponse {
  status: string;
  message: string;
  data: {
    clusters: ClusterSummary[];
    products: ProductDataPoint[];
  };
}

export interface MLEvaluationResponse {
  status: string;
  message: string;
  data: {
    recommended_k: number;
    elbow: { k: number; inertia: number }[];
    silhouette: { k: number; score: number }[];
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

  getClusterSummary: async (): Promise<MLClusterSummaryResponse['data']> => {
    const response = await axiosInstance.get<MLClusterSummaryResponse>('/ml/clusters');
    return response.data.data;
  },

  getEvaluation: async (): Promise<MLEvaluationResponse['data']> => {
    const response = await axiosInstance.get<MLEvaluationResponse>('/ml/evaluation');
    return response.data.data;
  }
};
