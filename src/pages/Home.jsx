import { Typography, Box } from '@mui/material';
import { usePageLayout } from '../hooks/usePageLayout';

export default function Home() {
  // Par défaut: container 'lg', centré
  usePageLayout();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Home - Feed
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Ici on affichera le fil d'actualité avec toutes les offres d'emploi
      </Typography>
    </Box>
  );
}
