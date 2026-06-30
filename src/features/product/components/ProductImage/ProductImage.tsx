import { useState } from 'react';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { CameraOff } from 'lucide-react';

export interface ProductImageProps extends BoxProps<'div'> {
  src: string;
  alt: string;
}

export const ProductImage = ({ src, alt, ...props }: ProductImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <Box
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gray-100"
      {...props}
    >
      {!isLoaded && !hasError && (
        <Skeleton variant="rectangular" width="100%" height="100%" className="absolute inset-0" />
      )}
      
      {hasError ? (
        <Box className="flex flex-col items-center justify-center p-4 text-gray-400">
          <CameraOff size={32} className="mb-2" />
          <span className="text-sm">No Image</span>
        </Box>
      ) : (
        <Box
          component="img"
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </Box>
  );
};
