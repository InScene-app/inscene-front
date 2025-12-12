import { Typography, Box } from '@mui/material';
import { usePageLayout } from '../hooks/usePageLayout';

export default function Account() {
  usePageLayout();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Account
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Ici on affichera le profil et les paramètres du compte
      </Typography>
    </Box>
  );
}
