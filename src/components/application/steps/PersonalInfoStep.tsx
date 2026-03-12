import { Box, Typography, TextField } from '@mui/material';
import { useState, ChangeEvent } from 'react';
import { ApplicationData } from '../ApplicationFlow';
import { Announcement } from '../../../types/announcement';
import ApplicationStepLayout from '../ApplicationStepLayout';

interface PersonalInfoStepProps {
  announcement: Announcement;
  data: ApplicationData;
  onUpdate: (data: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
  progress: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const inputSx = (hasError = false) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '100px',
    backgroundColor: 'background.paper',
    '& fieldset': { border: hasError ? '1.5px solid #d32f2f' : 'none' },
  },
  '& .MuiInputBase-input::placeholder': {
    fontSize: '13px',
    fontStyle: 'italic',
  },
});

const fieldLabelSx = {
  fontFamily: 'Nunito, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  color: 'text.primary',
  mb: '4px',
};

export default function PersonalInfoStep({
  announcement,
  data,
  onUpdate,
  onNext,
  onBack,
  progress,
}: PersonalInfoStepProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const handleChange = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  };

  const handleNext = (): void => {
    const newErrors: Partial<Record<keyof FormData, boolean>> = {};
    if (!formData.lastName.trim()) newErrors.lastName = true;
    if (!formData.firstName.trim()) newErrors.firstName = true;
    if (!formData.email.trim()) newErrors.email = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onUpdate(formData);
    onNext();
  };

  return (
    <ApplicationStepLayout
      announcement={announcement}
      onBack={onBack}
      progress={progress}
      onNext={handleNext}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px', pb: '16px' }}>
        <Typography
          sx={{ fontFamily: 'Quicksand, sans-serif', fontSize: '17px', fontWeight: 600, color: 'text.primary' }}
        >
          Informations personnelle
        </Typography>

        <Box>
          <Typography sx={fieldLabelSx}>Nom</Typography>
          <TextField
            fullWidth
            placeholder="Votre nom"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            sx={inputSx(errors.lastName)}
          />
        </Box>

        <Box>
          <Typography sx={fieldLabelSx}>Prénom</Typography>
          <TextField
            fullWidth
            placeholder="Votre prénom"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            sx={inputSx(errors.firstName)}
          />
        </Box>

        <Box>
          <Typography sx={fieldLabelSx}>Mail</Typography>
          <TextField
            fullWidth
            placeholder="Votre email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            sx={inputSx(errors.email)}
          />
        </Box>

        <Box>
          <Typography sx={fieldLabelSx}>Téléphone</Typography>
          <TextField
            fullWidth
            placeholder="Votre numéro de téléphone"
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            sx={inputSx()}
          />
        </Box>
      </Box>
    </ApplicationStepLayout>
  );
}
