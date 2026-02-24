import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PrimaryButton from '../common/PrimaryButton';

const images = [
    '/images/onboarding/onboarding-1.png',
    '/images/onboarding/onboarding-2.png',
    '/images/onboarding/onboarding-3.png',
];

interface OnboardingCarouselProps {
    onComplete: () => void;
}

export default function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    // Auto-rotation toutes les 3 secondes
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Gestion du swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            setActiveIndex((prev) => (prev + 1) % images.length);
        }
        if (isRightSwipe) {
            setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    // const leftIndex = (activeIndex - 1 + images.length) % images.length;
    // const rightIndex = (activeIndex + 1) % images.length;

    // Positions calculées pour centrer le carrousel
    const centerImageWidth = 178;
    const sideImageWidth = 116;
    const gap = 20;

    // Calcul du centre (on veut que l'image centrale soit centrée)
    const viewportCenter = typeof window !== 'undefined' ? window.innerWidth / 2 : 195; // 195 = environ le centre d'un iPhone
    const centerLeft = viewportCenter - (centerImageWidth / 2);
    const rightLeft = centerLeft + centerImageWidth + gap;
    const leftLeft = centerLeft - sideImageWidth - gap;

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#2251821A',
                pb: 3,
            }}
        >
            {/* Container du haut */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    px: 3,
                    pt: 4,
                }}
            >
                {/* Premier container - Titre */}
                <Typography
                    sx={{
                        fontFamily: 'Quicksand, sans-serif',
                        fontSize: '38px',
                        fontWeight: 600,
                        lineHeight: '57px',
                        color: '#000000',
                        textAlign: 'center',
                    }}
                >
                    Bienvenue sur{' '}
                    <Box component="span" sx={{ color: 'primary.main' }}>
                        InScène
                    </Box>
                </Typography>

                {/* Deuxième container - Sous-titre */}
                <Typography
                    sx={{
                        fontFamily: 'Nunito, sans-serif',
                        fontSize: '17px',
                        fontWeight: 400,
                        lineHeight: 'normal',
                        color: '#000000',
                        textAlign: 'center',
                    }}
                >
                    Trouvez des{' '}
                    <Box component="span" sx={{ fontWeight: 700 }}>
                        offres d'emploi
                    </Box>{' '}
                    qui vous conviennent, construisez un{' '}
                    <Box component="span" sx={{ fontWeight: 700 }}>
                        réseau
                    </Box>{' '}
                    utile et{' '}
                    <Box component="span" sx={{ fontWeight: 700 }}>
                        partagez
                    </Box>{' '}
                    vos réalisations
                </Typography>
            </Box>

            {/* Container du bas - Carrousel + Bouton */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                }}
            >
                {/* Carrousel d'images */}
                <Box
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    sx={{
                        position: 'relative',
                        height: '274px',
                        width: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <AnimatePresence initial={false}>
                        {images.map((image, index) => {
                            const position = (index - activeIndex + images.length) % images.length;

                            // Seulement 3 positions visibles: 0=centre, 1=droite, 2=gauche
                            if (position > 2) return null;

                            let animateProps = {};
                            if (position === 0) {
                                // Centre
                                animateProps = { left: centerLeft, width: centerImageWidth, height: 274 };
                            } else if (position === 1) {
                                // Droite (moitié visible)
                                animateProps = { left: rightLeft, width: sideImageWidth, height: 200 };
                            } else {
                                // Gauche (moitié visible)
                                animateProps = { left: leftLeft, width: sideImageWidth, height: 200 };
                            }

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ left: viewportCenter + 200, width: sideImageWidth, height: 200 }}
                                    animate={animateProps}
                                    exit={{ left: -200, width: sideImageWidth, height: 200 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        overflow: 'hidden',
                                        borderRadius: '24px',
                                        zIndex: position === 0 ? 3 : 1,
                                    }}
                                >
                                    <img
                                        src={image}
                                        alt={`Onboarding ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center top',
                                            display: 'block',
                                        }}
                                    />
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </Box>

                {/* Dots de pagination */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    {images.map((_, index) => (
                        <Box
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            sx={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor:
                                    index === activeIndex
                                        ? '#225182'
                                        : 'rgba(34, 81, 130, 0.10)',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease-in-out',
                            }}
                        />
                    ))}
                </Box>

                {/* Bouton Commencer */}
                <Box sx={{ px: 3 }}>
                    <PrimaryButton fullWidth onClick={onComplete}>
                        Commencer
                    </PrimaryButton>
                </Box>
            </Box>
        </Box>
    );
}
