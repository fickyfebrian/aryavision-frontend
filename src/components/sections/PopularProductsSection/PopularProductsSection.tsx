import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Section } from '../../ui/Section';
import { AppContainer } from '../../ui/AppContainer';
import { SectionHeader } from '../SectionHeader';
import { POPULAR_PRODUCTS_DATA } from '../../../features/home';
import { ProductCard } from '../../../features/product/components';
import type { Product } from '../../../features/product/types';
import { productService } from '../../../services/product.service';
import { RecommendationResult, RecommendationSkeleton, RecommendationEmpty } from '../../../features/recommendation/components';
import { ErrorState } from '../../common';
import { Grid } from '@mui/material';

const styles = {
  section: {
    bgcolor: 'grey.50',
  },
  gridContainer: {
    display: 'grid',
    gap: 3,
    gridTemplateColumns: {
      xs: 'minmax(0, 1fr)',
      sm: 'repeat(2, minmax(0, 1fr))',
      md: 'repeat(3, minmax(0, 1fr))',
      lg: 'repeat(4, minmax(0, 1fr))',
    },
  },
};

export const PopularProductsSection = () => {
  const navigate = useNavigate();
  
  // Recommendation States
  const [referenceProductId, setReferenceProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isRecLoading, setIsRecLoading] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);

  const handleProductClick = useCallback((product: Product) => {
    navigate(`/product/${product.id}`);
  }, [navigate]);

  const handleSelectReference = useCallback(async (product: Product) => {
    if (referenceProductId === product.id) {
      setReferenceProductId(null);
      setSelectedProduct(null);
      setRecommendations([]);
      return;
    }
    setReferenceProductId(product.id);
    setIsRecLoading(true);
    setRecError(null);
    try {
      const { selectedProduct: apiSelected, recommendations: apiRecs } = await productService.getRecommendations(product.id);
      setSelectedProduct(apiSelected);
      setRecommendations(apiRecs.slice(0, 3));
    } catch {
      setRecError('Gagal memuat rekomendasi. Silakan coba lagi.');
    } finally {
      setIsRecLoading(false);
    }
  }, [referenceProductId]);

  const handleClearReference = useCallback(() => {
    setReferenceProductId(null);
    setSelectedProduct(null);
    setRecommendations([]);
  }, []);

  return (
    <Section sx={styles.section}>
      <AppContainer>
        <SectionHeader 
          title="Produk CCTV Pilihan" 
          subtitle="Berbagai pilihan produk terbaik yang paling sering dicari oleh pengguna kami."
          align="center"
        />

        {/* Recommendation Section */}
        {referenceProductId && (
          <Box sx={{ mb: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Rekomendasi Untuk Anda
              </Typography>
              <Button size="small" color="error" variant="text" onClick={handleClearReference}>
                Bersihkan Acuan
              </Button>
            </Box>

            {selectedProduct && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Produk Acuan
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <ProductCard 
                      product={selectedProduct}
                      onClick={handleProductClick}
                      onSelectReference={handleSelectReference}
                      isReference={true}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {isRecLoading ? (
              <RecommendationSkeleton />
            ) : recError ? (
              <ErrorState 
                title="Gagal Memuat Rekomendasi" 
                description={recError} 
                onRetry={() => handleSelectReference({ id: referenceProductId } as Product)} 
              />
            ) : recommendations.length === 0 ? (
              <RecommendationEmpty />
            ) : (
              <RecommendationResult 
                products={recommendations} 
                onProductClick={handleProductClick}
                onSelectReference={handleSelectReference}
              />
            )}
          </Box>
        )}

        <Box sx={styles.gridContainer}>
          {POPULAR_PRODUCTS_DATA.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={handleProductClick}
              onSelectReference={handleSelectReference}
              isReference={product.id === referenceProductId}
            />
          ))}
        </Box>
      </AppContainer>
    </Section>
  );
};
