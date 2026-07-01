import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Typography, Grid } from '@mui/material';
import { PrimaryButton } from '@/components/ui';
import SearchIcon from '@mui/icons-material/Search';

export const RecommendationFilter = () => {
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, mb: 4 }}>
      <CardContent sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
          Kriteria Rekomendasi
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Budget Maksimal (Rp)</InputLabel>
              <Select label="Budget Maksimal (Rp)" defaultValue="">
                <MenuItem value="1000000">Di bawah Rp 1.000.000</MenuItem>
                <MenuItem value="3000000">Rp 1.000.000 - Rp 3.000.000</MenuItem>
                <MenuItem value="5000000">Rp 3.000.000 - Rp 5.000.000</MenuItem>
                <MenuItem value="nolimit">Tidak Terbatas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Lokasi Pemasangan</InputLabel>
              <Select label="Lokasi Pemasangan" defaultValue="">
                <MenuItem value="indoor">Indoor (Dalam Ruangan)</MenuItem>
                <MenuItem value="outdoor">Outdoor (Luar Ruangan)</MenuItem>
                <MenuItem value="both">Keduanya</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Resolusi Minimal</InputLabel>
              <Select label="Resolusi Minimal" defaultValue="">
                <MenuItem value="720p">HD (720p)</MenuItem>
                <MenuItem value="1080p">Full HD (1080p)</MenuItem>
                <MenuItem value="2k">2K</MenuItem>
                <MenuItem value="4k">4K</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Kebutuhan Penyimpanan</InputLabel>
              <Select label="Kebutuhan Penyimpanan" defaultValue="">
                <MenuItem value="microsd">MicroSD Lokal</MenuItem>
                <MenuItem value="cloud">Cloud Storage</MenuItem>
                <MenuItem value="nvr">NVR / DVR</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Prioritas Fitur</InputLabel>
              <Select label="Prioritas Fitur" defaultValue="">
                <MenuItem value="night_vision">Night Vision</MenuItem>
                <MenuItem value="ptz">PTZ (Pan/Tilt/Zoom)</MenuItem>
                <MenuItem value="ai">AI Detection</MenuItem>
                <MenuItem value="audio">Two-way Audio</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <PrimaryButton startIcon={<SearchIcon />}>
            Cari Rekomendasi
          </PrimaryButton>
        </Box>
      </CardContent>
    </Card>
  );
};
