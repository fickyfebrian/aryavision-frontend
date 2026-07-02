import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Pagination,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { AppContainer, SearchInput } from '@/components/ui';
import { EmptyState, ErrorState } from '@/components/common';
import { ProductGrid } from '../ProductGrid';
import { ProductCard } from '@/features/product';
import { ProductGridSkeleton } from '../ProductGridSkeleton';
import { RecommendationResult, RecommendationSkeleton, RecommendationEmpty } from '@/features/recommendation/components';
import { useNavigate, useLocation } from 'react-router-dom';
import { productService } from '@/services/product.service';
import type { Product } from '@/features/product/types';

const SESSION_KEY = 'aryavision_recommendation_state';

const getSavedState = () => {
  const saved = sessionStorage.getItem(SESSION_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

export const CatalogPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // API States
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination & Filter States
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [sortParam, setSortParam] = useState('created_at-desc');
  const [cluster, setCluster] = useState('');
  const [budget, setBudget] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  // Recommendation States
  const [referenceProductId, setReferenceProductId] = useState<string | null>(() => getSavedState()?.referenceProductId || null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => getSavedState()?.selectedProduct || null);
  const [recommendations, setRecommendations] = useState<Product[]>(() => getSavedState()?.recommendations || []);
  const [isRecLoading, setIsRecLoading] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sort, order] = sortParam.split('-');
      
      // Parse Budget
      let min_price: number | undefined = undefined;
      let max_price: number | undefined = undefined;
      if (budget === '<200k') {
        min_price = 0;
        max_price = 200000;
      } else if (budget === '200k-500k') {
        min_price = 200000;
        max_price = 500000;
      } else if (budget === '500k-1m') {
        min_price = 500000;
        max_price = 1000000;
      } else if (budget === '>1m') {
        min_price = 1000000;
      }

      // Parse Cluster
      let clusterId: number | undefined = undefined;
      if (cluster === 'budget') clusterId = 0;
      if (cluster === 'mid-range') clusterId = 1;
      if (cluster === 'premium') clusterId = 2;

      let min_rating: number | undefined = undefined;
      let max_rating: number | undefined = undefined;
      if (ratingFilter) {
        min_rating = Number(ratingFilter);
        if (min_rating === 1) max_rating = 2;
        if (min_rating === 2) max_rating = 3;
        if (min_rating === 3) max_rating = 4;
        if (min_rating === 4) max_rating = 5;
        if (min_rating === 5) max_rating = 5;
      }

      const data = await productService.getProducts({
        page,
        limit,
        search: search || undefined,
        cluster: clusterId,
        min_price,
        max_price,
        min_rating,
        max_rating,
        sort,
        order: order as 'asc' | 'desc'
      });
      setProducts(data.items);
      setTotalPages(data.total_pages);
      setTotalItems(data.total);
    } catch {
      setError('Terjadi kesalahan saat memuat katalog produk. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, sortParam, cluster, budget, ratingFilter]);


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilter = () => {
    setSearch('');
    setCluster('');
    setBudget('');
    setRatingFilter('');
    setSortParam('created_at-desc');
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };
  
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = useCallback((product: Product) => {
    navigate(`/product/${product.id}`);
  }, [navigate]);

  const handleClearReference = useCallback(() => {
    setReferenceProductId(null);
    setSelectedProduct(null);
    setRecommendations([]);
    sessionStorage.removeItem(SESSION_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectReference = useCallback(async (product: Product) => {
    if (referenceProductId === product.id) {
      handleClearReference();
      return;
    }
    setReferenceProductId(product.id);
    setIsRecLoading(true);
    setRecError(null);
    try {
      const { selectedProduct: apiSelected, recommendations: apiRecs } = await productService.getRecommendations(product.id);
      const newRecs = apiRecs.slice(0, 3);
      setSelectedProduct(apiSelected);
      setRecommendations(newRecs);
      
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        referenceProductId: product.id,
        selectedProduct: apiSelected,
        recommendations: newRecs
      }));
    } catch {
      setRecError('Gagal memuat rekomendasi. Silakan coba lagi.');
    } finally {
      setIsRecLoading(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [referenceProductId, handleClearReference]);

  useEffect(() => {
    const stateRefId = location.state?.referenceProductId;
    if (stateRefId) {
      navigate(location.pathname, { replace: true, state: {} });
      if (referenceProductId !== stateRefId) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        handleSelectReference({ id: stateRefId } as Product);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.referenceProductId]);

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <AppContainer>
        {/* Header Area */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }} gutterBottom>
            Katalog CCTV
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Temukan berbagai pilihan CCTV terbaik sesuai dengan kebutuhan dan anggaran Anda.
          </Typography>

          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ alignItems: { xs: 'stretch', lg: 'center' } }}>
            <Box sx={{ flexGrow: 1 }}>
              <SearchInput 
                placeholder="Cari CCTV..." 
                value={search}
                onChange={handleSearch}
                onClear={() => handleSearch('')}
              />
            </Box>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexShrink: 0 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Cluster</InputLabel>
                <Select value={cluster} label="Cluster" onChange={(e) => { setCluster(e.target.value as string); setPage(1); }}>
                  <MenuItem value="">Semua</MenuItem>
                  <MenuItem value="budget">Budget</MenuItem>
                  <MenuItem value="mid-range">Mid-Range</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Budget/Harga</InputLabel>
                <Select value={budget} label="Budget/Harga" onChange={(e) => { setBudget(e.target.value as string); setPage(1); }}>
                  <MenuItem value="">Semua</MenuItem>
                  <MenuItem value="<500k">&lt; Rp 500.000</MenuItem>
                  <MenuItem value="500k-1m">Rp 500rb - 1Jt</MenuItem>
                  <MenuItem value=">1m">&gt; Rp 1.000.000</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Rating</InputLabel>
                <Select value={ratingFilter} label="Rating" onChange={(e) => { setRatingFilter(e.target.value as string); setPage(1); }}>
                  <MenuItem value="">Semua Rating</MenuItem>
                  <MenuItem value="5">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>⭐ 5+</Box>
                  </MenuItem>
                  <MenuItem value="4">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>⭐ 4+</Box>
                  </MenuItem>
                  <MenuItem value="3">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>⭐ 3+</Box>
                  </MenuItem>
                  <MenuItem value="2">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>⭐ 2+</Box>
                  </MenuItem>
                  <MenuItem value="1">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>⭐ 1+</Box>
                  </MenuItem>
                </Select>
              </FormControl>
              
              <Button variant="outlined" onClick={handleResetFilter} sx={{ height: 40, whiteSpace: 'nowrap' }}>
                Reset Filter
              </Button>
            </Stack>
          </Stack>
        </Box>

                {/* Recommendation Section */}
        {referenceProductId && (
          <Box sx={{ mb: 6, p: 3, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
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
        {/* Content Area */}
        <Grid container spacing={4}>
          
          {/* Product Grid */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {totalItems > 0 
                  ? `Menampilkan ${(page - 1) * limit + 1} - ${Math.min(page * limit, totalItems)} dari ${totalItems} produk`
                  : 'Tidak ada produk untuk ditampilkan'}
              </Typography>
            </Box>

            {isLoading ? (
              <ProductGridSkeleton />
            ) : error ? (
              <ErrorState 
                title="Gagal Memuat Produk" 
                description={error} 
                onRetry={fetchProducts} 
              />
            ) : products.length === 0 ? (
              <EmptyState 
                title="Produk Tidak Ditemukan" 
                description="Kami tidak dapat menemukan produk yang sesuai dengan pencarian atau filter Anda." 
              />
            ) : (
              <>
                <ProductGrid 
                  products={products} 
                  onProductClick={handleProductClick}
                  onSelectReference={handleSelectReference}
                  referenceProductId={referenceProductId}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                    <Pagination 
                      count={totalPages} 
                      page={page}
                      onChange={handlePageChange}
                      color="primary" 
                      size="large" 
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </AppContainer>

    </Box>
  );
};
