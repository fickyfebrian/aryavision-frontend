import { Box, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import { ProductCard } from '../ProductCard';
import type { Product } from '../../types';
import { RecommendationSkeleton, RecommendationEmpty } from '@/features/recommendation/components';
import { ErrorState } from '@/components/common';

interface RelatedProductsProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onProductClick?: (product: Product) => void;
  onSelectReference?: (product: Product) => void;
}

export const RelatedProducts = ({ 
  products, 
  isLoading,
  error,
  onRetry,
  onProductClick, 
  onSelectReference 
}: RelatedProductsProps) => {
  return (
    <Box sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>
        Rekomendasi Produk
      </Typography>
      {isLoading ? (
        <RecommendationSkeleton />
      ) : error ? (
        <ErrorState 
          title="Gagal Memuat Rekomendasi" 
          description={error} 
          onRetry={onRetry} 
        />
      ) : products.length === 0 ? (
        <RecommendationEmpty />
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <ProductCard 
                product={product} 
                onClick={onProductClick}
                onSelectReference={onSelectReference}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
