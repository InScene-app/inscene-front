import { Box, Typography } from '@mui/material';

interface AnnouncementProfileBlockProps {
  profileRequired?: string;
  skillsRequired?: string[];
}

export default function AnnouncementProfileBlock({
  profileRequired,
  skillsRequired,
}: AnnouncementProfileBlockProps) {
  // Ne pas afficher le bloc si aucun champ n'est renseigné
  if (!profileRequired && (!skillsRequired || skillsRequired.length === 0)) {
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
      {/* Profil recherché */}
      {profileRequired && (
        <Box>
          <Typography sx={{ fontSize: '17px', fontWeight: 700, mb: 1 }}>
            Profil recherché
          </Typography>
          <Typography sx={{ fontSize: '15px', fontWeight: 400 }}>
            {profileRequired}
          </Typography>
        </Box>
      )}

      {/* Compétences requises (texte) */}
      {skillsRequired && skillsRequired.length > 0 && (
        <Box>
          <Typography sx={{ fontSize: '15px', fontWeight: 700, mb: 1 }}>
            Compétences requises
          </Typography>
          <Typography sx={{ fontSize: '15px', fontWeight: 400 }}>
            {skillsRequired.join(', ')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
