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
        localStorage.setItem('hasSeenOnboarding', 'true');
        navigate('/profile-setup');
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {step === 0 && <OnboardingCarousel onComplete={handleCarouselComplete} />}
            {step === 1 && <OnboardingIntro onNext={handleIntroNext} />}
        </Box>
    );
}
