import { useEffect } from "react";
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

  useEffect(() => {
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
      <form onSubmit={handleSubmit(onSubmit)}>
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
              <TextField
                fullWidth
                label="Image URL"
                {...register("image_url")}
                error={!!errors.image_url}
                helperText={errors.image_url?.message}
              />
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
