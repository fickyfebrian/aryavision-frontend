import { PaletteOptions } from '@mui/material';

export const palette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#2563EB',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F8FAFC', // Secondary Background
    contrastText: '#111827',
  },
  error: {
    main: '#EF4444', // Danger
  },
  warning: {
    main: '#F59E0B',
  },
  success: {
    main: '#22C55E',
  },
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
  },
  divider: '#E5E7EB', // Border
};
