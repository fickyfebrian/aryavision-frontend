import { Box, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import { ProductCard } from '../ProductCard';
import type { Product } from '../../types';

interface RelatedProductsProps {
  products: Product[];
}

export const RelatedProducts = ({ products }: RelatedProductsProps) => {
  return (
    <Box sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>
        Rekomendasi Serupa
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
