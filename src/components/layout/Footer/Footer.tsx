import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AppContainer } from '../../ui';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className="mt-auto border-t border-border bg-white py-6">
      <AppContainer>
        <Box className="flex flex-col items-center justify-center text-center">
          <Typography variant="body2" color="text.secondary">
            &copy; {currentYear} Aryavision. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary" className="mt-1">
            Sistem Rekomendasi Produk CCTV
          </Typography>
        </Box>
      </AppContainer>
    </Box>
  );
};
