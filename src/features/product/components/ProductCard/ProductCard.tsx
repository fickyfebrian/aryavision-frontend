import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ProductImage } from '../ProductImage';
import { ClusterBadge } from '../ClusterBadge';
import { PriceDisplay } from '../PriceDisplay';
import { RatingDisplay } from '../RatingDisplay';
import { SoldDisplay } from '../SoldDisplay';
import type { Product } from '../../types';

export interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  onSelectReference?: (product: Product) => void;
  isReference?: boolean;
}

import Button from '@mui/material/Button';

export const ProductCard = ({ product, onClick, onSelectReference, isReference }: ProductCardProps) => {
  return (
    <Card 
      className="group flex h-full flex-col transition-all duration-300 hover:shadow-lg"
      sx={{ borderRadius: 2 }}
    >
      <CardActionArea 
        onClick={() => onClick?.(product)}
        className="flex h-full flex-col items-stretch"
        sx={{ flexGrow: 1 }}
      >
        <Box sx={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
          {/* Aspect ratio 1:1 container */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <ProductImage src={product.imageUrl} alt={product.name} />
          </Box>
          <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
            <ClusterBadge cluster={product.cluster} />
          </Box>
        </Box>
        
        <CardContent className="flex flex-1 flex-col gap-1">
          <Typography 
            variant="body1" 
            className="line-clamp-2 min-h-[3rem] font-medium" 
            title={product.name}
          >
            {product.name}
          </Typography>
          
          <Box className="mt-1">
            <PriceDisplay price={product.price} />
          </Box>
          
          <Box className="mt-auto flex items-center justify-between pt-2">
            <RatingDisplay rating={product.rating} />
            <SoldDisplay soldCount={product.soldCount} />
          </Box>
        </CardContent>
      </CardActionArea>
      <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
        <Button 
          variant="outlined" 
          size="small" 
          fullWidth
          onClick={(e) => { e.stopPropagation(); onClick?.(product); }}
        >
          Detail
        </Button>
        <Button 
          variant={isReference ? "outlined" : "contained"}
          color={isReference ? "error" : "primary"}
          size="small" 
          fullWidth
          onClick={(e) => { e.stopPropagation(); onSelectReference?.(product); }}
        >
          {isReference ? "Hapus Acuan" : "Acuan"}
        </Button>
      </Box>
    </Card>
  );
};
