import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MLClusteringResponse, MLCBFResponse } from '../api/ml.api';

import { mlApi } from '../api/ml.api';

export interface RetrainResult {
  clustering: MLClusteringResponse;
  cbf: MLCBFResponse;
  durationMs: number;
}

export const useMLStatus = () => {
  return useQuery({
    queryKey: ['ml', 'status'],
    queryFn: mlApi.getStatus,
    refetchInterval: 30000, // Polling setiap 30 detik untuk berjaga-jaga
  });
};

export const useRetrainModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (onStepChange?: (step: 'clustering' | 'cbf') => void): Promise<RetrainResult> => {
      const startTime = performance.now();
      
      // Step 1: K-Means Clustering
      if (onStepChange) onStepChange('clustering');
      const clusteringResult = await mlApi.retrainClustering();

      // Step 2: Content-Based Filtering
      if (onStepChange) onStepChange('cbf');
      const cbfResult = await mlApi.retrainCBF();

      const endTime = performance.now();
      const durationMs = Math.round(endTime - startTime);

      return {
        clustering: clusteringResult,
        cbf: cbfResult,
        durationMs,
      };
    },
    onSuccess: () => {
      // Invalidate relevant query keys
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['ml', 'status'] });
    },
  });
};
