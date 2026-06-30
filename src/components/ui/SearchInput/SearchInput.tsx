import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Search, X } from 'lucide-react';

export type SearchInputProps = Omit<TextFieldProps, 'onChange' | 'value'> & {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
};

export const SearchInput = ({ value, onChange, onClear, ...props }: SearchInputProps) => {
  const originalInputProps = (props as any).InputProps || {};
  
  return (
    <TextField
      variant="outlined"
      {...(props as any)}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      InputProps={{
        ...originalInputProps,
        startAdornment: (
          <InputAdornment position="start">
            <Search size={20} className="text-gray-400" />
          </InputAdornment>
        ),
        endAdornment: value && onClear ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={onClear} aria-label="Clear search" edge="end">
              <X size={16} />
            </IconButton>
          </InputAdornment>
        ) : originalInputProps.endAdornment,
      }}
    />
  );
};
