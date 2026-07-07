import { useLocation, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { RetrainModelDialog } from "@/features/admin/components/RetrainModelDialog";
import { useMLStatus } from "@/features/admin/hooks/use-retrain-model";
import { useDashboardStats } from "@/features/admin/hooks/use-dashboard-stats";
import { formatDate, formatTime } from "@/utils/dateFormatter";

export const Topbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [time, setTime] = useState(new Date());
  const [retrainOpen, setRetrainOpen] = useState(false);

  // Mengambil status model ML dan Dashboard Stats dari backend
  const { data: mlStatusResponse } = useMLStatus();
  const mlStatus = mlStatusResponse?.data;
  const { data: dashboardStats } = useDashboardStats();

  let title = "Dashboard";
  let subtitle = "Pantau performa sistem secara keseluruhan.";

  if (path.includes("/admin/products")) {
    title = "Manajemen Produk";
    subtitle = "Kelola katalog CCTV, pemfilteran, dan informasi produk.";
  }

  const currentDate = formatDate(new Date());
  const currentTime = formatTime(time);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      className="border-b border-border bg-white"
      sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}
    >
      <Toolbar className="flex items-start justify-between px-6 py-4 min-h-20 bg-primary/10">
        {/* Left Side: Titles and Breadcrumb */}
        <Box className="flex flex-col gap-1">
          <Breadcrumbs
            aria-label="breadcrumb"
            className="text-xs text-gray-400 mb-1"
            separator="›"
          >
            <Link
              to="/admin"
              className="hover:underline cursor-pointer text-inherit no-underline"
            >
              Admin
            </Link>
            <Typography
              color="text.primary"
              className="text-xs text-inherit no-underline"
            >
              {title}
            </Typography>
          </Breadcrumbs>
          <Typography
            variant="h5"
            className="font-bold text-gray-900 tracking-tight leading-none"
          >
            {title}
          </Typography>
          <Typography variant="body2" className="text-gray-500 mt-1">
            {subtitle}
          </Typography>
        </Box>

        {/* Right Side: Admin Info & Actions */}
        <Box className="flex items-center gap-6 self-center">
          {/* Recommendation Engine Widget */}
          <Box className="hidden xl:flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-4 shadow-sm h-24">
            {/* Column 1: Status & Version & Dataset */}
            <Box className="flex flex-col min-w-32.5 gap-0.5 border-r border-gray-200 pr-4 h-full justify-center">
              <div className="flex items-center justify-between gap-3">
                <Typography
                  variant="caption"
                  className="text-gray-500 text-[11px] font-medium leading-none"
                >
                  Status
                </Typography>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${mlStatus?.needs_retrain ? "bg-orange-500" : "bg-green-500"}`}
                  ></span>
                  <Typography
                    variant="caption"
                    className={`font-bold text-[11px] leading-none ${mlStatus?.needs_retrain ? "text-orange-600" : "text-green-600"}`}
                  >
                    {mlStatus?.needs_retrain ? "Butuh Latih Ulang" : "Siap"}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 mt-1">
                <Typography
                  variant="caption"
                  className="text-gray-500 text-[11px] font-medium leading-none"
                >
                  Versi
                </Typography>
                <Typography
                  variant="caption"
                  className="font-bold text-[11px] text-gray-700 leading-none"
                >
                  {mlStatus?.model_version || "v1.0"}
                </Typography>
              </div>
              <div className="flex items-center justify-between gap-3 mt-1">
                <Typography
                  variant="caption"
                  className="text-gray-500 text-[11px] font-medium leading-none"
                >
                  Dataset
                </Typography>
                <Typography
                  variant="caption"
                  className="font-bold text-[11px] text-gray-700 leading-none"
                >
                  {dashboardStats?.total_products || 0}
                </Typography>
              </div>
            </Box>

            {/* Column 2: Clusters */}
            <Box className="flex flex-col min-w-[110px] gap-0.5 border-r border-gray-200 pr-4 h-full justify-center">
              <div className="flex items-center justify-between gap-3">
                <Typography
                  variant="caption"
                  className="text-gray-500 text-[11px] font-medium leading-none"
                >
                  Budget
                </Typography>
                <Typography
                  variant="caption"
                  className="font-bold text-[11px] text-gray-700 leading-none"
                >
                  {dashboardStats?.budget_cluster || 0}
                </Typography>
              </div>
              <div className="flex items-center justify-between gap-3 mt-1">
                <Typography
                  variant="caption"
                  className="text-gray-500 text-[11px] font-medium leading-none"
                >
                  Mid Range
                </Typography>
                <Typography
                  variant="caption"
                  className="font-bold text-[11px] text-gray-700 leading-none"
                >
                  {dashboardStats?.mid_range_cluster || 0}
                </Typography>
              </div>
              <div className="flex items-center justify-between gap-3 mt-1">
                <Typography
                  variant="caption"
                  className="text-gray-500 text-[11px] font-medium leading-none"
                >
                  Premium
                </Typography>
                <Typography
                  variant="caption"
                  className="font-bold text-[11px] text-gray-700 leading-none"
                >
                  {dashboardStats?.premium_cluster || 0}
                </Typography>
              </div>
            </Box>

            {/* Column 3: Last Trained */}
            <Box className="flex flex-col min-w-[100px] h-full justify-center py-0.5">
              <Typography
                variant="caption"
                className="text-gray-500 text-[11px] font-medium block leading-none mb-1"
              >
                Terakhir Dilatih
              </Typography>
              <Typography
                variant="caption"
                className="font-bold text-[11px] text-gray-700 block leading-tight"
              >
                {mlStatus?.last_trained_at ? (
                  <>
                    {formatDate(new Date(mlStatus.last_trained_at))} <br />
                    {formatTime(new Date(mlStatus.last_trained_at))}
                  </>
                ) : (
                  "Belum pernah"
                )}
              </Typography>
            </Box>

            {/* Column 4: Actions */}
            <Box className="h-full flex items-center border-l border-gray-200 pl-4">
              <Button
                size="small"
                variant={mlStatus?.needs_retrain ? "contained" : "outlined"}
                color={mlStatus?.needs_retrain ? "warning" : "primary"}
                className={`py-1 px-3 text-[11px] whitespace-nowrap ${!mlStatus?.needs_retrain ? "bg-white" : "shadow-none"}`}
                onClick={() => setRetrainOpen(true)}
                disabled={!mlStatus?.needs_retrain}
                disableElevation
              >
                🧠 Latih Ulang Model
              </Button>
            </Box>
          </Box>

          <Box className="flex items-center gap-4 border-l border-gray-200 pl-6">
            <Typography
              variant="body2"
              className="text-gray-500 hidden md:block"
            >
              {currentDate}
            </Typography>
            <Typography variant="body2" className="text-gray-500 w-[60px]">
              {currentTime}
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <RetrainModelDialog
        open={retrainOpen}
        onClose={() => setRetrainOpen(false)}
      />
    </AppBar>
  );
};
