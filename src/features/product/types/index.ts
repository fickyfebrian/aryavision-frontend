export type ProductCluster = 'budget' | 'mid-range' | 'premium';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  rating: number;
  soldCount: number;
  cluster: ProductCluster;
}

export interface RecommendationProduct extends Product {
  matchScore: number;
}
