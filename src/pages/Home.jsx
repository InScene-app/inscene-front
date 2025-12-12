import { useState } from 'react';
import { Typography, Box, Stack } from '@mui/material';
import { usePageLayout } from '../hooks/usePageLayout';
import AnnouncementCard from '../components/announcement/AnnouncementCard';
import { mockAnnouncements } from '../data/mockAnnouncements';

export default function Home() {
  usePageLayout();
  const [savedAnnouncements, setSavedAnnouncements] = useState([]);

  const handleToggleSave = (announcementId) => {
    setSavedAnnouncements((prev) =>
      prev.includes(announcementId)
        ? prev.filter((id) => id !== announcementId)
        : [...prev, announcementId]
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Fil d'actualité
      </Typography>

      <Stack spacing="35px">
        {mockAnnouncements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            isSaved={savedAnnouncements.includes(announcement.id)}
            onToggleSave={handleToggleSave}
          />
        ))}
      </Stack>
    </Box>
  );
}
