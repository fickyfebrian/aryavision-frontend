import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FolderOpen } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export const EmptyState = ({ title, description, icon }: EmptyStateProps) => {
  return (
    <Box className="flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <Box className="mb-4 text-gray-400">
        {icon || <FolderOpen size={48} strokeWidth={1.5} />}
      </Box>
      <Typography variant="h3" className="mb-2 text-lg text-gray-900">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" className="max-w-md">
          {description}
        </Typography>
      )}
    </Box>
  );
};
