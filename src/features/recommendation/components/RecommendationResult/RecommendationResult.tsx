import { Box, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import { ProductCard } from '@/features/product';
import type { Product } from '@/features/product';

interface RecommendationResultProps {
  products: Product[];
}

export const RecommendationResult = ({ products }: RecommendationResultProps) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        Hasil Rekomendasi ({products.length})
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
