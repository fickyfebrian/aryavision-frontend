import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const Topbar = () => {
  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      className="border-b border-border bg-white"
      sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}
    >
      <Toolbar className="flex items-center justify-between px-6 py-2">
        <Box>
          <Typography variant="h6" className="font-bold text-gray-900">
            Overview
          </Typography>
        </Box>
        <Box className="flex items-center gap-4">
          {/* Empty right area */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
