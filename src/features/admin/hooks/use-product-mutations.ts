import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof productService.createProduct>[0]) =>
      productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      // Invalidate ML status agar topbar langsung mendeteksi needs_retrain = true
      queryClient.invalidateQueries({ queryKey: ['ml', 'status'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof productService.updateProduct>[1] }) =>
      productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      // Invalidate ML status agar topbar langsung mendeteksi needs_retrain = true
      queryClient.invalidateQueries({ queryKey: ['ml', 'status'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      // Invalidate ML status agar topbar langsung mendeteksi needs_retrain = true
      queryClient.invalidateQueries({ queryKey: ['ml', 'status'] });
    },
  });
};
