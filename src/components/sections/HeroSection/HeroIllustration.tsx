import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export const HeroIllustration = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: { xs: 300, md: 450 },
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: 3,
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        sx={{ position: 'absolute', inset: 0 }}
      />
    </Box>
  );
};
