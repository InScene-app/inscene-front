import { useState, useEffect } from 'react';
import { Typography, Box, Stack, CircularProgress } from '@mui/material';
import { usePageLayout } from '../hooks/usePageLayout';
import AnnouncementCard from '../components/announcement/AnnouncementCard';
import { getAnnouncements } from '../api/announcementService';
import { Announcement } from '../types/announcement';

export default function Home() {
  usePageLayout();
  const [savedAnnouncements, setSavedAnnouncements] = useState<number[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await getAnnouncements();
        setAnnouncements(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des annonces:', err);
        setError('Impossible de charger les annonces');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleToggleSave = (announcementId: number) => {
    setSavedAnnouncements((prev) =>
      prev.includes(announcementId)
        ? prev.filter((id) => id !== announcementId)
        : [...prev, announcementId]
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Fil d'actualité
        </Typography>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Fil d'actualité
      </Typography>

      {announcements.length === 0 ? (
        <Typography color="text.secondary">Aucune annonce disponible</Typography>
      ) : (
        <Stack spacing="35px">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isSaved={savedAnnouncements.includes(announcement.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
