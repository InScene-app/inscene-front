import { JSX, useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Announcement } from '../../types/announcement';
import { User } from '../../types/user';
import { applyToAnnouncement } from '../../api/announcementService';
import { parseJwt } from '../../utils/jwt';
import PersonalInfoStep from './steps/PersonalInfoStep';
import SkillsStep from './steps/SkillsStep';
import DocumentsStep from './steps/DocumentsStep';
import AdditionalInfoStep from './steps/AdditionalInfoStep';
import ReviewStep from './steps/ReviewStep';
import ConfirmationStep from './steps/ConfirmationStep';

export interface SocialLinkEntry {
  platform: string;
  title: string;
  url: string;
}

export interface ApplicationData {
  // Étape 1 – Informations personnelles
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Étape 2 – Compétences
  skills: string[];
  experienceLevel: string;
  availability: 'immediate' | 'date';
  availabilityDate: string;

  // Étape 3 – CV & Portfolio
  cvFiles: number[];
  portfolioMode: 'profile' | 'link' | 'file';
  portfolioFiles: number[];
  portfolioLink: string;

  // Étape 4 – Informations complémentaires
  socialLinks: SocialLinkEntry[];
  additionalDocuments: number[];
}

interface ApplicationFlowProps {
  announcement: Announcement;
  currentUser: User;
  onBack: () => void;
}

const TOTAL_STEPS = 5; // Étapes avec progress bar (1-5), step 6 = confirmation sans barre

export default function ApplicationFlow({ announcement, currentUser, onBack }: ApplicationFlowProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    firstName: currentUser.firstName || '',
    lastName: currentUser.lastName || '',
    email: currentUser.email || '',
    phone: '',
    skills: [],
    experienceLevel: currentUser.experience || '',
    availability: 'immediate',
    availabilityDate: '',
    cvFiles: [],
    portfolioMode: 'profile',
    portfolioFiles: [],
    portfolioLink: '',
    socialLinks: [],
    additionalDocuments: [],
  });

  const getProgress = (): number => Math.round((currentStep / TOTAL_STEPS) * 100);

  const handleNext = (): void => {
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS + 1));
  };

  const handleBack = (): void => {
    if (currentStep === 1) {
      onBack();
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };

  const handleGoToStep = (step: number): void => {
    setCurrentStep(step);
  };

  const handleUpdateData = (data: Partial<ApplicationData>): void => {
    setApplicationData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('access_token');
      const payload = parseJwt(token || '');
      const userId = payload?.sub as number | undefined;
      if (userId) {
        await applyToAnnouncement(announcement.id, userId);
      }
    } catch (err) {
      console.error('Erreur lors de la soumission de la candidature:', err);
    }
    setCurrentStep(6);
  };

  const renderStep = (): JSX.Element | null => {
    const sharedProps = {
      announcement,
      currentUser,
      data: applicationData,
      onUpdate: handleUpdateData,
      onNext: handleNext,
      onBack: handleBack,
      progress: getProgress(),
    };

    switch (currentStep) {
      case 1:
        return <PersonalInfoStep {...sharedProps} />;
      case 2:
        return <SkillsStep {...sharedProps} />;
      case 3:
        return <DocumentsStep {...sharedProps} />;
      case 4:
        return <AdditionalInfoStep {...sharedProps} />;
      case 5:
        return (
          <ReviewStep
            announcement={announcement}
            data={applicationData}
            onBack={handleBack}
            onGoToStep={handleGoToStep}
            onSubmit={handleSubmit}
            progress={getProgress()}
          />
        );
      case 6:
        return (
          <ConfirmationStep
            announcement={announcement}
            onConsult={() => navigate(`/announcement/${announcement.id}`, { replace: true })}
            onHome={() => navigate('/', { replace: true })}
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
