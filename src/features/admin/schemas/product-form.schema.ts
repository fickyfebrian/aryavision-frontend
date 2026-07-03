import { z } from 'zod';

export const productFormSchema = z.object({
  product_name: z.string().min(1, 'Nama produk wajib diisi'),
  brand: z.string(),
  category: z.string(),
  price: z.number().min(0, 'Harga harus >= 0'),
  rating: z.number().min(0, 'Rating minimal 0').max(5, 'Rating maksimal 5'),
  sold: z.number().min(0, 'Terjual harus >= 0'),
  image_url: z.string(),
  product_url: z.string(),
  description: z.string(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;



