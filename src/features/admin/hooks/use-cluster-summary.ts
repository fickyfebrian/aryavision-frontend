import { useQuery } from '@tanstack/react-query';
import { mlApi } from '../api/ml.api';

export const useClusterSummary = () => {
  return useQuery({
    queryKey: ['clusterSummary'],
    queryFn: () => mlApi.getClusterSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if 404
  });
};
