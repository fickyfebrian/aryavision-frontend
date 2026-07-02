import { Box, Paper } from '@mui/material';
import { Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '@/services/product.service';
import type { Product } from '@/features/product/types';
import { ErrorState, EmptyState } from '@/components/common';
import { PageLoader } from '@/components/ui';
import { ProductImageGallery } from '../ProductImageGallery';
import { ProductInfo } from '../ProductInfo';
import { ProductSpecs } from '../ProductSpecs';
import { ProductDescription } from '../ProductDescription';
import { RelatedProducts } from '../RelatedProducts';
import { PrimaryButton, SecondaryButton } from '@/components/ui';
import { Section, AppContainer } from '@/components/ui';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isRelatedLoading, setIsRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState<string | null>(null);

  const fetchRelatedProducts = async (productId: string) => {
    setIsRelatedLoading(true);
    setRelatedError(null);
    try {
      const { recommendations: apiRecs } = await productService.getRecommendations(productId);
      setRelatedProducts(apiRecs.slice(0, 3));
    } catch {
      setRelatedError('Gagal memuat rekomendasi produk.');
    } finally {
      setIsRelatedLoading(false);
    }
  };

  const handleViewRecommendation = (targetProduct?: Product) => {
    const prod = targetProduct || product;
    if (prod) {
      navigate('/catalog', { state: { referenceProductId: prod.id } });
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
        // Fetch recommendations directly after
        await fetchRelatedProducts(id);
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err) {
          const responseErr = err as { response?: { status?: number } };
          if (responseErr.response?.status === 404) {
            setProduct(null);
            return;
          }
        }
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data produk.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <Box sx={{ pt: 10, pb: 10 }}>
        <ErrorState 
          description={error} 
          onRetry={() => window.location.reload()} 
        />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ pt: 10, pb: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <EmptyState 
          title="Produk Tidak Ditemukan"
          description="Produk yang Anda cari tidak tersedia atau telah dihapus."
        />
        <SecondaryButton onClick={() => navigate('/catalog')}>
          Kembali ke Katalog
        </SecondaryButton>
      </Box>
    );
  }

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
                <PrimaryButton startIcon={<ShoppingBagIcon />} sx={{ minWidth: 200 }} onClick={() => handleViewRecommendation()}>
                  Lihat Rekomendasi
                </PrimaryButton>
                <SecondaryButton startIcon={<ArrowBackIcon />} onClick={() => navigate('/catalog')}>
                  Kembali ke Katalog
                </SecondaryButton>
              </Box>

              <ProductSpecs specs={[
                ...(product.brand ? [{ label: 'Brand', value: product.brand }] : []),
                ...(product.category ? [{ label: 'Kategori', value: product.category }] : []),
              ]} />
              <ProductDescription description={product.description} />
            </Grid>
          </Grid>
          
          <RelatedProducts 
            products={relatedProducts} 
            isLoading={isRelatedLoading}
            error={relatedError}
            onRetry={() => id && fetchRelatedProducts(id)}
            onProductClick={(p) => navigate(`/product/${p.id}`)}
            onSelectReference={(p) => handleViewRecommendation(p)}
          />
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
        <SecondaryButton sx={{ minWidth: 0, px: 2 }} onClick={() => navigate('/catalog')}>
          <ArrowBackIcon />
        </SecondaryButton>
        <PrimaryButton fullWidth startIcon={<ShoppingBagIcon />} onClick={() => handleViewRecommendation()}>
          Lihat Rekomendasi
        </PrimaryButton>
      </Paper>
    </Box>
  );
};
