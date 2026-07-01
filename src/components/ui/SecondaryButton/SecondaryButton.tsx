import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';

export interface SecondaryButtonProps extends Omit<ButtonProps, 'variant'> {}

export const SecondaryButton = (props: SecondaryButtonProps) => {
  return <Button variant="outlined" color="primary" {...props} />;
};
