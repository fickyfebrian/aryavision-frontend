import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Pagination,
  Button,
  Drawer,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';
import { AppContainer, SearchInput } from '@/components/ui';
import { POPULAR_PRODUCTS_DATA } from '@/features/home/data';
import { FilterSidebar } from '../FilterSidebar';
import { ProductGrid } from '../ProductGrid';

export const CatalogPage = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Dummy products, repeated to show pagination
  const dummyProducts = [...POPULAR_PRODUCTS_DATA, ...POPULAR_PRODUCTS_DATA, ...POPULAR_PRODUCTS_DATA].map((p, i) => ({
    ...p,
    id: `${p.id}-${i}`
  }));

  const handleToggleFilter = () => {
    setMobileFilterOpen(!mobileFilterOpen);
  };

  const handleSearch = (value: string) => {
    console.log("Search: ", value);
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

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1, maxWidth: 600 }}>
              <SearchInput 
                placeholder="Cari CCTV (contoh: Indoor 1080p)..." 
                onChange={handleSearch}
              />
            </Box>
            {!isDesktop && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FilterIcon />}
                onClick={handleToggleFilter}
                sx={{ height: 48, borderRadius: 2 }}
              >
                Filter
              </Button>
            )}
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
                Menampilkan 1 - 12 dari 120 produk
              </Typography>
            </Box>

            <ProductGrid products={dummyProducts} />

            {/* Pagination */}
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
              <Pagination count={10} color="primary" size="large" />
            </Box>
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
