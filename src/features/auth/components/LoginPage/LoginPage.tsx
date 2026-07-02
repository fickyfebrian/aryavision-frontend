import { useState } from 'react';
import { Box, Paper, Typography, TextField, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '@/components/ui';
import { authService } from '@/services/auth.service';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const tokenResponse = await authService.login({ username, password });
      localStorage.setItem('token', tokenResponse.access_token);
      navigate('/admin');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || 'Gagal login. Periksa kembali username dan password Anda.');
      } else {
        setError('Gagal login. Periksa kembali username dan password Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
            AryaVision Admin
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Masuk untuk mengelola produk dan rekomendasi
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            autoFocus
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            sx={{ mb: 3 }}
          />
          <PrimaryButton 
            fullWidth 
            type="submit" 
            disabled={isLoading || !username || !password}
            sx={{ py: 1.5 }}
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </PrimaryButton>
        </Box>
      </Paper>
    </Box>
  );
};
