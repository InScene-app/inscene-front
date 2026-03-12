import { Box, Typography, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Announcement } from '../../../types/announcement';
import PrimaryButton from '../../common/PrimaryButton';

interface ConfirmationStepProps {
  announcement: Announcement;
  onConsult: () => void;
  onHome: () => void;
}

export default function ConfirmationStep({ announcement, onConsult, onHome }: ConfirmationStepProps) {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        px: '20px',
        pt: '24px',
        pb: '28px',
      }}
    >
      {/* Bouton fermer (haut droite) */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: '16px' }}>
        <Box
          onClick={onConsult}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36 }}
        >
          <CloseIcon sx={{ fontSize: 24, color: 'text.primary' }} />
        </Box>
      </Box>

      {/* Auteur */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: '16px' }}>
        <Avatar src={announcement.author?.avatar || undefined} alt={announcement.author?.name} sx={{ width: 45, height: 45 }} />
        <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '17px', fontWeight: 500, color: 'text.primary' }}>
          {announcement.author?.name}
        </Typography>
      </Box>

      {/* Titre annonce */}
      <Typography sx={{ fontFamily: 'Quicksand, sans-serif', fontSize: '24px', fontWeight: 700, color: 'text.primary', lineHeight: 1.3, mb: '28px' }}>
        {announcement.title}
      </Typography>

      {/* Carte illustration */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: '20px',
          overflow: 'hidden',
          mb: '28px',
          aspectRatio: '4/3',
        }}
      >
        <img
          src="/images/onboarding/onboarding-hand-check.jpg"
          alt="Candidature envoyée"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </Box>

      {/* Texte de confirmation */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: '28px', textAlign: 'center' }}>
        <Typography sx={{ fontFamily: 'Quicksand, sans-serif', fontSize: '20px', fontWeight: 700, color: 'text.primary' }}>
          Candidature envoyée !
        </Typography>
        <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: 'text.secondary', lineHeight: 1.6 }}>
          Ta candidature a bien été envoyée. Tu recevras bientôt des notifications pour t'informer de son avancée
        </Typography>
      </Box>

      {/* Boutons */}
      <Box sx={{ display: 'flex', gap: '12px' }}>
        <PrimaryButton fullWidth onClick={onConsult}>
          Consulter
        </PrimaryButton>
        <PrimaryButton
          fullWidth
          onClick={onHome}
          sx={{
            backgroundColor: 'transparent',
            color: 'primary.main',
            border: '2px solid',
            borderColor: 'primary.main',
            '&:hover': { backgroundColor: 'rgba(235, 102, 64, 0.06)' },
            boxShadow: 'none',
          }}
        >
          Accueil
        </PrimaryButton>
      </Box>
    </Box>
  );
}
