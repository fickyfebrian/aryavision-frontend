import { Box, Paper } from '@mui/material';
import { Grid } from '@mui/material';
import { ProductImageGallery } from '../ProductImageGallery';
import { ProductInfo } from '../ProductInfo';
import { ProductSpecs } from '../ProductSpecs';
import { ProductDescription } from '../ProductDescription';
import { RelatedProducts } from '../RelatedProducts';
import { PrimaryButton, SecondaryButton } from '@/components/ui';
import { Section, AppContainer } from '@/components/ui';
import { POPULAR_PRODUCTS_DATA } from '@/features/home/data';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const ProductDetailPage = () => {
  // Using dummy product for presentational purposes
  const product = POPULAR_PRODUCTS_DATA[0];
  const relatedProducts = POPULAR_PRODUCTS_DATA.slice(1, 5);

  return (
    <Box sx={{ pb: { xs: 10, md: 0 } }}>
      <Section sx={{ py: { xs: 4, md: 6 } }}>
        <AppContainer>
          <Grid container spacing={6}>
            {/* Left Column: Image Gallery */}
            <Grid size={{ xs: 12, md: 5 }}>
              <ProductImageGallery imageUrl={product.imageUrl} alt={product.name} />
            </Grid>
            
            {/* Right Column: Info, Specs, Actions */}
            <Grid size={{ xs: 12, md: 7 }}>
              <ProductInfo 
                name={product.name} 
                price={product.price} 
                rating={product.rating} 
                soldCount={product.soldCount} 
                cluster={product.cluster} 
              />
              
              {/* Desktop Actions */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, mb: 5 }}>
                <PrimaryButton startIcon={<ShoppingBagIcon />} sx={{ minWidth: 200 }}>
                  Lihat Rekomendasi
                </PrimaryButton>
                <SecondaryButton startIcon={<ArrowBackIcon />}>
                  Kembali ke Katalog
                </SecondaryButton>
              </Box>

              <ProductSpecs />
              <ProductDescription />
            </Grid>
          </Grid>
          
          <RelatedProducts products={relatedProducts} />
        </AppContainer>
      </Section>

      {/* Mobile Sticky Action Bar */}
      <Paper 
        elevation={4} 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          p: 2, 
          display: { xs: 'flex', md: 'none' }, 
          gap: 2,
          zIndex: 1000,
          borderRadius: '16px 16px 0 0'
        }}
      >
        <SecondaryButton sx={{ minWidth: 0, px: 2 }}>
          <ArrowBackIcon />
        </SecondaryButton>
        <PrimaryButton fullWidth startIcon={<ShoppingBagIcon />}>
          Rekomendasi Serupa
        </PrimaryButton>
      </Paper>
    </Box>
  );
};
