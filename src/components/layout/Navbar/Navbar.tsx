import { useState } from 'react';
import { NavLink, Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { Menu as MenuIcon, Camera } from 'lucide-react';
import { AppContainer } from '../../ui';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Catalog', path: '/catalog' },
  { label: 'Recommendation', path: '/recommendation' },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} className="text-center">
      <Typography variant="h6" className="my-4 font-bold text-blue-600">
        Aryavision
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={NavLink} to={item.path} className="text-center">
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding className="mt-4">
          <ListItemButton component={NavLink} to="/admin/login" className="text-center text-blue-600">
            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>Login</Typography>} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={0} className="border-b border-border bg-white">
      <AppContainer>
        <Toolbar disableGutters className="flex items-center justify-between py-2">
          {/* Logo */}
          <Box component={RouterLink} to="/" className="flex items-center gap-2 text-blue-600 no-underline">
            <Camera size={28} />
            <Typography variant="h6" className="hidden font-bold sm:block">
              Aryavision
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={NavLink}
                to={item.path}
                sx={{
                  color: 'text.secondary',
                  '&.active': { color: 'primary.main', fontWeight: 600 },
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              component={NavLink}
              to="/admin/login"
              variant="outlined"
              color="primary"
              className="ml-4"
              sx={{ borderRadius: '8px' }}
            >
              Login
            </Button>
          </Box>

          {/* Mobile Navigation Toggle */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            className="md:hidden"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppContainer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};
