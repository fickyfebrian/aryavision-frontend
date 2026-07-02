import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

const dummySpecs = [
  { label: 'Resolusi', value: '1080p Full HD' },
  { label: 'Konektivitas', value: 'Wi-Fi 2.4GHz' },
  { label: 'Penyimpanan', value: 'MicroSD hingga 128GB' },
  { label: 'Night Vision', value: 'Ya, hingga 10 meter' },
  { label: 'Audio', value: 'Two-way audio' },
  { label: 'Power', value: '5V/1A USB' },
];

export const ProductSpecs = () => {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Spesifikasi Produk
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
        <Table sx={{ minWidth: 250 }} aria-label="spesifikasi produk">
          <TableBody>
            {dummySpecs.map((spec, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ width: '40%', fontWeight: 500, bgcolor: 'grey.50' }}>
                  {spec.label}
                </TableCell>
                <TableCell>{spec.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
