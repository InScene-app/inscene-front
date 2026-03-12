import { Box, Typography, TextField } from '@mui/material';
import { useState, ChangeEvent } from 'react';
import { ProfileData } from '../ProfileSetup';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PrimaryButton from '../../common/PrimaryButton';
import ProgressBar from '../ProgressBar';
import { parseJwt } from '../../../utils/jwt';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            context?: string;
          }) => void;
          prompt: () => void;
        };
      };
    };
    AppleID?: {
      auth: {
        init: (config: object) => void;
        signIn: () => Promise<{ authorization: { id_token: string } }>;
      };
    };
  }
}

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
    backgroundColor: 'background.paper',
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

  // -- Google Sign-In --
  const handleGoogleSignIn = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
    if (!clientId) {
      console.warn('[PersonalInfoStep] VITE_GOOGLE_CLIENT_ID non configuré');
      return;
    }

    const init = () => {
      window.google!.accounts.id.initialize({
        client_id: clientId,
        context: 'signup',
        callback: (response) => {
          const payload = parseJwt(response.credential) as {
            given_name?: string;
            family_name?: string;
            email?: string;
          } | null;
          if (payload) {
            setFormData(prev => ({
              ...prev,
              firstName: payload.given_name || prev.firstName,
              lastName: payload.family_name || prev.lastName,
              email: payload.email || prev.email,
            }));
            setErrors({});
          }
        },
      });
      window.google!.accounts.id.prompt();
    };

    if (window.google) {
      init();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = init;
      document.head.appendChild(script);
    }
  };

  // -- Apple Sign-In --
  const handleAppleSignIn = () => {
    const clientId = import.meta.env.VITE_APPLE_CLIENT_ID as string | undefined;
    if (!clientId) {
      console.warn('[PersonalInfoStep] VITE_APPLE_CLIENT_ID non configuré — Sign in with Apple nécessite un Apple Developer account');
      return;
    }

    const loadAndSignIn = () => {
      window.AppleID!.auth.init({
        clientId,
        scope: 'name email',
        redirectURI: `${window.location.origin}/auth/apple/callback`,
        usePopup: true,
      });
      window.AppleID!.auth.signIn().then((res) => {
        const payload = parseJwt(res.authorization.id_token) as {
          given_name?: string;
          family_name?: string;
          email?: string;
        } | null;
        if (payload) {
          setFormData(prev => ({
            ...prev,
            firstName: payload.given_name || prev.firstName,
            lastName: payload.family_name || prev.lastName,
            email: payload.email || prev.email,
          }));
          setErrors({});
        }
      }).catch(console.error);
    };

    if (window.AppleID) {
      loadAndSignIn();
    } else {
      const script = document.createElement('script');
      script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
      script.async = true;
      script.onload = loadAndSignIn;
      document.head.appendChild(script);
    }
  };

  // -- LinkedIn Sign-In --
  const handleLinkedInSignIn = () => {
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID as string | undefined;
    if (!clientId) {
      console.warn('[PersonalInfoStep] VITE_LINKEDIN_CLIENT_ID non configuré — intégration LinkedIn nécessite un backend');
      return;
    }
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/linkedin/callback`);
    const scope = encodeURIComponent('openid profile email');
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('linkedin_oauth_state', state);
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
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
          color: 'text.primary',
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
            color: 'text.primary',
          }}
        >
          Récupérer via :
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          {[
            { icon: <GoogleIcon sx={{ fontSize: 24 }} />, label: 'Google', onClick: handleGoogleSignIn },
            { icon: <AppleIcon sx={{ fontSize: 24 }} />, label: 'Apple', onClick: handleAppleSignIn },
            { icon: <LinkedInIcon sx={{ fontSize: 24, color: '#0A66C2' }} />, label: 'LinkedIn', onClick: handleLinkedInSignIn },
          ].map((item) => (
            <Box
              key={item.label}
              onClick={item.onClick}
              sx={{
                width: '78px',
                height: '50px',
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'background.border',
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { backgroundColor: 'background.hover' },
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
            color: 'text.primary',
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
            color: 'text.primary',
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
              color: 'text.primary',
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
              color: 'text.primary',
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
              color: 'text.primary',
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
              color: 'text.primary',
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
