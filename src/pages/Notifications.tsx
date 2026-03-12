import { Typography, Box } from '@mui/material';
import { usePageLayout } from '../hooks/usePageLayout';

export default function Notifications() {
  usePageLayout();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 700 }}>
        Notifications
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, gap: 2 }}>
        <img src="/icons/Notif.svg" alt="Notifications" style={{ width: 64, height: 64, opacity: 0.4 }} />
        <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
          Aucune notification
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: '14px', textAlign: 'center' }}>
          Les notifications seront disponibles à la V1 d'InScène
        </Typography>
      </Box>
    </Box>
  );
}
