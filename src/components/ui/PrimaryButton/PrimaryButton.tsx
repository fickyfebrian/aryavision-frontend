import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';

export interface PrimaryButtonProps extends ButtonProps {}

export const PrimaryButton = (props: PrimaryButtonProps) => {
  return <Button variant="contained" color="primary" {...props} />;
};
