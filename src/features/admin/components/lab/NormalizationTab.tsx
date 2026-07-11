import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

interface NormalizationTabProps {
  bounds: {
    price: { min: number; max: number };
    rating: { min: number; max: number };
    sales: { min: number; max: number };
  };
  cleaned_products: any[];
  normalized_products: any[];
}

export const NormalizationTab: React.FC<NormalizationTabProps> = ({ bounds, cleaned_products, normalized_products }) => {
  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header Info */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#64748b' }} gutterBottom>
            TAHAP 2: MIN-MAX NORMALIZATION (SKALA MURNI [0, 1])
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Rentang nilai antar atribut sangat berbeda jauh. Contoh: <strong>Harga</strong> bernilai ratusan ribu hingga jutaan rupiah, sedangkan <strong>Rating</strong> hanya bernilai 1.0 sampai 5.0, dan <strong>Terjual</strong> berkisar 1 sampai 150.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tahap normalisasi ini ditujukan khusus untuk metode <strong>Content-Based Filtering (CBF)</strong>. Bila tidak dinormalisasi, atribut Harga akan membiaskan hitungan kemiripan Cosine (Cosine Similarity) karena angkanya jauh lebih besar dibanding Rating dan Terjual! Oleh karena itu, seluruh atribut disetarakan rentangnya menjadi 0 sampai 1 dengan formula di samping.
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ bgcolor: '#4f46e5', color: 'white', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, opacity: 0.9 }}>
                FORMULA NORMALISASI ATRIBUT
              </Typography>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 1, textAlign: 'center', mb: 2 }}>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                  X_norm = (X - X_min) / (X_max - X_min)
                </Typography>
              </Box>
              <Box component="ul" sx={{ m: 0, pl: 2, '& li': { fontSize: '0.75rem', opacity: 0.8, mb: 0.5 } }}>
                <li><strong>X</strong>: Nilai asli atribut kamera CCTV</li>
                <li><strong>X_min</strong>: Nilai terendah pada dataset bersih</li>
                <li><strong>X_max</strong>: Nilai tertinggi pada dataset bersih</li>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bounds Cards */}
      <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: 'grey.50' }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'error.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>🎯</span> NILAI EKSTREM PENJURU BATAS BATAS BOUNDS SAAT INI:
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>ATRIBUT HARGA (C₁)</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Min: <strong>Rp {bounds.price.min.toLocaleString('id-ID')}</strong></Typography>
                <Typography variant="body2">Max: <strong>Rp {bounds.price.max.toLocaleString('id-ID')}</strong></Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>ATRIBUT RATING (C₂)</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Min: <strong>★ {bounds.rating.min.toFixed(1)}</strong></Typography>
                <Typography variant="body2">Max: <strong>★ {bounds.rating.max.toFixed(1)}</strong></Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>ATRIBUT POPULARITAS (C₃)</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Min: <strong>{bounds.sales.min} unit terjual</strong></Typography>
                <Typography variant="body2">Max: <strong>{bounds.sales.max} unit terjual</strong></Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tables Comparison */}
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200', bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>📊</span> HASIL DATA NORMALISASI ATRIBUT YANG SIAP DIPAKAI
          </Typography>
        </Box>
        <TableContainer sx={{ maxHeight: 500, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'text.secondary' }}>JUDUL CCTV</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'text.secondary' }}>HARGA ASLI ➡ NORMAL [0, 1]</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'text.secondary' }}>RATING ASLI ➡ NORMAL [0, 1]</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'text.secondary' }}>POPULARITAS ➡ NORMAL [0, 1]</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cleaned_products.slice(0, 50).map((row, index) => {
                const norm = normalized_products.find(n => n.id === row.id);
                return (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontSize: '0.75rem', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {row.product_name}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>
                      Rp {row.price.toLocaleString('id-ID')} ➡ <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#4f46e5' }}>{norm?.priceNorm.toFixed(4)}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>
                      ★ {row.rating.toFixed(1)} ➡ <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#16a34a' }}>{norm?.ratingNorm.toFixed(4)}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>
                      {row.sold} unit ➡ <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ea580c' }}>{norm?.salesNorm.toFixed(4)}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};
