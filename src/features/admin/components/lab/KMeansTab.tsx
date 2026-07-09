import React from 'react';
import { 
  Box, 
  Typography, 
  Card,
  Grid,
  CardContent, 
  Tooltip as MuiTooltip
} from '@mui/material';
import { formatCurrency } from '@/utils/formatters/currency';

interface KMeansTabProps {
  clusters: {
    cluster_id: number;
    label: string;
    total_product: number;
    average_price: number;
    min_price: number;
    max_price: number;
    average_rating: number;
    average_sold: number;
  }[];
  cleaned_products: any[];
}

export const KMeansTab: React.FC<KMeansTabProps> = ({ clusters, cleaned_products }) => {
  const getClusterDescription = (label: string) => {
    const l = label.toLowerCase();
    if (l === "budget")
      return "CCTV dengan harga terjangkau (Budget Segment) yang ramah di kantong konsumen.";
    if (l === "mid range")
      return "CCTV kelas menengah (Mid-Range) dengan perbandingan spesifikasi dan harga yang seimbang.";
    if (l === "premium")
      return "CCTV berteknologi tinggi kelas atas (Premium Segment) dengan fitur lengkap dan resolusi ultra tinggi.";
    return "Segmen klaster CCTV.";
  };

  const renderSpectrum = () => {
    if (!cleaned_products || cleaned_products.length === 0) return null;

    const globalMin = Math.min(...cleaned_products.map((p) => p.price));
    const globalMax = Math.max(...cleaned_products.map((p) => p.price));
    const range = globalMax - globalMin || 1;

    const getLeftPercent = (price: number) => {
      const p = ((price - globalMin) / range) * 100;
      return Math.max(0, Math.min(100, p));
    };

    const getClusterColor = (clusterId: number) => {
      if (clusterId === 0) return "bg-green-500";
      if (clusterId === 1) return "bg-blue-500";
      if (clusterId === 2) return "bg-orange-500";
      return "bg-gray-500";
    };

    const getClusterLabel = (clusterId: number) => {
      if (clusterId === 0) return "Budget";
      if (clusterId === 1) return "Mid Range";
      if (clusterId === 2) return "Premium";
      return "Unknown";
    };

    return (
      <Card variant="outlined" sx={{ p: 4, mt: 4, borderRadius: 2, overflow: "visible" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#4f46e5' }}>
          <span>📊</span> VISUALISASI SEBARAN DATA UJI & BATAS SEGMENTASI CLUSTER (1D SPECTRUM)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 6 }}>
          Grafik interaktif di bawah ini memetakan seluruh produk CCTV (data pengujian) di sepanjang garis lurus spektrum harga dari harga terendah ke harga tertinggi. Posisi bulatan menunjukkan harga relatif CCTV, sedangkan warna melambangkan kelompok klaster hasil kalkulasi K-Means.
        </Typography>

        <Box sx={{ position: "relative", width: "100%", height: "80px", mt: 6, mb: 4 }}>
          {/* Garis Axis */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "6px",
              bgcolor: "grey.200",
              borderRadius: "4px",
              transform: "translateY(-50%)",
            }}
          />

          {/* Render Products */}
          {cleaned_products.map((p) => {
            const left = getLeftPercent(p.price);
            return (
              <MuiTooltip
                key={`p-${p.id}`}
                title={
                  <div className="flex flex-col gap-1 text-sm">
                    <strong>{p.product_name}</strong>
                    <span>Harga: {formatCurrency(p.price)}</span>
                    <span>Rating: {p.rating} ⭐</span>
                    <span>Segmen: {getClusterLabel(p.cluster)}</span>
                  </div>
                }
                arrow
                placement="top"
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: `${left}%`,
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    opacity: 0.8,
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 1,
                      zIndex: 10,
                      transform: "translate(-50%, -50%) scale(1.5)",
                    },
                    transition: "all 0.2s",
                  }}
                  className={`${getClusterColor(p.cluster)} border-2 border-white shadow-sm`}
                />
              </MuiTooltip>
            );
          })}

          {/* Render Centroids */}
          {clusters.map((c) => {
            const left = getLeftPercent(c.average_price);
            const colorId = c.cluster_id;
            const colorHex = colorId === 0 ? '#22c55e' : colorId === 1 ? '#3b82f6' : '#f97316';
            
            return (
              <Box
                key={`c-${c.cluster_id}`}
                sx={{
                  position: "absolute",
                  left: `${left}%`,
                  top: "50%",
                  transform: "translate(-50%, 15px)",
                  zIndex: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ width: 2, height: 15, bgcolor: colorHex, mb: 0.5 }} />
                <Box sx={{ 
                  border: `1px solid ${colorHex}`, 
                  borderRadius: 1, 
                  px: 1, 
                  py: 0.5, 
                  bgcolor: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  color: colorHex,
                  whiteSpace: 'nowrap'
                }}>
                  🚩 Centroid {c.cluster_id + 1}: {formatCurrency(c.average_price)}
                </Box>
              </Box>
            );
          })}

          {/* Axis Labels */}
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              left: 0,
              top: "calc(50% - 25px)",
              fontWeight: "bold",
              color: "text.secondary"
            }}
          >
            Harga Terendah: {formatCurrency(globalMin)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              right: 0,
              top: "calc(50% - 25px)",
              fontWeight: "bold",
              color: "text.secondary"
            }}
          >
            Harga Tertinggi: {formatCurrency(globalMax)}
          </Typography>
        </Box>
        
        {/* Empiris Boxes */}
        <Grid container spacing={2} sx={{ mt: 6 }}>
          {clusters.map(c => {
             const colorId = c.cluster_id;
             const colorHex = colorId === 0 ? '#22c55e' : colorId === 1 ? '#3b82f6' : '#f97316';
             const bgHex = colorId === 0 ? '#f0fdf4' : colorId === 1 ? '#eff6ff' : '#fff7ed';
             
             return (
               <Grid size={{ xs: 12, md: 4 }} key={c.cluster_id}>
                 <Box sx={{ border: `1px solid ${colorHex}`, borderRadius: 2, p: 2, bgcolor: bgHex }}>
                   <Typography variant="subtitle2" sx={{ color: colorHex, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                     <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: colorHex }} />
                     EMPIRIS CLUSTER {c.cluster_id + 1} ({c.label.toUpperCase()})
                   </Typography>
                   <Box component="ul" sx={{ mt: 1, pl: 3, m: 0, '& li': { fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 } }}>
                     <li>Batas Bawah: <strong>{formatCurrency(c.min_price)}</strong></li>
                     <li>Batas Atas: <strong>{formatCurrency(c.max_price)}</strong></li>
                     <li>Total Data: <strong>{c.total_product} CCTV</strong></li>
                   </Box>
                 </Box>
               </Grid>
             );
          })}
        </Grid>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header Info */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#64748b' }} gutterBottom>
            TAHAP 3: PEMETAAN K-MEANS CLUSTERING BERBASIS HARGA (1D)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sesuai dengan pembaruan metodologi, algoritma <strong>K-Means Clustering</strong> pada skripsi ini dijalankan secara <strong>1 Dimensi (1D)</strong> dengan fokus variabel utama <strong>Harga (Price)</strong>. Hal ini bertujuan untuk mengelompokkan katalog CCTV secara objektif menjadi 3 tingkatan segmen pasar: <strong>Budget</strong>, <strong>Mid Range</strong>, dan <strong>Premium</strong>.
          </Typography>
          <Card variant="outlined" sx={{ borderRadius: 2, p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Mengapa Menggunakan 1D Clustering berbasis Harga?</Typography>
            <Typography variant="body2" color="text.secondary">
              Harga merupakan penentu utama keputusan pembelian (budgeting) konsumen. K-Means 1D secara matematis memetakan batas pengelompokan harga optimal tanpa intervensi bias manusia. Atribut lainnya seperti <strong>Rating</strong> dan <strong>Terjual (Popularitas)</strong> tetap dihitung rata-ratanya pada setiap kelompok klaster sebagai data statistik profil pendukung.
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 2, height: '100%', border: '1px solid', borderColor: '#e0e7ff', bgcolor: '#f8fafc' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#4f46e5', display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>🧬</span> ALUR 5 LANGKAH K-MEANS 1D:
              </Typography>
              <Box component="ol" sx={{ pl: 2, m: 0, '& li': { fontSize: '0.75rem', color: 'text.secondary', mb: 1 } }}>
                <li>Tentukan jumlah klaster (k = 3).</li>
                <li>Inisiasi 3 centroid awal pada variabel harga ternormalisasi.</li>
                <li>Hitung selisih mutlak harga tiap CCTV ke masing-masing centroid.</li>
                <li>Kelompokkan CCTV ke segmen centroid yang memiliki jarak terkecil.</li>
                <li>Hitung ulang rata-rata harga kelompok sebagai centroid baru, ulangi hingga konvergen stabil.</li>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {renderSpectrum()}

      {/* Cluster Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {clusters.map((cluster) => {
          const colorId = cluster.cluster_id;
          
          const titleColor = colorId === 0 ? "text-green-600" : colorId === 1 ? "text-blue-600" : "text-orange-600";
          const bgHeader = colorId === 0 ? "#f0fdf4" : colorId === 1 ? "#eff6ff" : "#fff7ed";

          const clusterProducts = cleaned_products.filter((p) => p.cluster === cluster.cluster_id) || [];

          return (
            <Card
              key={cluster.cluster_id}
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderTop: 4,
                borderColor: colorId === 0 ? '#22c55e' : colorId === 1 ? '#3b82f6' : '#f97316',
                display: "flex",
                flexDirection: "column",
                overflow: 'hidden'
              }}
            >
              <Box sx={{ p: 2, bgcolor: bgHeader, borderBottom: '1px solid', borderColor: 'grey.200', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: titleColor }}>
                  {cluster.label.toUpperCase()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Centroid Stat</Typography>
              </Box>
              
              <Box sx={{ p: 3, flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                  Cluster {cluster.cluster_id + 1}: Segmen {cluster.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 3, lineHeight: 1.4 }}>
                  {getClusterDescription(cluster.label)}
                </Typography>
                
                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, mb: 3 }}>
                   <Typography variant="subtitle2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: titleColor }}>
                     <span>🚩</span> Pusat Harga: {formatCurrency(cluster.average_price)}
                   </Typography>
                   <Box component="ul" sx={{ mt: 1, pl: 4, m: 0, '& li': { fontSize: '0.7rem', color: 'text.secondary' } }}>
                     <li>Rerata Rating: ★ {cluster.average_rating.toFixed(2)}</li>
                     <li>Rerata Terjual: {cluster.average_sold.toFixed(1)} unit</li>
                   </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", fontSize: "0.8rem" }}>
                    Anggota Produk:
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", fontSize: "0.8rem" }}>
                    {cluster.total_product} CCTV
                  </Typography>
                </Box>
                
                <Box
                  sx={{
                    maxHeight: "160px",
                    overflowY: "auto",
                    border: "1px solid",
                    borderColor: "grey.200",
                    borderRadius: 1,
                    bgcolor: "grey.50",
                    "&::-webkit-scrollbar": { width: "6px" },
                    "&::-webkit-scrollbar-thumb": {
                      bgcolor: "grey.300",
                      borderRadius: "4px",
                    },
                  }}
                >
                  {clusterProducts.map((p, idx) => (
                    <Box
                      key={p.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 1.5,
                        borderBottom: idx < clusterProducts.length - 1 ? "1px solid" : "none",
                        borderColor: "grey.200",
                        "&:hover": { bgcolor: "white" },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>
                        {p.product_name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                        {formatCurrency(p.price)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Card>
          );
        })}
      </div>

    </Box>
  );
};
