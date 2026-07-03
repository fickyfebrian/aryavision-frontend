import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";

import CircularProgress from "@mui/material/CircularProgress";
import { Package, Tags, Award, TrendingUp, TrendingDown } from "lucide-react";
import { productService } from "@/services/product.service";

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    brand: 0,
    budget: 0,
    midRange: 0,
    premium: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await productService.getDashboardStats();
        setStats({
          total: res.total_products,
          brand: res.total_brands,
          budget: res.budget_cluster,
          midRange: res.mid_range_cluster,
          premium: res.premium_cluster,
        });
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data statistik");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box className="flex h-[400px] items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex h-[400px] items-center justify-center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const statCards = [
    {
      label: "Total Products",
      value: stats.total,
      icon: <Package size={24} className="text-blue-500" />,
      color: "bg-blue-50 border-blue-100",
    },
    {
      label: "Total Brands",
      value: stats.brand,
      icon: <Tags size={24} className="text-purple-500" />,
      color: "bg-purple-50 border-purple-100",
    },
    {
      label: "Budget Cluster",
      value: stats.budget,
      icon: <TrendingDown size={24} className="text-green-500" />,
      color: "bg-green-50 border-green-100",
    },
    {
      label: "Mid Range Cluster",
      value: stats.midRange,
      icon: <Award size={24} className="text-orange-500" />,
      color: "bg-orange-50 border-orange-100",
    },
    {
      label: "Premium Cluster",
      value: stats.premium,
      icon: <TrendingUp size={24} className="text-red-500" />,
      color: "bg-red-50 border-red-100",
    },
  ];

  return (
    <Box>
      <Typography variant="h4" className="mb-6 font-bold text-gray-900">
        Dashboard
      </Typography>

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
