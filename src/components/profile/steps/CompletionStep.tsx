import { Box, Typography } from '@mui/material';
import PrimaryButton from '../../common/PrimaryButton';
import ProgressBar from '../ProgressBar';

interface CompletionStepProps {
  onViewProfile: () => void;
  onComplete: () => void;
  progress: number;
}

export default function CompletionStep({ onViewProfile, onComplete, progress }: CompletionStepProps) {
  return (
    <Box
      sx={{
        backgroundColor: '#F2F6FC',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        py: '24px',
        gap: '20px',
      }}
    >
      {/* Spacer haut */}
      <Box sx={{ flex: 1 }} />

      <Box sx={{ px: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {/* Titre */}
        <Typography
          variant="inherit"
          sx={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '24px',
            fontWeight: 600,
            textAlign: 'center',
            color: '#000000',
          }}
        >
          C'est parti !
        </Typography>

        {/* Image */}
        <Box
          component="img"
          src="/images/onboarding/onboarding-hand-check.jpg"
          alt="Bienvenue"
          sx={{
            width: '331px',
            height: '276px',
            borderRadius: '35px',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />

        {/* Texte */}
        <Typography
          variant="inherit"
          sx={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '17px',
            fontWeight: 400,
            textAlign: 'center',
            color: '#000000',
            lineHeight: 1.6,
          }}
        >
          <strong>Ton profil et ton fil d'actualité sont à jour.</strong>
          <br />
          Tu peux modifier ton profil à tout moment
          <br />
          Bienvenue dans la communauté InScène !
        </Typography>

        {/* Bouton voir mon profil */}
        <PrimaryButton
          onClick={onViewProfile}
          sx={{
            backgroundColor: 'transparent',
            color: '#FF8C5F',
            border: '1px solid #FF8C5F',
            '&:hover': {
              backgroundColor: 'rgba(255, 140, 95, 0.04)',
            },
          }}
        >
          Voir mon profil
        </PrimaryButton>
      </Box>

      {/* Spacer bas */}
      <Box sx={{ flex: 1 }} />

      {/* Barre d'avancement + Bouton Terminer */}
      <Box sx={{ px: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ProgressBar progress={progress} />
        <PrimaryButton fullWidth onClick={onComplete}>
          Terminer
        </PrimaryButton>
      </Box>
    </Box>
  );
}
