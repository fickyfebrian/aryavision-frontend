import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Pagination,
  Button,
  Drawer,
  useTheme,
  useMediaQuery,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';
import { AppContainer, SearchInput } from '@/components/ui';
import { EmptyState, ErrorState } from '@/components/common';
import { FilterSidebar } from '../FilterSidebar';
import { ProductGrid } from '../ProductGrid';
import { ProductGridSkeleton } from '../ProductGridSkeleton';
import { productService } from '@/services/product.service';
import type { Product } from '@/features/product/types';

export const CatalogPage = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
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

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sort, order] = sortParam.split('-');
      const data = await productService.getProducts({
        page,
        limit,
        search: search || undefined,
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
  }, [page, limit, search, sortParam]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleFilter = () => {
    setMobileFilterOpen(!mobileFilterOpen);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };
  
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortParam(event.target.value);
    setPage(1); // Reset to first page on sort change
  };
  
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1, width: '100%', maxWidth: { md: 600 } }}>
              <SearchInput 
                placeholder="Cari CCTV (contoh: Indoor 1080p)..." 
                value={search}
                onChange={handleSearch}
                onClear={() => handleSearch('')}
              />
            </Box>
            
            <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="sort-label">Urutkan</InputLabel>
                <Select
                  labelId="sort-label"
                  id="sort-select"
                  value={sortParam}
                  label="Urutkan"
                  onChange={handleSortChange}
                >
                  <MenuItem value="created_at-desc">Terbaru</MenuItem>
                  <MenuItem value="price-asc">Harga Terendah</MenuItem>
                  <MenuItem value="price-desc">Harga Tertinggi</MenuItem>
                  <MenuItem value="rating-desc">Rating Tertinggi</MenuItem>
                </Select>
              </FormControl>
              
              {!isDesktop && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FilterIcon />}
                  onClick={handleToggleFilter}
                  sx={{ borderRadius: 2 }}
                >
                  Filter
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>

        {/* Content Area */}
        <Grid container spacing={4}>
          {/* Sidebar (Desktop) */}
          {isDesktop && (
            <Grid size={{ md: 3 }}>
              <FilterSidebar />
            </Grid>
          )}

          {/* Product Grid */}
          <Grid size={{ xs: 12, md: 9 }}>
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
                <ProductGrid products={products} />

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

      {/* Mobile Drawer Filter */}
      {!isDesktop && (
        <Drawer
          anchor="bottom"
          open={mobileFilterOpen}
          onClose={handleToggleFilter}
          slotProps={{
            paper: {
              sx: { height: '80vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 }
            }
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 40, height: 4, bgcolor: 'grey.300', borderRadius: 2 }} />
          </Box>
          <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
            <FilterSidebar />
          </Box>
          <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
            <Button fullWidth variant="contained" color="primary" onClick={handleToggleFilter}>
              Terapkan Filter
            </Button>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};
