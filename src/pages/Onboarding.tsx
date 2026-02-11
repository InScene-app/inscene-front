import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import OnboardingCarousel from '../components/profile/OnboardingCarousel';
import OnboardingIntro from '../components/profile/OnboardingIntro';

export default function Onboarding() {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();

    const handleCarouselComplete = () => {
        setStep(1);
    };

    const handleIntroNext = () => {
        // Marquer l'onboarding comme vu en mode normal
        const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';
        if (!isDevMode) {
            localStorage.setItem('hasSeenOnboarding', 'true');
        }
        // Rediriger vers profile-setup (WelcomeStep sans navbar)
        navigate('/profile-setup');
    };

    return (
        <Box>
            {step === 0 && <OnboardingCarousel onComplete={handleCarouselComplete} />}
            {step === 1 && <OnboardingIntro onNext={handleIntroNext} />}
        </Box>
    );
}
