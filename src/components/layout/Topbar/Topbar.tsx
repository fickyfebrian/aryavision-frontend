import { useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Bell } from "lucide-react";

export const Topbar = () => {
  const location = useLocation();
  const path = location.pathname;

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
          <Breadcrumbs aria-label="breadcrumb" className="text-xs text-gray-400 mb-1">
            <Typography color="inherit" className="text-xs hover:underline cursor-pointer">Admin</Typography>
            <Typography color="text.primary" className="text-xs font-medium">{title}</Typography>
          </Breadcrumbs>
          <Typography variant="h5" className="font-bold text-gray-900 tracking-tight leading-none">
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
          
          <IconButton size="small" className="text-gray-500 hover:text-gray-900 transition-colors">
            <Badge badgeContent={3} color="error" variant="dot">
              <Bell size={20} />
            </Badge>
          </IconButton>
          
          <Box className="flex items-center gap-3 border-l border-gray-200 pl-6">
            <Box className="flex flex-col items-end hidden sm:flex">
              <Typography variant="subtitle2" className="font-semibold text-gray-900 leading-tight">
                Administrator
              </Typography>
              <Box className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <Typography variant="caption" className="text-gray-500 leading-tight">
                  Online
                </Typography>
              </Box>
            </Box>
            <Avatar 
              alt="Admin" 
              src="https://i.pravatar.cc/150?u=admin" 
              sx={{ width: 40, height: 40, border: '2px solid #fff', boxShadow: '0 0 0 1px #e5e7eb' }}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

