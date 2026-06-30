import { Shadows } from '@mui/material/styles';

// Create a custom soft shadow set (0 to 24)
// We mostly only use a few soft shadows in modern enterprise design
export const shadows: Shadows = [
  'none',
  '0px 1px 2px 0px rgba(17, 24, 39, 0.05)', // 1: very soft, e.g. for small cards or buttons
  '0px 1px 3px 0px rgba(17, 24, 39, 0.1), 0px 1px 2px -1px rgba(17, 24, 39, 0.1)', // 2: standard card
  '0px 4px 6px -1px rgba(17, 24, 39, 0.1), 0px 2px 4px -2px rgba(17, 24, 39, 0.1)', // 3: hover state or popovers
  '0px 10px 15px -3px rgba(17, 24, 39, 0.1), 0px 4px 6px -4px rgba(17, 24, 39, 0.1)', // 4: dialogs / modals
  // ... fill the rest with a generic soft shadow to satisfy the type (MUI requires 25 items in array)
  ...Array(20).fill('0px 20px 25px -5px rgba(17, 24, 39, 0.1), 0px 8px 10px -6px rgba(17, 24, 39, 0.1)')
] as Shadows;
