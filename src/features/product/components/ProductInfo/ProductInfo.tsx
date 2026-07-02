import { Box, Typography, Stack, Divider } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { ClusterBadge } from '../ClusterBadge';
import { PriceDisplay } from '../PriceDisplay';

interface ProductInfoProps {
  name: string;
  price: number;
  rating: number;
  soldCount?: number;
  cluster: 'budget' | 'mid-range' | 'premium';
}

export const ProductInfo = ({ name, price, rating, soldCount, cluster }: ProductInfoProps) => {
  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
        {name}
      </Typography>
      
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <StarIcon sx={{ color: 'warning.main', fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{rating}</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Terjual {soldCount || 0}+
        </Typography>
        <ClusterBadge cluster={cluster} />
      </Stack>
      
      <Box sx={{ mb: 3 }}>
        <PriceDisplay price={price} variant="h4" />
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        CCTV berkualitas tinggi dengan fitur canggih yang cocok untuk kebutuhan keamanan Anda. Memberikan gambar yang jelas siang dan malam.
      </Typography>
    </Box>
  );
};
