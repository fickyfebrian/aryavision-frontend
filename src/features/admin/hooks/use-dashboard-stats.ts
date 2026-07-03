import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';

export const useDashboardStats = () =>
  useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => productService.getDashboardStats(),
  });
