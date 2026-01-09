import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import DetailLayout from '../components/layout/DetailLayout';
import { mockAnnouncements } from '../data/mockAnnouncements';

export default function AnnouncementDetail() {
  const { id } = useParams<{ id: string }>();
  const [isSaved, setIsSaved] = useState(false);

  // Trouver l'annonce correspondante
  const announcement = mockAnnouncements.find((a) => a.id === parseInt(id || '0'));

  const handleToggleSave = () => {
    setIsSaved((prev) => !prev);
  };

  if (!announcement) {
    return (
      <DetailLayout>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5">Annonce non trouvée</Typography>
        </Box>
      </DetailLayout>
    );
  }

  return (
    <DetailLayout isSaved={isSaved} onToggleSave={handleToggleSave}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {announcement.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {announcement.description}
        </Typography>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Localisation: {announcement.location}
        </Typography>
        <Typography variant="body2">
          Tags: {announcement.tags.join(', ')}
        </Typography>
      </Box>
    </DetailLayout>
  );
}
