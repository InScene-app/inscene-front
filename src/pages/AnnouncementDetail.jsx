import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { usePageLayout } from '../hooks/usePageLayout';

export default function AnnouncementDetail() {
  const { id } = useParams();
  usePageLayout();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Announcement Detail - ID: {id}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Page de détail de l'annonce (à développer)
      </Typography>
    </Box>
  );
}
