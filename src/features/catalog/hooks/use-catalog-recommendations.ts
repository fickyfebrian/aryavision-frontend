import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';

export const useCatalogRecommendations = (referenceProductId: string | null) => {
  return useQuery({
    queryKey: ['catalog', 'recommendations', referenceProductId],
    queryFn: async () => {
      if (!referenceProductId) {
        throw new Error("Reference Product ID is required");
      }
      return productService.getRecommendations(referenceProductId);
    },
    enabled: !!referenceProductId,
    staleTime: 10 * 60 * 1000, // 10 minutes (recommendations don't change often)
    retry: 1,
  });
};
