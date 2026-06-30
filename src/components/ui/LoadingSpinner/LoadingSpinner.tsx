import CircularProgress from '@mui/material/CircularProgress';
import type { CircularProgressProps } from '@mui/material/CircularProgress';

export interface LoadingSpinnerProps extends CircularProgressProps {}

export const LoadingSpinner = (props: LoadingSpinnerProps) => {
  return <CircularProgress {...props} />;
};
