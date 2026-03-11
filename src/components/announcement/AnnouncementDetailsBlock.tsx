import { Box, Typography } from '@mui/material';

interface AnnouncementDetailsBlockProps {
  missionDetails?: string;
  advantages?: string;
  process?: string;
}

export default function AnnouncementDetailsBlock({
  missionDetails,
  advantages,
  process,
}: AnnouncementDetailsBlockProps) {
  // Ne pas afficher le bloc si aucun champ n'est renseigné
  if (!missionDetails && !advantages && !process) {
    return null;
  }

  return (
    <Box
      sx={{
        borderRadius: '24px',
        border: '1px solid',
        borderColor: 'background.border',
        padding: '22px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Détails mission */}
      {missionDetails && (
        <Box>
          <Typography sx={{ fontSize: '17px', fontWeight: 700, mb: 1 }}>
            Détails mission
          </Typography>
          <Typography sx={{ fontSize: '15px', fontWeight: 400 }}>
            {missionDetails}
          </Typography>
        </Box>
      )}

      {/* Avantages et rémunération */}
      {advantages && (
        <Box>
          <Typography sx={{ fontSize: '15px', fontWeight: 700, mb: 1 }}>
            Avantages et rémunération
          </Typography>
          <Typography sx={{ fontSize: '15px', fontWeight: 400 }}>
            {advantages}
          </Typography>
        </Box>
      )}

      {/* Processus de recrutement */}
      {process && (
        <Box>
          <Typography sx={{ fontSize: '15px', fontWeight: 700, mb: 1 }}>
            Processus de recrutement
          </Typography>
          <Typography sx={{ fontSize: '15px', fontWeight: 400 }}>
            {process}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
