import { useEffect, useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { productService, getFullImageUrl } from "@/services/product.service";
import type { Product } from "@/features/product/types";
import {
  productFormSchema,
  type ProductFormValues,
} from "../schemas/product-form.schema";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  initialData?: Product | null;
  loading?: boolean;
}

export const ProductFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
}: ProductFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      product_name: "",
      brand: "",
      category: "",
      price: "" as unknown as number,
      rating: "" as unknown as number,
      sold: "" as unknown as number,
      image_url: "",
      product_url: "",
      description: "",
    },
  });

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImageUrl = watch("image_url");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setValue("image_url", objectUrl, { shouldValidate: true });
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setValue("image_url", "", { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onFormSubmit = async (data: ProductFormValues) => {
    try {
      setIsUploading(true);
      let finalImageUrl = data.image_url;
      
      // Jika ada file baru yang dipilih, upload dulu ke Supabase
      if (selectedFile) {
        finalImageUrl = await productService.uploadImage(selectedFile);
      }
      
      await onSubmit({ ...data, image_url: finalImageUrl });
    } catch (error) {
      console.error("Failed to upload image during submit:", error);
      alert("Gagal mengupload gambar. Pastikan backend server menyala.");
    } finally {
      setIsUploading(false);
    }
  };


  useEffect(() => {
    setSelectedFile(null);
    if (open) {
      if (initialData) {
        reset({
          product_name: initialData.name || "",
          brand: initialData.brand || "",
          category: initialData.category || "",
          price: initialData.price || 0,
          rating: initialData.rating || 0,
          sold: initialData.soldCount || 0,
          image_url: initialData.imageUrl || "",
          product_url: initialData.productUrl || "",
          description: initialData.description || "",
        });
      } else {
        reset({
          product_name: "",
          brand: "",
          category: "",
          price: "" as unknown as number,
          rating: "" as unknown as number,
          sold: "" as unknown as number,
          image_url: "",
          product_url: "",
          description: "",
        });
      }
    }
  }, [initialData, open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogTitle className="font-bold">
          {initialData ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent dividers>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="col-span-1 md:col-span-12">
              <TextField
                fullWidth
                label="Product Name"
                {...register("product_name")}
                error={!!errors.product_name}
                helperText={errors.product_name?.message}
                required
              />
            </div>
            <div className="col-span-1 md:col-span-6">
              <TextField
                fullWidth
                label="Brand"
                {...register("brand")}
                error={!!errors.brand}
                helperText={errors.brand?.message}
              />
            </div>
            <div className="col-span-1 md:col-span-6">
              <TextField
                fullWidth
                label="Category"
                {...register("category")}
                error={!!errors.category}
                helperText={errors.category?.message}
              />
            </div>
            <div className="col-span-1 md:col-span-4">
              <Controller
                name="price"
                control={control}
                render={({ field: { onChange, value, name, onBlur, ref } }) => (
                  <NumericFormat
                    name={name}
                    value={value}
                    onBlur={onBlur}
                    getInputRef={ref}
                    customInput={TextField}
                    fullWidth
                    label="Price (Rp)"
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    required
                    onValueChange={(values) => {
                      // Pass the unformatted number to react-hook-form
                      onChange(values.floatValue ?? undefined);
                    }}
                  />
                )}
              />
            </div>
            <div className="col-span-1 md:col-span-4">
              <TextField
                fullWidth
                label="Rating (0-5)"
                type="number"
                slotProps={{ htmlInput: { min: 0, max: 5, step: 0.1 } }}
                onInput={(e: React.FormEvent<HTMLDivElement>) => {
                  const target = e.target as HTMLInputElement;
                  let val = parseFloat(target.value);
                  if (val > 5) target.value = "5";
                  if (val < 0) target.value = "0";
                }}
                {...register("rating", { valueAsNumber: true })}
                error={!!errors.rating}
                helperText={errors.rating?.message}
                required
              />
            </div>
            <div className="col-span-1 md:col-span-4">
              <Controller
                name="sold"
                control={control}
                render={({ field: { onChange, value, name, onBlur, ref } }) => (
                  <NumericFormat
                    name={name}
                    value={value}
                    onBlur={onBlur}
                    getInputRef={ref}
                    customInput={TextField}
                    fullWidth
                    label="Sold"
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    error={!!errors.sold}
                    helperText={errors.sold?.message}
                    onValueChange={(values) => {
                      onChange(values.floatValue ?? undefined);
                    }}
                  />
                )}
              />
            </div>
            <div className="col-span-1 md:col-span-12">
              <div className="flex flex-col gap-2">
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>Product Image</Typography>
                
                {/* Hidden input to keep form state tracking */}
                <input type="hidden" {...register("image_url")} />
                
                
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={isUploading}
                    startIcon={isUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                    sx={{ height: '40px', maxWidth: '200px' }}
                  >
                    {isUploading ? "Uploading..." : "Upload Photo"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                  </Button>
                  
                  {(currentImageUrl || selectedFile) && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleRemovePhoto}
                      disabled={isUploading}
                      sx={{ height: '40px' }}
                    >
                      Hapus Foto
                    </Button>
                  )}
                </div>
                {!!errors.image_url && (
                  <Typography variant="caption" color="error">
                    {errors.image_url?.message}
                  </Typography>
                )}
              </div>
              {currentImageUrl && (
                <Box sx={{ mt: 2, maxWidth: '200px', borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                  <img 
                    src={getFullImageUrl(currentImageUrl)} 
                    alt="Preview" 
                    style={{ width: '100%', height: 'auto', display: 'block' }} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557825835-b453e020e980?w=500&q=80';
                    }}
                  />
                </Box>
              )}
            </div>
            <div className="col-span-1 md:col-span-12">
              <TextField
                fullWidth
                label="Product URL"
                {...register("product_url")}
                error={!!errors.product_url}
                helperText={errors.product_url?.message}
              />
            </div>
            <div className="col-span-1 md:col-span-12">
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </div>
            {initialData && (
              <div className="col-span-1 md:col-span-12">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="italic"
                >
                  * Cluster is read-only and will be updated automatically by
                  K-Means algorithm.
                </Typography>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
