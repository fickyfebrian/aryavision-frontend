import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { Product } from '@/features/product/types';

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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="col-span-1 md:col-span-12">
              <TextField
                fullWidth
                label="Product Name"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-1 md:col-span-6">
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1 md:col-span-6">
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1 md:col-span-4">
              <TextField
                fullWidth
                label="Price (Rp)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-1 md:col-span-4">
              <TextField
                fullWidth
                label="Rating (0-5)"
                name="rating"
                type="number"
                
                value={formData.rating}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1 md:col-span-4">
              <TextField
                fullWidth
                label="Sold"
                name="sold"
                type="number"
                value={formData.sold}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1 md:col-span-12">
              <TextField
                fullWidth
                label="Image URL"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1 md:col-span-12">
              <TextField
                fullWidth
                label="Product URL"
                name="product_url"
                value={formData.product_url}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1 md:col-span-12">
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            {initialData && (
              <div className="col-span-1 md:col-span-12">
                <Typography variant="body2" color="textSecondary" className="italic">
                  * Cluster is read-only and will be updated automatically by K-Means algorithm.
                </Typography>
              </div>
            )}
          </div>
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
