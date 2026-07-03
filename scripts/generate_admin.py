import os
import json

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created: {path}")

# 1. Update src/services/product.service.ts
product_service_code = """import { axiosInstance } from '@/lib/axios';
import type { Product, ProductCluster } from '@/features/product/types';

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

interface BackendProduct {
  id: number;
  product_name: string;
  image_url: string;
  price: number;
  rating: number;
  sold: number;
  description?: string;
  brand?: string;
  category?: string;
  cluster?: number | string;
}

interface BackendPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

interface BackendPaginatedResponse {
  success: boolean;
  message: string;
  data: {
    items: BackendProduct[];
    pagination: BackendPagination;
  };
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  cluster?: number;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  max_rating?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export const productService = {
  _mapBackendProductToFrontend: (item: BackendProduct): Product => {
    let cluster: ProductCluster = 'budget';
    if (item.cluster === 1 || item.cluster === 'Mid Range') {
      cluster = 'mid-range';
    } else if (item.cluster === 2 || item.cluster === 'Premium') {
      cluster = 'premium';
    } else if (item.cluster === 0 || item.cluster === 'Budget') {
      cluster = 'budget';
    }
    
    return {
      id: String(item.id),
      name: item.product_name,
      imageUrl: item.image_url || 'https://images.unsplash.com/photo-1557825835-b453e020e980?w=500&q=80',
      price: item.price,
      rating: item.rating || 0,
      soldCount: item.sold || 0,
      description: item.description,
      cluster,
      brand: item.brand,
      category: item.category
    };
  },

  getProducts: async (params: GetProductsParams): Promise<PaginatedResponse<Product>['data']> => {
    const response = await axiosInstance.get<BackendPaginatedResponse>('/products', { params });
    const backendData = response.data.data;
    const items: Product[] = backendData.items.map(productService._mapBackendProductToFrontend);

    return {
      items,
      total: backendData.pagination.total_items,
      page: backendData.pagination.page,
      limit: backendData.pagination.limit,
      total_pages: backendData.pagination.total_pages
    };
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await axiosInstance.get<{ success: boolean; message: string; data: BackendProduct }>(`/products/${id}`);
    return productService._mapBackendProductToFrontend(response.data.data);
  },

  getRecommendations: async (productId: string, limit: number = 4): Promise<{ selectedProduct: Product, recommendations: Product[] }> => {
    const response = await axiosInstance.get<{ 
      success: boolean; 
      message: string; 
      data: {
        selected_product: BackendProduct;
        recommendations: BackendProduct[];
      }
    }>(`/recommendations/${productId}`, { params: { limit } });
    
    return {
      selectedProduct: productService._mapBackendProductToFrontend(response.data.data.selected_product),
      recommendations: response.data.data.recommendations.map(productService._mapBackendProductToFrontend)
    };
  },

  // CMS Endpoints
  createProduct: async (data: Partial<BackendProduct>) => {
    const response = await axiosInstance.post('/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<BackendProduct>) => {
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  }
};
"""
write_file('src/services/product.service.ts', product_service_code)


# 2. src/features/admin/index.ts
admin_index = """export * from './DashboardPage';
export * from './ProductsPage';
"""
write_file('src/features/admin/index.ts', admin_index)


# 3. src/features/admin/DashboardPage.tsx
dashboard_code = """import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { Package, Tags, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { productService } from '@/services/product.service';

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    brand: 0,
    budget: 0,
    midRange: 0,
    premium: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await productService.getProducts({ limit: 999999 });
        const items = res.items;
        
        const brands = new Set(items.map(p => p.brand).filter(Boolean));
        
        setStats({
          total: items.length,
          brand: brands.size,
          budget: items.filter(p => p.cluster === 'budget').length,
          midRange: items.filter(p => p.cluster === 'mid-range').length,
          premium: items.filter(p => p.cluster === 'premium').length,
        });
      } catch (err: any) {
        setError(err.message || 'Gagal mengambil data statistik');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box className="flex h-[400px] items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex h-[400px] items-center justify-center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const statCards = [
    { label: 'Total Products', value: stats.total, icon: <Package size={24} className="text-blue-500" />, color: 'bg-blue-50 border-blue-100' },
    { label: 'Total Brands', value: stats.brand, icon: <Tags size={24} className="text-purple-500" />, color: 'bg-purple-50 border-purple-100' },
    { label: 'Budget Cluster', value: stats.budget, icon: <TrendingDown size={24} className="text-green-500" />, color: 'bg-green-50 border-green-100' },
    { label: 'Mid Range Cluster', value: stats.midRange, icon: <Award size={24} className="text-orange-500" />, color: 'bg-orange-50 border-orange-100' },
    { label: 'Premium Cluster', value: stats.premium, icon: <TrendingUp size={24} className="text-red-500" />, color: 'bg-red-50 border-red-100' },
  ];

  return (
    <Box>
      <Typography variant="h4" className="mb-6 font-bold text-gray-900">Dashboard</Typography>
      
      <Grid container spacing={3}>
        {statCards.map((stat, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card className={`p-6 border shadow-sm ${stat.color} transition-all hover:shadow-md`}>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body2" className="text-gray-600 font-medium mb-1">
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" className="font-bold text-gray-900">
                    {stat.value}
                  </Typography>
                </div>
                <div className="p-3 bg-white rounded-full shadow-sm">
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
"""
write_file('src/features/admin/DashboardPage.tsx', dashboard_code)


# 4. src/features/admin/components/ProductFormModal.tsx
product_form = """import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Product } from '@/features/product/types';

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Product | null;
  loading?: boolean;
}

export const ProductFormModal = ({ open, onClose, onSubmit, initialData, loading }: ProductFormModalProps) => {
  const [formData, setFormData] = useState({
    product_name: '',
    product_url: '',
    image_url: '',
    brand: '',
    category: '',
    price: '',
    rating: '',
    sold: '',
    description: ''
  });

  useEffect(() => {
    if (initialData && open) {
      setFormData({
        product_name: initialData.name || '',
        product_url: '', // Frontend model doesnt track url natively if not needed but we include
        image_url: initialData.imageUrl || '',
        brand: initialData.brand || '',
        category: initialData.category || '',
        price: String(initialData.price || 0),
        rating: String(initialData.rating || 0),
        sold: String(initialData.soldCount || 0),
        description: initialData.description || ''
      });
    } else if (open) {
      setFormData({
        product_name: '',
        product_url: '',
        image_url: '',
        brand: '',
        category: '',
        price: '',
        rating: '',
        sold: '',
        description: ''
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Parse numeric fields before submitting
    const payload = {
      ...formData,
      price: parseInt(formData.price) || 0,
      rating: parseFloat(formData.rating) || 0,
      sold: parseInt(formData.sold) || 0,
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle className="font-bold">{initialData ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Price (Rp)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Rating (0-5)"
                name="rating"
                type="number"
                inputProps={{ step: 0.1, min: 0, max: 5 }}
                value={formData.rating}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Sold"
                name="sold"
                type="number"
                value={formData.sold}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product URL"
                name="product_url"
                value={formData.product_url}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            {initialData && (
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" className="italic">
                  * Cluster is read-only and will be updated automatically by K-Means algorithm.
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
"""
write_file('src/features/admin/components/ProductFormModal.tsx', product_form)


# 5. src/features/admin/ProductsPage.tsx
products_page = """import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

import { productService } from '@/services/product.service';
import { Product } from '@/features/product/types';
import { ProductFormModal } from './components/ProductFormModal';
import { formatCurrency } from '@/utils/formatters';
import { ClusterBadge } from '@/components/ui/ClusterBadge';

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
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
            InputProps={{
              endAdornment: (
                <IconButton type="submit" size="small">
                  <Search size={18} />
                </IconButton>
              )
            }}
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
                    <Typography variant="caption" display="block">⭐ {row.rating}</Typography>
                    <Typography variant="caption" display="block" color="textSecondary">Sold: {row.soldCount}</Typography>
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
"""
import re
# Import Card manually to avoid missing dependency
products_page = products_page.replace("import Button from '@mui/material/Button';", "import Button from '@mui/material/Button';\nimport Card from '@mui/material/Card';")
write_file('src/features/admin/ProductsPage.tsx', products_page)

# 6. src/routes/AppRouter.tsx
app_router = """import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "../components/layout";
import { AdminLayout } from "../layouts/AdminLayout";
import { HomePage } from "../features/home";
import { CatalogPage } from "../features/catalog";
import { RecommendationPage } from "../features/recommendation";
import { ProductDetailPage } from "../features/product";
import { LoginPage } from "../features/auth";
import { DashboardPage, ProductsPage } from "../features/admin";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
"""
write_file('src/routes/AppRouter.tsx', app_router)

print("Generation complete.")
