import { Typography, Box, useTheme } from '@mui/material';
import { usePageLayout } from '../hooks/usePageLayout';

export default function Messages() {
  usePageLayout();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, mb: 3 }}>
        Messages
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, gap: 2 }}>
        <img src="/icons/Message.svg" alt="Messages" style={{ width: 64, height: 64, opacity: 0.4, filter: isDark ? 'invert(1)' : undefined }} />
        <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
          Aucun message
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: '14px', textAlign: 'center' }}>
          La messagerie sera disponible à la V1 d'InScène
        </Typography>
      </Box>
    </Box>
  );
}
