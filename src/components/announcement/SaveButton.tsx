import { IconButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

interface SaveButtonProps {
  isSaved?: boolean;
  onToggle?: () => void;
}

export default function SaveButton({ isSaved = false, onToggle }: SaveButtonProps) {
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation(); // Empêche le clic de propager à la card
        onToggle?.();
      }}
      sx={{
        color: isSaved ? 'primary.main' : 'text.secondary',
        backgroundColor: 'transparent',
        padding: 0,
        '&:hover': {
          backgroundColor: 'transparent',
          color: 'primary.main',
        },
      }}
    >
      {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
    </IconButton>
  );
}
