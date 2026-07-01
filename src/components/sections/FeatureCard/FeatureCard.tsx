import type { ReactNode } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  variant?: 'default' | 'bordered';
}

export const FeatureCard = ({ icon, title, description, variant = 'default' }: FeatureCardProps) => {
  const isBordered = variant === 'bordered';

  return (
    <Card
      elevation={isBordered ? 0 : 1}
      variant={isBordered ? 'outlined' : 'elevation'}
      sx={{
        height: '100%',
        borderRadius: 3,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isBordered ? 1 : 4,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: 2,
            bgcolor: 'primary.light',
            color: 'primary.main',
            mb: 3,
          }}
        >
          {icon}
        </Box>
        
        <Typography variant="h6" component="h3" color="text.primary" sx={{ fontWeight: 600, mb: 1.5 }}>
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, flexGrow: 1 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};
