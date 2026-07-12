import { useQuery } from '@tanstack/react-query';
import { mlApi } from '../api/ml.api';

export const useMLEvaluation = () => {
  return useQuery({
    queryKey: ['mlEvaluation'],
    queryFn: () => mlApi.getEvaluation(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};
