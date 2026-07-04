import { useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useState, useEffect } from "react";

export const Topbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [time, setTime] = useState(new Date());

  let title = "Dashboard";
  let subtitle = "Monitor overall system performance.";

  if (path.includes("/admin/products")) {
    title = "Manage Products";
    subtitle = "Manage CCTV catalog, filtering, and product information.";
  }

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = time.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

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
          <Typography variant="body2" className="text-gray-500 hidden md:block">
            {currentDate}
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            {currentTime}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
