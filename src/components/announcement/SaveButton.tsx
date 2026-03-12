import { IconButton, useTheme } from '@mui/material';

// CSS filter pour convertir le SVG noir en #EB6640 (primary.main orange, light mode)
const ORANGE_FILTER = 'brightness(0) saturate(100%) invert(49%) sepia(79%) saturate(602%) hue-rotate(330deg) brightness(108%)';

interface SaveButtonProps {
  isSaved?: boolean;
  onToggle?: () => void;
}

export default function SaveButton({ isSaved = false, onToggle }: SaveButtonProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const iconFilter = isSaved ? (isDark ? 'invert(1)' : ORANGE_FILTER) : (isDark ? 'invert(1)' : undefined);

  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
      sx={{
        backgroundColor: 'transparent',
        padding: 0,
        '&:hover': { backgroundColor: 'transparent' },
      }}
    >
      <img
        src={isSaved ? '/icons/Sauvergardes.svg' : '/icons/Sauvergardes_empty.svg'}
        alt={isSaved ? 'Sauvegardé' : 'Sauvegarder'}
        style={{
          width: 18,
          height: 18,
          filter: iconFilter,
        }}
      />
    </IconButton>
  );
}
