import {
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Paper,
} from '@mui/material';

export const FilterSidebar = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: 2, height: 'fit-content' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>
        Kategori
      </Typography>
      <FormGroup sx={{ mb: 3 }}>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Semua CCTV" />
        <FormControlLabel control={<Checkbox />} label="Indoor Camera" />
        <FormControlLabel control={<Checkbox />} label="Outdoor Camera" />
        <FormControlLabel control={<Checkbox />} label="PTZ Camera" />
        <FormControlLabel control={<Checkbox />} label="Smart Home" />
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>
        Resolusi
      </Typography>
      <FormGroup sx={{ mb: 3 }}>
        <FormControlLabel control={<Checkbox />} label="1080p (FHD)" />
        <FormControlLabel control={<Checkbox />} label="2K (QHD)" />
        <FormControlLabel control={<Checkbox />} label="4K (UHD)" />
        <FormControlLabel control={<Checkbox />} label="5MP" />
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>
        Fitur Ekstra
      </Typography>
      <FormGroup>
        <FormControlLabel control={<Checkbox />} label="Night Vision" />
        <FormControlLabel control={<Checkbox />} label="Two-Way Audio" />
        <FormControlLabel control={<Checkbox />} label="Motion Detection" />
        <FormControlLabel control={<Checkbox />} label="Weatherproof (IP67)" />
      </FormGroup>
    </Paper>
  );
};
