import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export const ProductCardSkeleton = () => {
  return (
    <Card className="flex h-full flex-col" sx={{ borderRadius: 2 }}>
      {/* Image Skeleton */}
      <Skeleton variant="rectangular" sx={{ width: '100%', paddingTop: '100%' }} />
      
      <CardContent className="flex flex-col gap-2">
        {/* Title Skeleton (2 lines) */}
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="70%" height={24} />
        
        {/* Price Skeleton */}
        <Box className="mt-2">
          <Skeleton variant="text" width="50%" height={32} />
        </Box>
        
        {/* Footer Skeleton */}
        <Box className="mt-4 flex items-center justify-between">
          <Skeleton variant="rectangular" width={70} height={20} />
          <Skeleton variant="text" width={60} height={20} />
        </Box>
      </CardContent>
    </Card>
  );
};
