import { useState } from 'react';
import { Box, Paper, Typography, TextField, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PrimaryButton } from '@/components/ui';
import { authService } from '@/services/auth.service';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/login.schema';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError('');
    try {
      const tokenResponse = await authService.login(data);
      localStorage.setItem('token', tokenResponse.access_token);
      navigate('/admin');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setServerError(axiosErr.response?.data?.message || 'Gagal login. Periksa kembali username dan password Anda.');
      } else {
        setServerError('Gagal login. Periksa kembali username dan password Anda.');
      }
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

        {serverError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
            autoComplete="username"
            autoFocus
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="current-password"
            sx={{ mb: 3 }}
          />
          <PrimaryButton 
            fullWidth 
            type="submit" 
            disabled={isSubmitting}
            sx={{ py: 1.5 }}
          >
            {isSubmitting ? 'Memproses...' : 'Masuk'}
          </PrimaryButton>
        </Box>
      </Paper>
    </Box>
  );
};
