import type { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  align?: 'left' | 'center';
}

export const SectionHeader = ({ title, subtitle, action, align = 'left' }: SectionHeaderProps) => {
  return (
    <Stack
      direction={{ xs: 'column', md: action && align === 'left' ? 'row' : 'column' }}
      spacing={action && align === 'left' ? 4 : 2}
      sx={{
        mb: { xs: 4, md: 6 },
        textAlign: align,
        alignItems: align === 'center' ? 'center' : { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ maxWidth: align === 'center' ? '800px' : 'auto' }}>
        <Typography
          variant="h3"
          component="h2"
          color="text.primary"
          sx={{ fontWeight: 700, mb: subtitle ? 1.5 : 0 }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.6 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {action && (
        <Box sx={{ mt: { xs: 2, md: 0 }, flexShrink: 0 }}>
          {action}
        </Box>
      )}
    </Stack>
  );
};
