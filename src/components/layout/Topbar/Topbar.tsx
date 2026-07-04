import { useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { RetrainModelDialog } from "@/features/admin/components/RetrainModelDialog";
import { useMLStatus } from "@/features/admin/hooks/use-retrain-model";
import { formatDate, formatTime, formatDateTime } from "@/utils/dateFormatter";

export const Topbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [time, setTime] = useState(new Date());
  const [retrainOpen, setRetrainOpen] = useState(false);

  // Mengambil status model ML dari backend
  const { data: mlStatusResponse } = useMLStatus();
  const mlStatus = mlStatusResponse?.data;

  let title = "Dashboard";
  let subtitle = "Monitor overall system performance.";

  if (path.includes("/admin/products")) {
    title = "Manage Products";
    subtitle = "Manage CCTV catalog, filtering, and product information.";
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
      <Toolbar className="flex items-start justify-between px-6 py-4 min-h-[80px]">
        {/* Left Side: Titles and Breadcrumb */}
        <Box className="flex flex-col gap-1">
          <Breadcrumbs
            aria-label="breadcrumb"
            className="text-xs text-gray-400 mb-1"
          >
            <Typography
              color="inherit"
              className="text-xs hover:underline cursor-pointer"
            >
              Admin
            </Typography>
            <Typography color="text.primary" className="text-xs font-medium">
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
          <Box className="hidden lg:flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3">
            <Box className="flex flex-col">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${mlStatus?.needs_retrain ? "bg-orange-500" : "bg-green-500"}`}
                ></span>
                <Typography
                  variant="caption"
                  className="font-semibold text-gray-700"
                >
                  {mlStatus?.needs_retrain ? "Needs Retrain" : "Engine Ready"}
                </Typography>
              </div>
              <Typography
                variant="caption"
                className="text-gray-400 text-[10px]"
              >
                Last Retrained:{" "}
                {mlStatus?.last_trained_at
                  ? formatDateTime(mlStatus.last_trained_at)
                  : "Belum pernah"}
              </Typography>
            </Box>
            <Button
              size="small"
              variant="outlined"
              color={mlStatus?.needs_retrain ? "warning" : "primary"}
              className="py-1 px-3 text-xs bg-white"
              onClick={() => setRetrainOpen(true)}
              disabled={!mlStatus?.needs_retrain}
            >
              🧠 Retrain
            </Button>
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
