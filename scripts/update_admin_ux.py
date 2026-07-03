import os
import re

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed: {path}")

# 1. Patch ProductFormModal.tsx
modal_path = 'src/features/admin/components/ProductFormModal.tsx'
with open(modal_path, 'r', encoding='utf-8') as f:
    modal_content = f.read()

# Add validation in handleChange
change_handler = """  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'rating') {
      const num = parseFloat(value);
      if (num < 0 || num > 5) return; // Prevent typing outside bounds
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };"""
modal_content = re.sub(r'const handleChange =.*?};', change_handler, modal_content, flags=re.DOTALL)

# Add slotProps to Rating field
rating_field_old = """                label="Rating (0-5)"
                name="rating"
                type="number"
                
                value={formData.rating}"""
rating_field_new = """                label="Rating (0-5)"
                name="rating"
                type="number"
                slotProps={{ htmlInput: { min: 0, max: 5, step: 0.1 } }}
                value={formData.rating}"""
modal_content = modal_content.replace(rating_field_old, rating_field_new)

write_file(modal_path, modal_content)

# 2. Rewrite ProductsPage.tsx
prod_path = 'src/features/admin/ProductsPage.tsx'
products_page = """import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import { Plus, Edit2, Trash2 } from 'lucide-react';
import { SearchInput } from '@/components/ui';

import { productService } from '@/services/product.service';
import type { Product } from '@/features/product/types';
import { ProductFormModal } from './components/ProductFormModal';
import { formatCurrency } from '@/utils/formatters';
import { ClusterBadge } from '@/features/product/components/ClusterBadge';

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Toast State
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };
  const handleCloseToast = () => setToast(prev => ({ ...prev, open: false }));

  // Active Filter States
  const [activeSearch, setActiveSearch] = useState('');
  const [activeCluster, setActiveCluster] = useState<number | undefined>();
  const [activeMinPrice, setActiveMinPrice] = useState<number | undefined>();
  const [activeMaxPrice, setActiveMaxPrice] = useState<number | undefined>();
  const [activeMinRating, setActiveMinRating] = useState<number | undefined>();
  const [activeMaxRating, setActiveMaxRating] = useState<number | undefined>();
  
  // Draft Filter States
  const [draftSearch, setDraftSearch] = useState('');
  const [draftCluster, setDraftCluster] = useState('');
  const [draftMinPrice, setDraftMinPrice] = useState('');
  const [draftMaxPrice, setDraftMaxPrice] = useState('');
  const [draftRating, setDraftRating] = useState('Semua Rating');
  const [priceError, setPriceError] = useState('');

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts({
        page,
        limit: 10,
        search: activeSearch || undefined,
        cluster: activeCluster,
        min_price: activeMinPrice,
        max_price: activeMaxPrice,
        min_rating: activeMinRating,
        max_rating: activeMaxRating,
      });
      
      setProducts(res.items);
      setTotal(res.total_pages);
    } catch (err) {
      showToast('Gagal memuat daftar produk', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, activeSearch, activeCluster, activeMinPrice, activeMaxPrice, activeMinRating, activeMaxRating]);

  const handleApplyFilter = () => {
    // Harga Validation
    let minPrice: number | undefined = undefined;
    let maxPrice: number | undefined = undefined;
    
    if (draftMinPrice) minPrice = parseInt(draftMinPrice);
    if (draftMaxPrice) maxPrice = parseInt(draftMaxPrice);
    
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      setPriceError('Min > Max');
      return;
    }
    setPriceError('');

    // Cluster mapping
    let clusterId: number | undefined = undefined;
    if (draftCluster === 'budget') clusterId = 0;
    if (draftCluster === 'mid-range') clusterId = 1;
    if (draftCluster === 'premium') clusterId = 2;

    // Rating mapping
    let minRating: number | undefined = undefined;
    let maxRating: number | undefined = undefined;

    if (draftRating === '★★★★★') { minRating = 5; maxRating = 5; }
    else if (draftRating === '★★★★☆') { minRating = 4; maxRating = 5; }
    else if (draftRating === '★★★☆☆') { minRating = 3; maxRating = 4; }
    else if (draftRating === '★★☆☆☆') { minRating = 2; maxRating = 3; }
    else if (draftRating === '★☆☆☆☆') { minRating = 1; maxRating = 2; }

    setActiveSearch(draftSearch);
    setActiveCluster(clusterId);
    setActiveMinPrice(minPrice);
    setActiveMaxPrice(maxPrice);
    setActiveMinRating(minRating);
    setActiveMaxRating(maxRating);
    setPage(1);
  };

  const handleResetFilter = () => {
    setDraftSearch('');
    setDraftCluster('');
    setDraftMinPrice('');
    setDraftMaxPrice('');
    setDraftRating('Semua Rating');
    setPriceError('');

    setActiveSearch('');
    setActiveCluster(undefined);
    setActiveMinPrice(undefined);
    setActiveMaxPrice(undefined);
    setActiveMinRating(undefined);
    setActiveMaxRating(undefined);
    setPage(1);
  };

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setSelectedProduct(p);
    setFormOpen(true);
  };

  const handleOpenDelete = (p: Product) => {
    setProductToDelete(p);
    setDeleteOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      setActionLoading(true);
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, data);
        showToast('Produk berhasil diperbarui.', 'success');
      } else {
        await productService.createProduct(data);
        showToast('Produk berhasil ditambahkan.', 'success');
      }
      setFormOpen(false);
      fetchProducts();
    } catch (err: any) {
      showToast(selectedProduct ? 'Gagal memperbarui produk.' : 'Gagal menambahkan produk.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      setActionLoading(true);
      await productService.deleteProduct(productToDelete.id);
      showToast('Produk berhasil dihapus.', 'success');
      setDeleteOpen(false);
      fetchProducts();
    } catch (err: any) {
      showToast('Gagal menghapus produk.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box>
      <Box className="flex items-center justify-between mb-6">
        <Typography variant="h4" className="font-bold text-gray-900">Manage Products</Typography>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenAdd}>
          Add Product
        </Button>
      </Box>

      {/* Filters (Matching CatalogPage UX) */}
      <Card className="mb-6 shadow-sm border border-gray-200">
        <Stack
          component="form"
          spacing={2}
          sx={{ p: { xs: 2, sm: 2.5 } }}
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            handleApplyFilter();
          }}
        >
          <SearchInput
            placeholder="Cari CCTV..."
            value={draftSearch}
            onChange={setDraftSearch}
            onClear={() => setDraftSearch("")}
          />
          <Divider sx={{ borderStyle: "dashed" }} />
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            sx={{ alignItems: { xs: "stretch", md: "flex-start" } }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ flexGrow: 1, flexWrap: "wrap", rowGap: 1.5 }}
            >
              <FormControl size="small" sx={{ minWidth: 140, flex: { sm: 1 } }}>
                <InputLabel>Cluster</InputLabel>
                <Select
                  value={draftCluster}
                  label="Cluster"
                  onChange={(e) => setDraftCluster(e.target.value as string)}
                >
                  <MenuItem value="">Semua</MenuItem>
                  <MenuItem value="budget">Budget</MenuItem>
                  <MenuItem value="mid-range">Mid-Range</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 140, flex: { sm: 1 } }}>
                <InputLabel>Rating</InputLabel>
                <Select
                  value={draftRating}
                  label="Rating"
                  onChange={(e) => setDraftRating(e.target.value as string)}
                >
                  <MenuItem value="Semua Rating">Semua Rating</MenuItem>
                  <MenuItem value="★★★★★">⭐ 5+</MenuItem>
                  <MenuItem value="★★★★☆">⭐ 4+</MenuItem>
                  <MenuItem value="★★★☆☆">⭐ 3+</MenuItem>
                  <MenuItem value="★★☆☆☆">⭐ 2+</MenuItem>
                  <MenuItem value="★☆☆☆☆">⭐ 1+</MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="minPrice"
                value={draftMinPrice}
                onChange={(e) => setDraftMinPrice(e.target.value)}
                label="Harga Minimum"
                type="number"
                size="small"
                sx={{ minWidth: 150, flex: { sm: 1 } }}
                error={!!priceError}
              />
              <TextField
                name="maxPrice"
                value={draftMaxPrice}
                onChange={(e) => setDraftMaxPrice(e.target.value)}
                label="Harga Maksimum"
                type="number"
                size="small"
                sx={{ minWidth: 150, flex: { sm: 1 } }}
                error={!!priceError}
                helperText={priceError || " "}
              />
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                justifyContent: { xs: "stretch", md: "flex-end" },
                "& > *": { flex: { xs: 1, md: "0 0 auto" } },
              }}
            >
              <Button type="button" variant="outlined" onClick={handleResetFilter} sx={{ height: 40 }}>
                Reset
              </Button>
              <Button type="submit" variant="contained" color="primary" disableElevation sx={{ height: 40 }}>
                Terapkan Filter
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Card>

      {/* Table */}
      <TableContainer component={Paper} className="shadow-sm border">
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stats</TableCell>
              <TableCell>Cluster</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" className="py-12">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" className="py-12 text-gray-500">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  <TableCell>
                    <img src={row.imageUrl} alt={row.name} className="w-12 h-12 object-cover rounded border" />
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate" title={row.name}>
                    <Typography variant="body2" className="font-medium">{row.name}</Typography>
                  </TableCell>
                  <TableCell>{row.brand || '-'}</TableCell>
                  <TableCell className="font-medium text-blue-600">{formatCurrency(row.price)}</TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ display: 'block' }}>⭐ {row.rating}</Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>Sold: {row.soldCount}</Typography>
                  </TableCell>
                  <TableCell>
                    <ClusterBadge cluster={row.cluster} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary" onClick={() => handleOpenEdit(row)}>
                      <Edit2 size={16} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleOpenDelete(row)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {total > 1 && (
        <Box className="flex justify-center mt-6">
          <Pagination 
            count={total} 
            page={page} 
            onChange={(_, val) => setPage(val)} 
            color="primary" 
          />
        </Box>
      )}

      {/* Form Modal */}
      <ProductFormModal 
        open={formOpen} 
        onClose={() => setFormOpen(false)} 
        onSubmit={handleSave}
        initialData={selectedProduct}
        loading={actionLoading}
      />

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Apakah Anda yakin ingin menghapus produk ini?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} disabled={actionLoading}>Batal</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={actionLoading}>
            {actionLoading ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Toast Notification */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
"""
write_file(prod_path, products_page)

