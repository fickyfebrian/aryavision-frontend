import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import type { RatingProps } from '@mui/material/Rating';

export interface RatingDisplayProps extends Omit<RatingProps, 'value' | 'readOnly'> {
  rating: number;
  showValue?: boolean;
}

export const RatingDisplay = ({ rating, showValue = true, ...props }: RatingDisplayProps) => {
  return (
    <Box className="flex items-center gap-1">
      <Rating
        value={rating}
        precision={0.1}
        readOnly
        size="small"
        {...props}
      />
      {showValue && (
        <Typography variant="body2" color="text.secondary">
          ({rating.toFixed(1)})
        </Typography>
      )}
    </Box>
  );
};
