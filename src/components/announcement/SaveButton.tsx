import { IconButton } from '@mui/material';

// CSS filter pour convertir le SVG noir en orange #EB6640
const orangeFilter = 'brightness(0) saturate(100%) invert(52%) sepia(75%) saturate(551%) hue-rotate(334deg) brightness(101%)';

interface SaveButtonProps {
  isSaved?: boolean;
  onToggle?: () => void;
}

export default function SaveButton({ isSaved = false, onToggle }: SaveButtonProps) {
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
          filter: isSaved ? orangeFilter : undefined,
        }}
      />
    </IconButton>
  );
}
