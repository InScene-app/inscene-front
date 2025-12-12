import { IconButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

export default function SaveButton({ isSaved = false, onToggle }) {
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation(); // Empêche le clic de propager à la card
        onToggle?.();
      }}
      sx={{
        position: 'absolute',
        top: 12,
        right: 12,
        color: isSaved ? 'primary.main' : 'text.secondary',
        backgroundColor: 'transparent',
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
