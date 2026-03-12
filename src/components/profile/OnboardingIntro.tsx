import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import PrimaryButton from '../common/PrimaryButton';

interface OnboardingIntroProps {
    onNext: () => void;
}

export default function OnboardingIntro({ onNext }: OnboardingIntroProps) {
    const theme = useTheme();
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const bgColor = theme.palette.mode === 'dark' ? 'background.paper' : 'background.default';

    const image = (
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
                    ...(isDesktop
                        ? { borderTopRightRadius: '35px', borderBottomRightRadius: '35px' }
                        : { borderBottomLeftRadius: '35px', borderBottomRightRadius: '35px' }),
                }}
            />
        </Box>
    );

    const content = (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                px: isDesktop ? 6 : 3,
                pb: 3,
                pt: isDesktop ? 6 : 0,
                backgroundColor: bgColor,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    justifyContent: 'center',
                    flex: 1,
                }}
            >
                <Typography
                    sx={{
                        fontFamily: 'Nunito, sans-serif',
                        fontSize: isDesktop ? '28px' : '24px',
                        fontWeight: 600,
                        textAlign: isDesktop ? 'left' : 'center',
                        color: 'text.primary',
                    }}
                >
                    InScène vous aide dans votre{' '}
                    <Box component="span" sx={{ color: 'primary.main' }}>
                        intégration professionnelle
                    </Box>
                </Typography>

                <Typography
                    sx={{
                        fontFamily: 'Nunito, sans-serif',
                        fontSize: '17px',
                        fontWeight: 400,
                        textAlign: isDesktop ? 'left' : 'center',
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

            <PrimaryButton fullWidth onClick={onNext}>
                Suivant
            </PrimaryButton>
        </Box>
    );

    if (isDesktop) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'row' }}>
                {content}
                {image}
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {image}
            {content}
        </Box>
    );
}
