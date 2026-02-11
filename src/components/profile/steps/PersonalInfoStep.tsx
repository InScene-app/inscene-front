import { Box, Typography, TextField } from '@mui/material';
import { useState, ChangeEvent } from 'react';
import { ProfileData } from '../ProfileSetup';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PrimaryButton from '../../common/PrimaryButton';
import ProgressBar from '../ProgressBar';

interface PersonalInfoStepProps {
  data: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
  progress: number;
}

interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const inputSx = (hasError = false) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '100px',
    backgroundColor: '#FFFFFF',
    '& fieldset': { border: hasError ? '1.5px solid #d32f2f' : 'none' },
  },
  '& .MuiInputBase-input::placeholder': {
    fontSize: '13px',
    fontStyle: 'italic',
  },
});

export default function PersonalInfoStep({ data, onUpdate, onNext, progress }: PersonalInfoStepProps) {
  const [formData, setFormData] = useState<PersonalInfoFormData>({
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    password: data.password || '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalInfoFormData, boolean>>>({});

  const handleChange = (field: keyof PersonalInfoFormData) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  };

  const handleNext = (): void => {
    const newErrors: Partial<Record<keyof PersonalInfoFormData, boolean>> = {};
    if (!formData.lastName.trim()) newErrors.lastName = true;
    if (!formData.firstName.trim()) newErrors.firstName = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.password.trim()) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onUpdate(formData);
    onNext();
  };

  return (
    <Box
      sx={{
        backgroundColor: '#F2F6FC',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        px: '16px',
        py: '24px',
        gap: '20px',
      }}
    >
      {/* Spacer haut */}
      <Box sx={{ flex: 1 }} />

      {/* Titre principal */}
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
        Informations personnelles
      </Typography>

      {/* Conteneur 1 - Récupérer via */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Typography
          variant="inherit"
          sx={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '19px',
            fontWeight: 600,
            textAlign: 'center',
            color: '#000000',
          }}
        >
          Récupérer via :
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          {[
            { icon: <GoogleIcon sx={{ fontSize: 24 }} />, label: 'Google' },
            { icon: <AppleIcon sx={{ fontSize: 24 }} />, label: 'Apple' },
            { icon: <LinkedInIcon sx={{ fontSize: 24, color: '#0A66C2' }} />, label: 'LinkedIn' },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{
                width: '78px',
                height: '50px',
                backgroundColor: '#C7DCF0',
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {item.icon}
            </Box>
          ))}
        </Box>

        <Typography
          variant="inherit"
          sx={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '17px',
            fontWeight: 400,
            textAlign: 'center',
            color: '#000000',
          }}
        >
          ou
        </Typography>

        <TextField
          fullWidth
          placeholder="Réseau social, plateforme recrutement..."
          sx={inputSx()}
        />
      </Box>

      {/* Conteneur 2 - Renseigner manuellement */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          borderRadius: '20px',
          p: '20px',
        }}
      >
        <Typography
          variant="inherit"
          sx={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '19px',
            fontWeight: 600,
            textAlign: 'center',
            color: '#000000',
          }}
        >
          Renseigner manuellement
        </Typography>

        <Box>
          <Typography
            variant="inherit"
            sx={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#000000',
              mb: '4px',
            }}
          >
            Nom *
          </Typography>
          <TextField
            fullWidth
            placeholder="Votre nom"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            sx={inputSx(errors.lastName)}
          />
        </Box>

        <Box>
          <Typography
            variant="inherit"
            sx={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#000000',
              mb: '4px',
            }}
          >
            Prénom *
          </Typography>
          <TextField
            fullWidth
            placeholder="Votre prénom"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            sx={inputSx(errors.firstName)}
          />
        </Box>

        <Box>
          <Typography
            variant="inherit"
            sx={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#000000',
              mb: '4px',
            }}
          >
            Email *
          </Typography>
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
          <Typography
            variant="inherit"
            sx={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#000000',
              mb: '4px',
            }}
          >
            Mot de passe *
          </Typography>
          <TextField
            fullWidth
            placeholder="Votre mot de passe"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            sx={inputSx(errors.password)}
          />
        </Box>
      </Box>

      {/* Spacer pour pousser le bas */}
      <Box sx={{ flex: 1 }} />

      {/* Barre d'avancement + Bouton Suivant */}
      <ProgressBar progress={progress} />
      <PrimaryButton fullWidth onClick={handleNext}>
        Suivant
      </PrimaryButton>
    </Box>
  );
}
