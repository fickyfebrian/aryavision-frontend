import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  Button,
  Divider,
  Alert,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import { labApi, type CBFCalcResponse } from "../../api/lab.api";

interface CBFTabProps {
  bounds: {
    price: { min: number; max: number };
    rating: { min: number; max: number };
    sales: { min: number; max: number };
  };
  cleaned_products: any[];
}

export const CBFTab: React.FC<CBFTabProps> = ({ bounds, cleaned_products }) => {
  const [targetId, setTargetId] = useState<number | "">("");
  const [altId, setAltId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CBFCalcResponse["data"] | null>(null);

  const targetProduct = useMemo(
    () => cleaned_products.find((p) => p.id === targetId),
    [targetId, cleaned_products],
  );

  const altProduct = useMemo(
    () => cleaned_products.find((p) => p.id === altId),
    [altId, cleaned_products],
  );

  const validAlternatives = useMemo(() => {
    if (!targetProduct) return [];
    return cleaned_products.filter(
      (p) => p.cluster === targetProduct.cluster && p.id !== targetProduct.id,
    );
  }, [targetProduct, cleaned_products]);

  const handleCalculate = async () => {
    if (!targetProduct || !altProduct) return;

    setLoading(true);
    try {
      const res = await labApi.calculateCBF({
        target: {
          price: targetProduct.price,
          rating: targetProduct.rating,
          sold: targetProduct.sold,
        },
        alt: {
          price: altProduct.price,
          rating: altProduct.rating,
          sold: altProduct.sold,
        },
        bounds,
      });
      setResult(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Header Info */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#64748b" }}
            gutterBottom
          >
            TAHAP 4: METODE CONTENT-BASED FILTERING (CBF) VIA COSINE SIMILARITY
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sistem rekomendasi <strong>Content-Based Filtering (CBF)</strong>{" "}
            pada skripsi ini menghitung kedekatan atau derajat kemiripan
            karakteristik arah sudut vektor antara{" "}
            <strong>vektor produk acuan A</strong> (sedang dilihat) dengan{" "}
            <strong>vektor produk alternatif B</strong> (pesaing dalam cluster
            yang sama) menggunakan rumus <strong>Cosine Similarity</strong>.
          </Typography>

          <Card variant="outlined" sx={{ borderRadius: 2, mt: 2 }}>
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                TAHUSAN PERHITUNGAN KOMPONEN FORMULA:
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ bgcolor: "grey.50", p: 1.5, borderRadius: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", color: "primary.main" }}
                    >
                      1. Dot Product (A • B)
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        fontFamily: "monospace",
                      }}
                    >
                      Σ(A_i * B_i) = A_price*B_price + A_rat*B_rat +
                      A_sales*B_sales
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ bgcolor: "grey.50", p: 1.5, borderRadius: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", color: "primary.main" }}
                    >
                      2. Magnitude Length (||A||)
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        fontFamily: "monospace",
                      }}
                    >
                      √(Σ(A_i ^ 2)) = √(A_price² + A_rat² + A_sales²)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              bgcolor: "#4f46e5",
              color: "white",
              borderRadius: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 3, opacity: 0.9 }}
              >
                FORMULA COSINE SIMILARITY (CBF ENGINE)
              </Typography>
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  p: 3,
                  borderRadius: 1,
                  textAlign: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "monospace", fontWeight: "bold" }}
                >
                  Similarity(A, B) = <br /> (A • B) / (||A|| * ||B||)
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Semakin dekat nilai indeks kesamaan ke angka{" "}
                <strong>1 (1.0000)</strong>, maka arah sudut vektor semakin
                berdekatan yang menandakan derajat kemiripan kedua produk CCTV
                dalam kategori Content-Based sangat tinggi.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Selectors & Calculator */}
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid",
            borderColor: "grey.200",
            bgcolor: "grey.50",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#e11d48",
            }}
          >
            <span>🧮</span> KALKULATOR SIMULASI CONTENT-BASED FILTERING (CBF)
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} sx={{ alignItems: "flex-end" }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", mb: 1, display: "block" }}
              >
                Pilih Produk Acuan A (Target Item)
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={targetId}
                  displayEmpty
                  onChange={(e) => {
                    setTargetId(e.target.value as number);
                    setAltId("");
                    setResult(null);
                  }}
                  sx={{ bgcolor: "white" }}
                >
                  <MenuItem value="" disabled>
                    Pilih Produk Acuan...
                  </MenuItem>
                  {cleaned_products.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.product_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", mb: 1, display: "block" }}
              >
                Pilih Produk Alternatif B (Dalam Cluster yang Sama)
              </Typography>
              <FormControl fullWidth size="small" disabled={!targetId}>
                <Select
                  value={altId}
                  displayEmpty
                  onChange={(e) => {
                    setAltId(e.target.value as number);
                    setResult(null);
                  }}
                  sx={{ bgcolor: "white" }}
                >
                  <MenuItem value="" disabled>
                    Pilih Produk Alternatif...
                  </MenuItem>
                  {validAlternatives.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.product_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<CalculateIcon />}
                disabled={!targetId || !altId || loading}
                onClick={handleCalculate}
                sx={{ py: 1 }}
              >
                HITUNG
              </Button>
            </Grid>
          </Grid>

          {targetProduct && validAlternatives.length === 0 && (
            <Alert severity="warning" sx={{ mt: 3 }}>
              Tidak ada produk alternatif lain yang berada di dalam klaster yang
              sama dengan produk acuan ini. Silakan pilih produk lain.
            </Alert>
          )}

          {/* Result Display Step by Step */}
          {result && targetProduct && altProduct && (
            <Box sx={{ mt: 5 }}>
              <Divider sx={{ mb: 4 }} />

              {/* Langkah I */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 2, color: "text.secondary" }}
              >
                LANGKAH I: KONVERSI VEKTOR ASLI KE KOORDINAT TERNORMALISASI [0,
                1]
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f0f9ff",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "#bae6fd",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "#0284c7", mb: 1 }}
                    >
                      Vektor A: {targetProduct.product_name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mb: 0.5,
                        color: "text.secondary",
                      }}
                    >
                      • Raw:{" "}
                      <span style={{ color: "#ef4444", fontWeight: "bold" }}>
                        Harga {targetProduct.price}
                      </span>
                      ,{" "}
                      <span style={{ color: "#8b4513", fontWeight: "bold" }}>
                        Rating {targetProduct.rating}
                      </span>
                      ,{" "}
                      <span style={{ color: "#9333ea", fontWeight: "bold" }}>
                        Sales {targetProduct.sold}
                      </span>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        color: "#0369a1",
                      }}
                    >
                      • Norm vA = [{" "}
                      <span style={{ color: "#ef4444" }}>
                        {result.target_norm[0].toFixed(4)}
                      </span>
                      ,{" "}
                      <span style={{ color: "#8b4513" }}>
                        {result.target_norm[1].toFixed(4)}
                      </span>
                      ,{" "}
                      <span style={{ color: "#9333ea" }}>
                        {result.target_norm[2].toFixed(4)}
                      </span>{" "}
                      ]
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f0fdf4",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "#bbf7d0",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "#16a34a", mb: 1 }}
                    >
                      Vektor B: {altProduct.product_name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mb: 0.5,
                        color: "text.secondary",
                      }}
                    >
                      • Raw:{" "}
                      <span style={{ color: "#ef4444", fontWeight: "bold" }}>
                        Harga {altProduct.price}
                      </span>
                      ,{" "}
                      <span style={{ color: "#8b4513", fontWeight: "bold" }}>
                        Rating {altProduct.rating}
                      </span>
                      ,{" "}
                      <span style={{ color: "#9333ea", fontWeight: "bold" }}>
                        Sales {altProduct.sold}
                      </span>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        color: "#15803d",
                      }}
                    >
                      • Norm vB = [{" "}
                      <span style={{ color: "#ef4444" }}>
                        {result.alt_norm[0].toFixed(4)}
                      </span>
                      ,{" "}
                      <span style={{ color: "#8b4513" }}>
                        {result.alt_norm[1].toFixed(4)}
                      </span>
                      ,{" "}
                      <span style={{ color: "#9333ea" }}>
                        {result.alt_norm[2].toFixed(4)}
                      </span>{" "}
                      ]
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Langkah II */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 2, color: "text.secondary" }}
              >
                LANGKAH II: EVALUASI NILAI DOT PRODUCT & MAGNITUDO
              </Typography>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                  mb: 4,
                }}
              >
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: "bold",
                        color: "primary.main",
                        display: "block",
                        mb: 1,
                      }}
                    >
                      ▶ Perhitungan Dot Product (A • B):
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", color: "text.secondary" }}
                    >
                      ({" "}
                      <span style={{ color: "#ef4444" }}>
                        {result.target_norm[0].toFixed(4)} *{" "}
                        {result.alt_norm[0].toFixed(4)}
                      </span>{" "}
                      ) + ({" "}
                      <span style={{ color: "#8b4513" }}>
                        {result.target_norm[1].toFixed(4)} *{" "}
                        {result.alt_norm[1].toFixed(4)}
                      </span>{" "}
                      ) + ({" "}
                      <span style={{ color: "#9333ea" }}>
                        {result.target_norm[2].toFixed(4)} *{" "}
                        {result.alt_norm[2].toFixed(4)}
                      </span>{" "}
                      )
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        mt: 0.5,
                        color: "#4f46e5",
                      }}
                    >
                      ={" "}
                      <span style={{ color: "#ef4444" }}>
                        {(result.target_norm[0] * result.alt_norm[0]).toFixed(
                          4,
                        )}{" "}
                      </span>
                      +{" "}
                      <span style={{ color: "#8b4513" }}>
                        {(result.target_norm[1] * result.alt_norm[1]).toFixed(
                          4,
                        )}{" "}
                      </span>
                      +{" "}
                      <span style={{ color: "#9333ea" }}>
                        {(result.target_norm[2] * result.alt_norm[2]).toFixed(
                          4,
                        )}{" "}
                      </span>
                      ={" "}
                      <span style={{ color: "#10b981" }}>
                        {result.dot_product.toFixed(6)}
                      </span>
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }} sx={{ mt: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: "bold",
                        color: "primary.main",
                        display: "block",
                        mb: 1,
                      }}
                    >
                      ▶ Magnitudo Vektor A (||A||):
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", color: "text.secondary" }}
                    >
                      √({" "}
                      <span style={{ color: "#ef4444" }}>
                        {result.target_norm[0].toFixed(4)}²
                      </span>
                      +{" "}
                      <span style={{ color: "#8b4513" }}>
                        {result.target_norm[1].toFixed(4)}²
                      </span>
                      +{" "}
                      <span style={{ color: "#9333ea" }}>
                        {result.target_norm[2].toFixed(4)}²
                      </span>
                      )
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        mt: 0.5,
                        color: "#4f46e5",
                      }}
                    >
                      = √ ({" "}
                      {(
                        result.target_norm[0] ** 2 +
                        result.target_norm[1] ** 2 +
                        result.target_norm[2] ** 2
                      ).toFixed(5)}
                      ) ={" "}
                      <span style={{ color: "#10b981" }}>
                        {" "}
                        {result.magnitude_target.toFixed(6)}{" "}
                      </span>
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }} sx={{ mt: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: "bold",
                        color: "primary.main",
                        display: "block",
                        mb: 1,
                      }}
                    >
                      ▶ Magnitudo Vektor B (||B||):
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", color: "text.secondary" }}
                    >
                      √ ({" "}
                      <span style={{ color: "#ef4444" }}>
                        {result.alt_norm[0].toFixed(4)}²
                      </span>{" "}
                      +{" "}
                      <span style={{ color: "#8b4513" }}>
                        {result.alt_norm[1].toFixed(4)}²
                      </span>{" "}
                      +{" "}
                      <span style={{ color: "#9333ea" }}>
                        {result.alt_norm[2].toFixed(4)}²
                      </span>{" "}
                      )
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        mt: 0.5,
                        color: "#4f46e5",
                      }}
                    >
                      = √ ({" "}
                      {(
                        result.alt_norm[0] ** 2 +
                        result.alt_norm[1] ** 2 +
                        result.alt_norm[2] ** 2
                      ).toFixed(5)}{" "}
                      ) ={" "}
                      <span style={{ color: "#10b981" }}>
                        {result.magnitude_alt.toFixed(6)}
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Langkah III */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 2, color: "text.secondary" }}
              >
                LANGKAH III: PEMBAGIAN NILAI & HASIL DERAJAT KESAMAAN
              </Typography>
              <Card
                sx={{ bgcolor: "#059669", color: "white", borderRadius: 2 }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      opacity: 0.9,
                    }}
                  >
                    <span>✨</span> Hasil Perhitungan Content-Based Filtering
                    (CBF):
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontFamily: "monospace", fontWeight: "bold", mb: 3 }}
                  >
                    Similarity = {result.dot_product.toFixed(6)} / ({" "}
                    {result.magnitude_target.toFixed(4)} *{" "}
                    {result.magnitude_alt.toFixed(4)} ) ={" "}
                    <Box
                      component="span"
                      sx={{
                        bgcolor: "white",
                        color: "#059669",
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        ml: 1,
                      }}
                    >
                      {result.similarity.toFixed(6)}
                    </Box>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.9, lineHeight: 1.6 }}
                  >
                    Berdasarkan metode Content-Based Filtering (CBF), kedua
                    model kamera CCTV ini memiliki kecocokan karakteristik
                    sebesar{" "}
                    <strong>{(result.similarity * 100).toFixed(2)}%</strong>{" "}
                    (dengan metrik Cosine Similarity sebesar{" "}
                    {result.similarity.toFixed(4)}). Oleh karena itu, kamera{" "}
                    <strong>"{altProduct.product_name}"</strong> akan
                    diprioritaskan dalam perangkingan rekomendasi saat pembeli
                    memilih kamera{" "}
                    <strong>"{targetProduct.product_name}"</strong> sebagai
                    acuan produk.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
