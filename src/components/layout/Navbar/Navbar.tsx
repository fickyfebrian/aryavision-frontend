import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AppContainer } from "../../ui/AppContainer";
import logo from "@/assets/logo/logo-aryavision.png";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Beranda", path: "/" },
    { label: "Katalog", path: "/catalog" },
  ];

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "grey.200" }}
    >
      <AppContainer>
        <Toolbar
          disableGutters
          sx={{ height: 72, justifyContent: "space-between" }}
        >
          {/* Logo Area */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              gap: 1,
            }}
          >
            {/* 
              TODO: Ganti src dengan import file logo asli (contoh: import logo from '@/assets/logo/logo.png') 
              Area logo ini siap digunakan. Jika logo belum ada, akan dirender dengan fallback desain teks.
            */}
            <Box
              component="img"
              src={logo}
              alt="AryaVision Logo"
              sx={{
                height: 42,
                width: "auto",
              }}
              onError={(e) => {
                // Sembunyikan img jika gagal memuat
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </Box>

          {/* Navigation Area */}
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));
              return (
                <Typography
                  key={item.path}
                  variant="body1"
                  component={Link}
                  to={item.path}
                  color={isActive ? "primary.main" : "text.secondary"}
                  sx={{
                    textDecoration: "none",
                    fontWeight: isActive ? 600 : 500,
                    borderBottom: isActive ? "2px solid" : "none",
                    borderColor: "primary.main",
                    pb: 0.5,
                    cursor: "pointer",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {item.label}
                </Typography>
              );
            })}
          </Stack>

          {/* Action Area */}
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Button
              color="inherit"
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
              onClick={() => navigate("/admin/login")}
            >
              Login Admin
            </Button>
          </Stack>
        </Toolbar>
      </AppContainer>
    </AppBar>
  );
};
