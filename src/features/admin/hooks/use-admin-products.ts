import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productService, type GetProductsParams } from '@/services/product.service';

export const useAdminProducts = (params: GetProductsParams) =>
  useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => productService.getProducts(params),
    placeholderData: keepPreviousData,
  });
