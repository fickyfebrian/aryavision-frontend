import Typography from '@mui/material/Typography';
import type { TypographyProps } from '@mui/material/Typography';
import { formatNumber } from '@/utils';

export interface SoldDisplayProps extends Omit<TypographyProps, 'children'> {
  soldCount: number;
}

export const SoldDisplay = ({ soldCount, ...props }: SoldDisplayProps) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      {...props}
    >
      Terjual {formatNumber(soldCount)}
    </Typography>
  );
};
