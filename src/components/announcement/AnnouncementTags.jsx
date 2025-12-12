import { Box, Chip } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';

export default function AnnouncementTags({ isUrgent = false, tags = [] }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
      {isUrgent && (
        <Chip
          icon={<FlashOnIcon />}
          label="URGENT"
          size="small"
          sx={{
            fontSize: '14px',
            fontWeight: 900,
            textTransform: 'uppercase',
            backgroundColor: 'primary.main',
            color: 'white',
            '& .MuiChip-label': {
              px: 1,
            },
            '& .MuiChip-icon': {
              fontSize: '16px',
              color: 'white',
            },
          }}
        />
      )}
      {tags.slice(0, 3).map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          size="small"
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            backgroundColor: 'background.white',
            border: 'none',
            '& .MuiChip-label': {
              px: 1,
            },
          }}
        />
      ))}
      {tags.length > 3 && (
        <Chip
          label={`+${tags.length - 3}`}
          size="small"
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            backgroundColor: 'background.white',
            border: 'none',
            '& .MuiChip-label': {
              px: 1,
            },
          }}
        />
      )}
    </Box>
  );
}
