import Box from '@mui/material/Box';
import { LoadingSpinner } from '../LoadingSpinner';

export const PageLoader = () => {
  return (
    <Box className="flex flex-1 min-h-[400px] w-full items-center justify-center">
      <LoadingSpinner size={48} />
    </Box>
  );
};
