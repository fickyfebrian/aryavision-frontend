import { Box, Typography } from '@mui/material';

export const ProductDescription = () => {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Deskripsi Lengkap
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
        Pantau keamanan rumah atau tempat usaha Anda dengan CCTV cerdas ini. Dilengkapi dengan resolusi tinggi yang menghasilkan gambar tajam dan jelas, sehingga Anda tidak akan melewatkan detail penting apa pun.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        Fitur Night Vision memungkinkan pengawasan 24 jam penuh meski dalam kondisi gelap gulita. Dengan koneksi Wi-Fi yang stabil, Anda dapat mengakses pantauan langsung dari smartphone Anda kapan saja dan di mana saja.
      </Typography>
    </Box>
  );
};
