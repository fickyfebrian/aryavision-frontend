import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { LayoutDashboard, Package, Camera } from 'lucide-react';

const DRAWER_WIDTH = 256;

const menuItems = [
  { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
  { label: 'Products', path: '/admin/products', icon: <Package size={20} /> },
];

export const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          borderRight: '1px solid #E5E7EB',
        },
      }}
    >
      <Box className="flex items-center gap-2 border-b border-border p-6">
        <Camera size={28} className="text-blue-600" />
        <Typography variant="h6" className="font-bold text-gray-900">
          Admin Panel
        </Typography>
      </Box>

      <Box className="flex-1 overflow-auto py-4">
        <List className="px-3">
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding className="mb-1">
              <ListItemButton
                component={NavLink}
                to={item.path}
                end={item.exact}
                sx={{
                  borderRadius: '8px',
                  '&.active': {
                    backgroundColor: 'rgba(29, 78, 216, 0.08)', // primary light
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 500 }}>{item.label}</Typography>}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
