import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Search, X } from 'lucide-react';

export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({ value, onChange, onClear, placeholder, className }: SearchInputProps) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      placeholder={placeholder}
      className={className}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      slotProps={{
        input: {
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
        ) : undefined,
        }
      }}
    />
  );
};
