import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import {
  Package,
  Tags,
  Award,
  TrendingUp,
  TrendingDown,
  Info,
} from "lucide-react";
import { useDashboardStats } from "./hooks/use-dashboard-stats";
import { useClusterSummary } from "./hooks/use-cluster-summary";
import { formatCurrency } from "@/utils/formatters/currency";

export const DashboardPage = () => {
  const { data: stats, isLoading, error } = useDashboardStats();
  const {
    data: clusterSummary,
    isLoading: isClusterLoading,
    error: clusterError,
  } = useClusterSummary();

  if (isLoading) {
    return (
      <Box className="flex h-[400px] items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stats) {
    return (
      <Box className="flex h-[400px] items-center justify-center">
        <Typography color="error">
          {error instanceof Error
            ? error.message
            : "Gagal mengambil data statistik"}
        </Typography>
      </Box>
    );
  }

  const statCards = [
    {
      label: "Total Products",
      value: stats.total_products,
      icon: <Package size={24} className="text-blue-500" />,
      color: "bg-blue-50 border-blue-100",
    },
    {
      label: "Total Brands",
      value: stats.total_brands,
      icon: <Tags size={24} className="text-purple-500" />,
      color: "bg-purple-50 border-purple-100",
    },
    {
      label: "Budget Cluster",
      value: stats.budget_cluster,
      icon: <TrendingDown size={24} className="text-green-500" />,
      color: "bg-green-50 border-green-100",
    },
    {
      label: "Mid Range Cluster",
      value: stats.mid_range_cluster,
      icon: <Award size={24} className="text-orange-500" />,
      color: "bg-orange-50 border-orange-100",
    },
    {
      label: "Premium Cluster",
      value: stats.premium_cluster,
      icon: <TrendingUp size={24} className="text-red-500" />,
      color: "bg-red-50 border-red-100",
    },
  ];

  return (
    <Box>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i}>
            <Card
              className={`p-6 border shadow-sm ${stat.color} transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <Typography
                    variant="body2"
                    className="text-gray-600 font-medium mb-1"
                  >
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
          </div>
        ))}
      </div>

      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
          Cluster Summary
        </Typography>

        {isClusterLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} sx={{ p: 3, borderRadius: 2 }}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton
                  variant="text"
                  width="40%"
                  height={24}
                  sx={{ mb: 2 }}
                />
                <Divider sx={{ my: 2 }} />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="90%" />
              </Card>
            ))}
          </div>
        ) : clusterError || !clusterSummary || clusterSummary.length === 0 ? (
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
              Silakan lakukan Retrain Model pada manajemen Machine Learning.
            </Typography>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clusterSummary.map((cluster) => {
              // Menyesuaikan warna berdasarkan label
              let colorClass = "bg-green-50 border-green-200 text-green-700";
              if (cluster.label.toLowerCase() === "mid range")
                colorClass = "bg-orange-50 border-orange-200 text-orange-700";
              if (cluster.label.toLowerCase() === "premium")
                colorClass = "bg-red-50 border-red-200 text-red-700";

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
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {cluster.label}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    color="primary"
                    sx={{ fontWeight: "bold", mb: 2 }}
                  >
                    {cluster.total_product}{" "}
                    <Typography
                      component="span"
                      variant="body1"
                      color="text.secondary"
                    >
                      Produk
                    </Typography>
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Rata-rata Harga
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {formatCurrency(cluster.average_price)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Rata-rata Rating
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {cluster.average_rating.toFixed(2)} ⭐
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Rata-rata Terjual
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {Math.round(cluster.average_sold)} Pcs
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </div>
        )}
      </Box>
    </Box>
  );
};
