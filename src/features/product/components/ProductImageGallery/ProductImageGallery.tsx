import { Box, Stack } from '@mui/material';

interface ProductImageGalleryProps {
  imageUrl: string;
  alt: string;
}

export const ProductImageGallery = ({ imageUrl, alt }: ProductImageGalleryProps) => {
  return (
    <Box>
      <Box sx={{ width: '100%', borderRadius: 3, overflow: 'hidden', mb: 2, border: 1, borderColor: 'divider' }}>
        <Box component="img" src={imageUrl} alt={alt} sx={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '1 / 1', objectFit: 'cover' }} />
      </Box>
      <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} sx={{ width: 80, height: 80, flexShrink: 0, borderRadius: 2, overflow: 'hidden', border: 1, borderColor: i === 1 ? 'primary.main' : 'divider', cursor: 'pointer', opacity: i === 1 ? 1 : 0.6, '&:hover': { opacity: 1 } }}>
            <Box component="img" src={imageUrl} alt={`Thumbnail ${i}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
