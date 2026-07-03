import { useState, useEffect } from 'react';
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
const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

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
  
  // Filters
  const [search, setSearch] = useState('');
  const [brand] = useState('');
  const [cluster, setCluster] = useState<number | ''>('');
  
  const [draftSearch, setDraftSearch] = useState('');

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
        search,
        cluster: cluster !== '' ? cluster : undefined,
      });
      // Filter by brand manually if backend doesn't support brand filter natively,
      // but if we want to be safe we just pass it if backend supports.
      // Since backend GetProductsParams doesn't have brand, we filter locally or skip.
      let items = res.items;
      if (brand) {
        items = items.filter(i => i.brand?.toLowerCase().includes(brand.toLowerCase()));
      }
      setProducts(items);
      setTotal(res.total_pages); // pagination based on total_pages
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, cluster]); // re-fetch on filter change

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(draftSearch);
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
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(data);
        toast.success('Product created successfully');
      }
      setFormOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      setActionLoading(true);
      await productService.deleteProduct(productToDelete.id);
      toast.success('Product deleted successfully');
      setDeleteOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast.error('Failed to delete product');
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

      {/* Filters */}
      <Card className="mb-6 p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-4">
          <TextField
            size="small"
            label="Search Products"
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            className="min-w-[200px] flex-1"
            slotProps={{ input: {
              endAdornment: (
                <IconButton type="submit" size="small">
                  <Search size={18} />
                </IconButton>
              )
            } }}
          />
          
          <TextField
            select
            size="small"
            label="Cluster"
            value={cluster}
            onChange={(e) => { setCluster(e.target.value as any); setPage(1); }}
            className="min-w-[150px]"
          >
            <MenuItem value="">All Clusters</MenuItem>
            <MenuItem value={0}>Budget</MenuItem>
            <MenuItem value={1}>Mid Range</MenuItem>
            <MenuItem value={2}>Premium</MenuItem>
          </TextField>
          
          <Button variant="outlined" onClick={() => {
            setSearch('');
            setDraftSearch('');
            setCluster('');
            setPage(1);
          }}>
            Reset
          </Button>
        </form>
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
          Are you sure you want to delete this product? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} disabled={actionLoading}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={actionLoading}>
            {actionLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
