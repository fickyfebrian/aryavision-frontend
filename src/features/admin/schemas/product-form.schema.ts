import { z } from "zod";

const numericField = (label: string, max?: number) => {
  let schema = z
    .number({ error: `${label} wajib diisi` })
    .min(0, `${label} tidak boleh kurang dari 0`);

  if (max !== undefined) {
    schema = schema.max(max, `${label} tidak boleh lebih dari ${max}`);
  }

  return z.preprocess(
    (v) =>
      v === "" || v === undefined || Number.isNaN(v) ? undefined : Number(v),
    schema,
  );
};

export const productFormSchema = z.object({
  product_name: z.string().min(1, "Nama produk wajib diisi"),
  brand: z.string(),
  category: z.string(),
  price: numericField("Harga"),
  rating: numericField("Rating", 5),
  sold: numericField("Terjual"),
  image_url: z.string(),
  product_url: z.string(),
  description: z.string(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
