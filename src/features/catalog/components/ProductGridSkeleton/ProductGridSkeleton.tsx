import { Grid } from '@mui/material';
import { ProductCardSkeleton } from '@/features/product';

interface ProductGridSkeletonProps {
  count?: number;
}

export const ProductGridSkeleton = ({ count = 8 }: ProductGridSkeletonProps) => {
  return (
    <Grid container spacing={3}>
      {Array.from(new Array(count)).map((_, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
          <ProductCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};
