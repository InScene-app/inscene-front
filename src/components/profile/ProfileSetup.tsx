import { JSX, useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WelcomeStep from './steps/WelcomeStep';
import PersonalInfoStep from './steps/PersonalInfoStep';
import ProfessionalStep from './steps/ProfessionalStep';
import AchievementsStep from './steps/AchievementsStep';
import CompletionStep from './steps/CompletionStep';
import api from '../../api/client';
import { setAuthToken } from '../../api/client';
import { parseJwt } from '../../utils/jwt';

export interface ProfileData {
  // Informations personnelles
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  // Profil professionnel
  experience: string;
  location: string;
  jobCodes: string[];

  // Réalisations
  socialLinks: string[];
}

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    experience: '',
    location: '',
    jobCodes: [],
    socialLinks: [],
  });

  const handleNext = (): void => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = (): void => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleUpdateData = (data: Partial<ProfileData>): void => {
    setProfileData(prev => ({ ...prev, ...data }));
  };

  const handleComplete = async (): Promise<void> => {
    try {
      // 1. Créer l'individual
      await api.post('/individual', {
        email: profileData.email,
        password: profileData.password,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
      });

      // 2. Auto-login pour récupérer le JWT
      const loginRes = await api.post('/auth/login', {
        email: profileData.email,
        password: profileData.password,
      });
      const token = loginRes.data?.access_token;
      if (!token) throw new Error('No token');
      setAuthToken(token);

      const payload = parseJwt(token);
      const userId = payload?.sub as number;

      // 3. PATCH avec les données supplémentaires
      const patchData: Record<string, unknown> = {};
      if (profileData.experience) patchData.experience = profileData.experience;
      if (profileData.location) patchData.location = [profileData.location];
      if (profileData.jobCodes.length > 0) patchData.jobCodes = profileData.jobCodes;

      if (Object.keys(patchData).length > 0) {
        await api.patch(`/individual/${userId}`, patchData);
      }

      localStorage.setItem('profileCompleted', 'true');
      navigate('/');
    } catch (err: unknown) {
      console.error('Erreur création profil:', err);
    }
  };

  const getProgress = (): number => {
    switch (currentStep) {
      case 1: return 0; // WelcomeStep
      case 2: return 25; // PersonalInfoStep
      case 3: return 50; // ProfessionalStep
      case 4: return 75; // AchievementsStep
      case 5: return 100; // CompletionStep
      default: return 0;
    }
  };

  const renderStep = (): JSX.Element | null => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onStart={handleNext} />;
      case 2:
        return (
          <PersonalInfoStep
            data={profileData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
            onBack={handleBack}
            progress={getProgress()}
          />
        );
      case 3:
        return (
          <ProfessionalStep
            data={profileData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
            onBack={handleBack}
            progress={getProgress()}
          />
        );
      case 4:
        return (
          <AchievementsStep
            data={profileData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
            onBack={handleBack}
            progress={getProgress()}
          />
        );
      case 5:
        return (
          <CompletionStep
            onViewProfile={() => {/* TODO: Navigate to profile */}}
            onComplete={handleComplete}
            progress={getProgress()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      {renderStep()}
    </Box>
  );
}
