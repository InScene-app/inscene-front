import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Box, Typography, Stack } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import AnnouncementImage from './AnnouncementImage';
import AnnouncementTags from './AnnouncementTags';
import SaveButton from './SaveButton';

export default function AnnouncementCardCompact({ announcement, isSaved = false, onToggleSave }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/announcement/${announcement.id}`);
  };

  const formattedDate = formatDistanceToNow(new Date(announcement.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <Card
      onClick={handleClick}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0px 4px 16px rgba(0,0,0,0.12)',
        },
      }}
    >
      <SaveButton isSaved={isSaved} onToggle={() => onToggleSave?.(announcement.id)} />

      <AnnouncementImage imageUrl={announcement.imageUrl} title={announcement.title} />

      <CardContent>
        {/* Titre */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          {announcement.title}
        </Typography>

        {/* Tags + Urgent */}
        <Box sx={{ mb: 2 }}>
          <AnnouncementTags isUrgent={announcement.isUrgent} tags={announcement.tags} />
        </Box>

        {/* Location + Date */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ color: 'text.secondary' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{announcement.location}</Typography>
          </Box>
          <Typography variant="caption">{formattedDate}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
