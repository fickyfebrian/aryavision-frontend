import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productService } from '@/services/product.service';

interface UseCatalogProductsParams {
  page: number;
  limit: number;
  search?: string;
  cluster?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxRating?: number;
  sortParam: string;
}

export const useCatalogProducts = (params: UseCatalogProductsParams) => {
  return useQuery({
    queryKey: ['catalog', 'products', params],
    queryFn: async () => {
      const [sort, order] = params.sortParam.split('-');
      return productService.getProducts({
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        cluster: params.cluster,
        min_price: params.minPrice,
        max_price: params.maxPrice,
        min_rating: params.minRating,
        max_rating: params.maxRating,
        sort,
        order: order as 'asc' | 'desc',
      });
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once on failure to not hang too long on bad network
  });
};
