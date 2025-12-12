import { Typography, Box } from '@mui/material';
import { usePageLayout } from '../hooks/usePageLayout';

export default function Saved() {
  usePageLayout();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Saved Jobs
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Ici on affichera les annonces sauvegardées
      </Typography>
    </Box>
  );
}
