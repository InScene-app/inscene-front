import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Avatar, Stack, CircularProgress } from '@mui/material';
import DetailLayout from '../components/layout/DetailLayout';
import AnnouncementTags from '../components/announcement/AnnouncementTags';
import AnnouncementInfoTags from '../components/announcement/AnnouncementInfoTags';
import { formatRelativeDate } from '../utils/dateFormat';
import { getAnnouncementById } from '../api/announcementService';
import { Announcement } from '../types/announcement';

export default function AnnouncementDetail() {
  const { id } = useParams<{ id: string }>();
  const [isSaved, setIsSaved] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getAnnouncementById(parseInt(id));
        setAnnouncement(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'annonce:', err);
        setError('Impossible de charger l\'annonce');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  const handleToggleSave = () => {
    setIsSaved((prev) => !prev);
  };

  if (loading) {
    return (
      <DetailLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </DetailLayout>
    );
  }

  if (error || !announcement) {
    return (
      <DetailLayout>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5">{error || 'Annonce non trouvée'}</Typography>
        </Box>
      </DetailLayout>
    );
  }

  const displayDate = formatRelativeDate(announcement.createdAt);

  return (
    <DetailLayout isSaved={isSaved} onToggleSave={handleToggleSave}>
      <Box sx={{ p: 2.5 }}>
        {/* Auteur avec avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Avatar
            src={announcement.author?.avatar || undefined}
            alt={announcement.author?.name}
            sx={{
              width: 45,
              height: 45,
              objectFit: 'cover',
            }}
          />
          <Typography sx={{ fontSize: '17px', fontWeight: 500 }}>
            {announcement.author?.name}
          </Typography>
        </Box>

        {/* Titre */}
        <Typography sx={{ fontSize: '24px', fontWeight: 700, mb: 2 }}>
          {announcement.title}
        </Typography>

        {/* Tags (Urgent + tags standards) */}
        <Box sx={{ mb: 2 }}>
          <AnnouncementTags isUrgent={announcement.isUrgent} tags={announcement.tags} variant="detail" />
        </Box>

        {/* Tags info (Location, Salaire, Type de contrat) */}
        <Box sx={{ mb: 2 }}>
          <AnnouncementInfoTags
            location={announcement.location}
            contractType={announcement.contractType}
            exactSalary={announcement.exactSalary}
            minSalary={announcement.minSalary}
            maxSalary={announcement.maxSalary}
          />
        </Box>

        {/* Nombre de candidats + Date */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
            {announcement.applicantsCount !== undefined
              ? `${announcement.applicantsCount} candidat${announcement.applicantsCount > 1 ? 's' : ''}`
              : '0 candidat'}
          </Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
            {displayDate}
          </Typography>
        </Stack>

        {/* Description */}
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {announcement.description}
        </Typography>
      </Box>
    </DetailLayout>
  );
}
