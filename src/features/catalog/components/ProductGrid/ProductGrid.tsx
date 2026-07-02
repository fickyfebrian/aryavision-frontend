import { Grid } from '@mui/material';
import { ProductCard } from '@/features/product';
import type { Product } from '@/features/product';
import { EmptyState } from '@/components/common';

interface ProductGridProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
  onSelectReference?: (product: Product) => void;
  referenceProductId?: string | null;
}

export const ProductGrid = ({ products, onProductClick, onSelectReference, referenceProductId }: ProductGridProps) => {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="Produk Tidak Ditemukan"
        description="Silakan ubah kriteria pencarian atau filter Anda."
      />
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
          <ProductCard 
            product={product} 
            onClick={onProductClick}
            onSelectReference={onSelectReference}
            isReference={product.id === referenceProductId}
          />
        </Grid>
      ))}
    </Grid>
  );
};
