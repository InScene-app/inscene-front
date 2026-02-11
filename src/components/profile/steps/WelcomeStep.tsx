import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../common/PrimaryButton';

interface WelcomeStepProps {
  onStart: () => void;
}

export default function WelcomeStep({ onStart }: WelcomeStepProps) {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        px: '12px',
        py: '24px',
        gap: '10px',
        overflow: 'hidden',
      }}
    >
      {/* Conteneur 1 - Titre et texte principal avec bouton */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(4px, 1vh, 10px)',
          p: '20px',
          backgroundColor: '#FAFCFF',
          borderRadius: '35px',
          flex: '0 1 auto',
        }}
      >
        <Typography
          variant="inherit"
          sx={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '20px',
            fontWeight: 600,
            textAlign: 'center',
            color: '#000000',
          }}
        >
          Créez votre profil
        </Typography>

        <Typography
          variant="inherit"
          sx={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            textAlign: 'center',
            color: '#000000',
          }}
        >
          Plus votre profil sera complet, plus vous trouverez des offres pertinentes.
        </Typography>

        <Typography
          variant="inherit"
          sx={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            textAlign: 'center',
            color: '#000000',
          }}
        >
          Cette étape prend moins de 5 minutes et vous fera{' '}
          <Box component="span" sx={{ fontWeight: 700 }}>
            gagner plus de 5 heures* sur votre recherche d'emploi
          </Box>
        </Typography>

        <PrimaryButton fullWidth onClick={onStart}>
          Créer mon profil
        </PrimaryButton>

        <Typography
          variant="inherit"
          sx={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 'clamp(9px, 1.2vh, 10px)',
            fontWeight: 400,
            textAlign: 'left',
            color: '#8C8C8C',
          }}
        >
          *Ratio InScène : 1 min dépensée dans la mise à jour de votre profil = 1h gagnée dans votre recherche
        </Typography>
      </Box>

      {/* Conteneur 2 - Bloc entreprise/association */}
      <Box
        sx={{
          border: '1px solid #225182',
          borderRadius: '35px',
          p: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(4px, 1vh, 10px)',
          flex: '0 1 auto',
        }}
      >
        <Typography
          variant="inherit"
          sx={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '20px',
            fontWeight: 600,
            textAlign: 'center',
            color: '#225182',
            pb: '20px',
          }}
        >
          Vous êtes une entreprise, association ou recruteur ?
        </Typography>

        <PrimaryButton fullWidth sx={{ backgroundColor: '#225182' }}>
          Créer un profil pro
        </PrimaryButton>

        <PrimaryButton
          fullWidth
          sx={{
            backgroundColor: 'transparent',
            color: '#225182',
            border: '1px solid #225182',
            '&:hover': {
              backgroundColor: 'rgba(34, 81, 130, 0.04)',
            },
          }}
        >
          Nous contacter
        </PrimaryButton>
      </Box>

      {/* Conteneur 3 - Pas de profil */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(4px, 1vh, 10px)',
          p: '20px',
          backgroundColor: '#FAFCFF',
          borderRadius: '35px',
          flex: '0 1 auto',
        }}
      >
        <Typography
          variant="inherit"
          sx={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '20px',
            fontWeight: 600,
            textAlign: 'center',
            color: '#000000',
          }}
        >
          Pas de profil ?
        </Typography>

        <Typography
          variant="inherit"
          sx={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            textAlign: 'center',
            color: '#000000',
          }}
        >
          Vous pouvez toujours parcourir l'application et créer votre profil utilisateur plus tard
        </Typography>

        <PrimaryButton
          fullWidth
          onClick={() => navigate('/')}
          sx={{
            backgroundColor: 'transparent',
            color: '#E67E50',
            border: '1px solid #E67E50',
            '&:hover': {
              backgroundColor: 'rgba(230, 126, 80, 0.04)',
            },
          }}
        >
          Continuer sans profil
        </PrimaryButton>
      </Box>
    </Box>
  );
}
