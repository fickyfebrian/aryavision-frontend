import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";

import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { Info } from "lucide-react";
import { useClusterSummary } from "./hooks/use-cluster-summary";
import { formatCurrency } from "@/utils/formatters/currency";

export const DashboardPage = () => {
  const {
    data: clusterSummaryData,
    isLoading: isClusterLoading,
    error: clusterError,
  } = useClusterSummary();

  const renderSpectrum = () => {
    if (
      !clusterSummaryData ||
      !clusterSummaryData.products ||
      clusterSummaryData.products.length === 0
    )
      return null;

    const { clusters, products } = clusterSummaryData;

    // Find global min and max to calculate percentages
    const globalMin = Math.min(...products.map((p) => p.price));
    const globalMax = Math.max(...products.map((p) => p.price));
    const range = globalMax - globalMin || 1; // Prevent division by zero

    const getLeftPercent = (price: number) => {
      const p = ((price - globalMin) / range) * 100;
      // Keep it within 0-100 just in case
      return Math.max(0, Math.min(100, p));
    };

    const getClusterColor = (clusterId: number) => {
      // 0: Budget (green), 1: Mid (orange), 2: Premium (red)
      if (clusterId === 0) return "bg-green-500";
      if (clusterId === 1) return "bg-orange-500";
      if (clusterId === 2) return "bg-red-500";
      return "bg-gray-500";
    };

    const getClusterLabel = (clusterId: number) => {
      if (clusterId === 0) return "Budget";
      if (clusterId === 1) return "Mid Range";
      if (clusterId === 2) return "Premium";
      return "Unknown";
    };

    return (
      <Card sx={{ p: 4, mt: 6, borderRadius: 2, overflow: "visible" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Visualisasi Distribusi Spektrum Harga K-Means (1D)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 6 }}>
          Peta persebaran data produk secara empiris dari harga terendah hingga
          tertinggi. Bendera 🚩 menandakan pusat gravitasi (Centroid) dari
          masing-masing klaster.
        </Typography>

        <Box
          sx={{ position: "relative", width: "100%", height: "80px", mt: 4 }}
        >
          {/* Garis Axis */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "4px",
              bgcolor: "grey.300",
              borderRadius: "2px",
              transform: "translateY(-50%)",
            }}
          />

          {/* Render Products */}
          {products.map((p) => {
            const left = getLeftPercent(p.price);
            return (
              <Tooltip
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
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    opacity: 0.6,
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 1,
                      zIndex: 10,
                      transform: "translate(-50%, -50%) scale(1.8)",
                    },
                    transition: "all 0.2s",
                  }}
                  className={`${getClusterColor(p.cluster)} border border-white shadow-sm`}
                />
              </Tooltip>
            );
          })}

          {/* Render Centroids */}
          {clusters.map((c) => {
            const left = getLeftPercent(c.average_price);
            return (
              <Tooltip
                key={`c-${c.cluster_id}`}
                title={`Pusat Harga ${c.label} (${formatCurrency(c.average_price)})`}
                arrow
                placement="top"
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: `${left}%`,
                    top: "50%",
                    transform: "translate(-50%, -100%)",
                    fontSize: "24px",
                    cursor: "pointer",
                    zIndex: 20,
                    mt: "-12px",
                    "&:hover": {
                      transform: "translate(-50%, -100%) scale(1.2)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  🚩
                </Box>
              </Tooltip>
            );
          })}

          {/* Axis Labels */}
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              left: 0,
              top: "calc(50% + 24px)",
              fontWeight: "bold",
            }}
          >
            {formatCurrency(globalMin)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              right: 0,
              top: "calc(50% + 24px)",
              fontWeight: "bold",
            }}
          >
            {formatCurrency(globalMax)}
          </Typography>
        </Box>
      </Card>
    );
  };

  const getClusterDescription = (label: string) => {
    const l = label.toLowerCase();
    if (l === "budget")
      return "CCTV dengan harga terjangkau (Budget Segment) yang ramah di kantong konsumen.";
    if (l === "mid range")
      return "CCTV dengan keseimbangan optimal antara harga dan spesifikasi teknologi (Mid-Tier Segment).";
    if (l === "premium")
      return "CCTV berteknologi tinggi kelas atas (Premium Segment) dengan fitur lengkap dan resolusi ultra tinggi.";
    return "Segmen klaster CCTV.";
  };

  return (
    <Box>
      <Typography
        variant="h6"
        color="text.primary"
        sx={{ fontWeight: "bold", mb: 3 }}
      >
        Cluster summary
      </Typography>
      {isClusterLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} sx={{ p: 3, borderRadius: 2 }}>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
              <Divider sx={{ my: 2 }} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="90%" />
            </Card>
          ))}
        </div>
      ) : clusterError ||
        !clusterSummaryData ||
        !clusterSummaryData.clusters ||
        clusterSummaryData.clusters.length === 0 ? (
        <Card
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "grey.50",
            border: "1px dashed",
            borderColor: "grey.300",
          }}
        >
          <Info size={48} className="mx-auto text-gray-400 mb-4" />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Cluster summary belum tersedia.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Silakan lakukan Retrain Model pada bilah atas (topbar) untuk
            menghasilkan visualisasi empiris.
          </Typography>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {clusterSummaryData.clusters.map((cluster) => {
              // Menyesuaikan warna berdasarkan label
              let colorClass = "bg-green-50 border-green-200 text-green-700";
              if (cluster.label.toLowerCase() === "mid range")
                colorClass = "bg-orange-50 border-orange-200 text-orange-700";
              if (cluster.label.toLowerCase() === "premium")
                colorClass = "bg-red-50 border-red-200 text-red-700";

              // Filter products specific to this cluster
              const clusterProducts =
                clusterSummaryData.products?.filter(
                  (p) => p.cluster === cluster.cluster_id,
                ) || [];

              return (
                <Card
                  key={cluster.cluster_id}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    borderTop: 4,
                    borderColor: colorClass
                      .split(" ")[1]
                      .replace("border-", ""),
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {cluster.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5, lineHeight: 1.4 }}
                    >
                      {getClusterDescription(cluster.label)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    color="primary"
                    sx={{ fontWeight: "bold", mb: 2, mt: 1 }}
                  >
                    {cluster.total_product}{" "}
                    <Typography
                      component="span"
                      variant="body1"
                      color="text.secondary"
                    >
                      CCTV
                    </Typography>
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        • Batas Bawah
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {formatCurrency(cluster.min_price)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        • Batas Atas
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {formatCurrency(cluster.max_price)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        • Pusat Harga
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", color: "error.main" }}
                      >
                        {formatCurrency(cluster.average_price)} 🚩
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        • Rerata Rating
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {cluster.average_rating.toFixed(2)} ★
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        • Rerata Terjual
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {Math.round(cluster.average_sold)} unit
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      color: "text.secondary",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Daftar Produk
                  </Typography>
                  <Box
                    sx={{
                      flexGrow: 1,
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
                          borderBottom:
                            idx < clusterProducts.length - 1
                              ? "1px solid"
                              : "none",
                          borderColor: "grey.200",
                          "&:hover": { bgcolor: "grey.100" },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.8rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "60%",
                          }}
                        >
                          {p.product_name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.8rem",
                            color: "text.secondary",
                            fontWeight: 600,
                          }}
                        >
                          {formatCurrency(p.price)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Card>
              );
            })}
          </div>

          {renderSpectrum()}
        </>
      )}
    </Box>
  );
};
