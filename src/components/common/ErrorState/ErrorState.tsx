import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AlertCircle } from 'lucide-react';
import { PrimaryButton } from '../../ui/PrimaryButton';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState = ({
  title = 'Terjadi Kesalahan',
  description = 'Sistem tidak dapat memproses permintaan Anda saat ini.',
  icon,
  onRetry,
  retryText = 'Coba Lagi',
}: ErrorStateProps) => {
  return (
    <Box className="flex min-h-[250px] flex-col items-center justify-center p-8 text-center">
      <Box className="mb-4 text-red-500">
        {icon || <AlertCircle size={48} strokeWidth={1.5} />}
      </Box>
      <Typography variant="h3" className="mb-2 text-lg text-gray-900">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mb-6 max-w-md">
        {description}
      </Typography>

      {onRetry && (
        <PrimaryButton onClick={onRetry}>
          {retryText}
        </PrimaryButton>
      )}
    </Box>
  );
};
