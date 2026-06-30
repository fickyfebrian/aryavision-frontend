import type { Components, Theme } from '@mui/material';

export const components: Components<Theme> = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
        '&.MuiButton-containedPrimary:hover': {
          backgroundColor: '#1D4ED8', // Primary Hover
        },
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 12,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0px 1px 3px 0px rgba(17, 24, 39, 0.1), 0px 1px 2px -1px rgba(17, 24, 39, 0.1)',
        border: '1px solid #E5E7EB',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
      elevation1: {
        boxShadow: '0px 1px 3px 0px rgba(17, 24, 39, 0.1), 0px 1px 2px -1px rgba(17, 24, 39, 0.1)',
      },
      elevation2: {
        boxShadow: '0px 4px 6px -1px rgba(17, 24, 39, 0.1), 0px 2px 4px -2px rgba(17, 24, 39, 0.1)',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
        boxShadow: '0px 10px 15px -3px rgba(17, 24, 39, 0.1), 0px 4px 6px -4px rgba(17, 24, 39, 0.1)',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        '&.MuiAlert-standardSuccess': {
          backgroundColor: '#DCFCE7',
          color: '#166534',
          '& .MuiAlert-icon': { color: '#22C55E' },
        },
        '&.MuiAlert-standardError': {
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          '& .MuiAlert-icon': { color: '#EF4444' },
        },
        '&.MuiAlert-standardWarning': {
          backgroundColor: '#FEF3C7',
          color: '#92400E',
          '& .MuiAlert-icon': { color: '#F59E0B' },
        },
        '&.MuiAlert-standardInfo': {
          backgroundColor: '#DBEAFE',
          color: '#1E40AF',
          '& .MuiAlert-icon': { color: '#2563EB' },
        },
      },
    },
  },
  MuiTable: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-head': {
          fontWeight: 600,
          backgroundColor: '#F8FAFC',
          color: '#6B7280',
          borderBottom: '1px solid #E5E7EB',
        },
        '& .MuiTableCell-body': {
          borderBottom: '1px solid #E5E7EB',
        },
      },
    },
  },
};
