import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { AppContainer } from '../../ui/AppContainer';

export const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'common.white', pt: 8, pb: 4 }}>
      <AppContainer>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              AryaVision
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.400', lineHeight: 1.6, pr: { md: 4 } }}>
              Sistem rekomendasi pintar yang membantu Anda menemukan dan merancang solusi CCTV terbaik sesuai kebutuhan spesifik Anda.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Tautan Singkat
            </Typography>
            <Stack spacing={1.5}>
              <Typography variant="body2" sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'common.white' } }}>
                Beranda
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'common.white' } }}>
                Katalog Produk
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'common.white' } }}>
                Cara Kerja
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'common.white' } }}>
                Tentang Kami
              </Typography>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Kontak
            </Typography>
            <Stack spacing={1.5}>
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                support@aryavision.com
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                +62 811-1234-5678
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                Gedung Cyber, Lt. 12<br />
                Jakarta Selatan, 12710
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ borderTop: 1, borderColor: 'grey.800', pt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'grey.500' }}>
            &copy; {new Date().getFullYear()} AryaVision. Hak Cipta Dilindungi.
          </Typography>
        </Box>
      </AppContainer>
    </Box>
  );
};
