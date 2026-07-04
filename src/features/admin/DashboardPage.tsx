import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import { Package, Tags, Award, TrendingUp, TrendingDown } from "lucide-react";
import { useDashboardStats } from "./hooks/use-dashboard-stats";

export const DashboardPage = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

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
          {error instanceof Error ? error.message : "Gagal mengambil data statistik"}
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
    </Box>
  );
};
