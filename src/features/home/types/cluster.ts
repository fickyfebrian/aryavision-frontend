import type { ProductCluster } from '../../product/types';

export interface ClusterOverviewItem {
  id: string;
  cluster: ProductCluster;
  title: string;
  description: string;
}
