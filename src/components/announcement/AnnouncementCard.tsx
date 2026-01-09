import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Box, Typography, Avatar, Stack } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AnnouncementImage from './AnnouncementImage';
import AnnouncementTags from './AnnouncementTags';
import SaveButton from './SaveButton';
import { Announcement } from '../../types/announcement';
import { formatRelativeDate } from '../../utils/dateFormat';

interface AnnouncementCardProps {
  announcement: Announcement;
  isSaved?: boolean;
  onToggleSave?: (id: number) => void;
}

export default function AnnouncementCard({ announcement, isSaved = false, onToggleSave }: AnnouncementCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    window.scrollTo(0, 0);
    navigate(`/announcement/${announcement.id}`);
  };

  const displayDate = formatRelativeDate(announcement.createdAt);

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        borderRadius: '35px',
        backgroundColor: 'primary.extraLight',
        '&:hover': {
          transform: 'translateY(-2px)',
          // boxShadow: '0px 4px 16px rgba(0,0,0,0.12)',
        },
      }}
    >
      <AnnouncementImage imageUrl={announcement.imageUrl} title={announcement.title} />

      <CardContent
        sx={{
          px: '24px',
          py: '20px',
          '&:last-child': {
            paddingBottom: '20px',
          },
        }}
      >
        {/* Titre + Bouton Save */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 700, flex: 1 }}>
            {announcement.title}
          </Typography>
          <SaveButton isSaved={isSaved} onToggle={() => onToggleSave?.(announcement.id)} />
        </Box>

        {/* Auteur */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Avatar
            src={announcement.author?.avatar || undefined}
            alt={announcement.author?.name}
            sx={{ width: 26, height: 26 }}
          />
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
            {announcement.author?.name}
          </Typography>
        </Box>

        {/* Description courte */}
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 400,
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {announcement.description}
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
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 15 }} />
            <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
              {announcement.location}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
            {displayDate}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
