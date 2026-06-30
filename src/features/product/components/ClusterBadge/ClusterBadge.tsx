import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';
import type { ProductCluster } from '../../types';

export interface ClusterBadgeProps extends Omit<ChipProps, 'color' | 'label'> {
  cluster: ProductCluster;
}

export const ClusterBadge = ({ cluster, ...props }: ClusterBadgeProps) => {
  const getClusterProps = (): { label: string; color: ChipProps['color'] } => {
    switch (cluster) {
      case 'budget':
        return { label: 'Budget', color: 'success' };
      case 'mid-range':
        return { label: 'Mid Range', color: 'warning' };
      case 'premium':
        return { label: 'Premium', color: 'secondary' };
      default:
        return { label: cluster, color: 'default' };
    }
  };

  const { label, color } = getClusterProps();

  return (
    <Chip
      label={label}
      color={color}
      size="small"
      sx={{ fontWeight: 600 }}
      {...props}
    />
  );
};
