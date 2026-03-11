import { Box, Typography, useTheme } from '@mui/material';
import PrimaryButton from '../common/PrimaryButton';

interface OnboardingIntroProps {
    onNext: () => void;
}

export default function OnboardingIntro({ onNext }: OnboardingIntroProps) {
    const theme = useTheme();
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Image en haut - 50% */}
            <Box
                sx={{
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'background.subtle',

                }}
            >
                <Box
                    component="img"
                    src="/images/onboarding/onboarding-page2-image.png"
                    alt="Onboarding introduction"
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderBottomLeftRadius: '35px',
                        borderBottomRightRadius: '35px',
                    }}
                />
            </Box>

            {/* Conteneur du bas - 50% */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    px: 3,
                    pb: 3,
                    backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : 'background.default',
                }}
            >
                {/* Container des textes centré verticalement */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        justifyContent: 'center',
                        flex: 1,
                    }}
                >
                    {/* Premier texte */}
                    <Typography
                        sx={{
                            fontFamily: 'Nunito, sans-serif',
                            fontSize: '24px',
                            fontWeight: 600,
                            textAlign: 'center',
                            color: 'text.primary',
                        }}
                    >
                        InScène vous aide dans votre{' '}
                        <Box component="span" sx={{ color: 'primary.main' }}>
                            intégration professionnelle
                        </Box>
                    </Typography>

                    {/* Deuxième texte */}
                    <Typography
                        sx={{
                            fontFamily: 'Nunito, sans-serif',
                            fontSize: '17px',
                            fontWeight: 400,
                            textAlign: 'center',
                            color: 'text.primary',
                        }}
                    >
                        L'application vous{' '}
                        <Box component="span" sx={{ fontWeight: 700 }}>
                            simplifie l'accès à des offres d'emploi pertinentes
                        </Box>
                        , en fonction de votre profil, de vos besoins et de vos projets.
                    </Typography>
                </Box>

                {/* Bouton Suivant */}
                <PrimaryButton fullWidth onClick={onNext}>
                    Suivant
                </PrimaryButton>
            </Box>
        </Box>
    );
}
