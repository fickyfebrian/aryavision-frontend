import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';

export type PrimaryButtonProps = ButtonProps;

export const PrimaryButton = (props: PrimaryButtonProps) => {
  return <Button variant="contained" color="primary" {...props} />;
};
