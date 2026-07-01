import { Box } from '@mui/material';
import { Grid } from '@mui/material';
import { ProductCardSkeleton } from '@/features/product';

export const RecommendationSkeleton = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {Array.from(new Array(4)).map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <ProductCardSkeleton />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
