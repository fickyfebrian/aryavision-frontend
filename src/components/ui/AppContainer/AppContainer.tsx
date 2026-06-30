import type { ReactNode } from 'react';
import Container from '@mui/material/Container';
import type { ContainerProps } from '@mui/material/Container';

export interface AppContainerProps extends Omit<ContainerProps, 'maxWidth'> {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export const AppContainer = ({ children, maxWidth = 'lg', ...props }: AppContainerProps) => {
  return (
    <Container maxWidth={maxWidth} {...props}>
      {children}
    </Container>
  );
};
