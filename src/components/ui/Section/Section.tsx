import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';

export interface SectionProps extends BoxProps {
  children: ReactNode;
}

export const Section = ({ children, className, ...props }: SectionProps) => {
  return (
    <Box component="section" className={`py-8 md:py-12 ${className || ''}`} {...props}>
      {children}
    </Box>
  );
};
