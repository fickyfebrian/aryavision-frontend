import Typography from '@mui/material/Typography';
import type { TypographyProps } from '@mui/material/Typography';
import { formatCurrency } from '@/utils';

export interface PriceDisplayProps extends Omit<TypographyProps, 'children'> {
  price: number;
}

export const PriceDisplay = ({ price, ...props }: PriceDisplayProps) => {
  return (
    <Typography
      variant="h6"
      color="primary.main"
      sx={{ fontWeight: 700 }}
      {...props}
    >
      {formatCurrency(price)}
    </Typography>
  );
};
