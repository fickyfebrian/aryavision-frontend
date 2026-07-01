import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { AppContainer } from '../../ui/AppContainer';
import { PrimaryButton } from '../../ui/PrimaryButton';

export const Navbar = () => {
  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'grey.200' }}>
      <AppContainer>
        <Toolbar disableGutters sx={{ height: 72, justifyContent: 'space-between' }}>
          {/* Logo Area */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              AryaVision
            </Typography>
          </Box>

          {/* Navigation Area */}
          <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Typography variant="body1" color="text.primary" sx={{ cursor: 'pointer', fontWeight: 500 }}>
              Beranda
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'text.primary' } }}>
              Produk
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'text.primary' } }}>
              Solusi
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'text.primary' } }}>
              Kontak
            </Typography>
          </Stack>

          {/* Action Area */}
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Button color="inherit" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
              Masuk
            </Button>
            <PrimaryButton>
              Konsultasi
            </PrimaryButton>
          </Stack>
        </Toolbar>
      </AppContainer>
    </AppBar>
  );
};
