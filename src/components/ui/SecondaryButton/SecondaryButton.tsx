import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';

export type SecondaryButtonProps = Omit<ButtonProps, 'variant'>;

export const SecondaryButton = (props: SecondaryButtonProps) => {
  return <Button variant="outlined" color="primary" {...props} />;
};
