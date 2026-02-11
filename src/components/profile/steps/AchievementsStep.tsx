import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { useState } from 'react';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { ProfileData } from '../ProfileSetup';
import PrimaryButton from '../../common/PrimaryButton';
import ProgressBar from '../ProgressBar';

// Simple SVG icons for TikTok and X (not in MUI)
const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface AchievementsStepProps {
  data: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
  progress: number;
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '100px',
    backgroundColor: '#FFFFFF',
    '& fieldset': { border: 'none' },
  },
  '& .MuiInputBase-input::placeholder': {
    fontSize: '13px',
    fontStyle: 'italic',
  },
};

const iconBoxSx = (active: boolean) => ({
  width: '48px',
  height: '40px',
  backgroundColor: active ? '#225182' : '#C7DCF0',
  borderRadius: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s',
  color: active ? '#FFFFFF' : '#000000',
  flexShrink: 0,
});

const toggleBoxSx = (active: boolean) => ({
  height: '40px',
  backgroundColor: active ? '#225182' : '#C7DCF0',
  borderRadius: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  px: '16px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  color: active ? '#FFFFFF' : '#000000',
});

const SOCIALS = [
  { key: 'tiktok', icon: <TikTokIcon />, label: 'TikTok' },
  { key: 'instagram', icon: <InstagramIcon sx={{ fontSize: 20 }} />, label: 'Instagram' },
  { key: 'facebook', icon: <FacebookIcon sx={{ fontSize: 20 }} />, label: 'Facebook' },
  { key: 'x', icon: <XIcon />, label: 'X' },
  { key: 'youtube', icon: <YouTubeIcon sx={{ fontSize: 20 }} />, label: 'YouTube' },
  { key: 'autre', icon: null, label: 'Autre' },
];

export default function AchievementsStep({ onUpdate, onNext, progress }: AchievementsStepProps) {
  const [selectedSocials, setSelectedSocials] = useState<Set<string>>(new Set());
  const [showAutreInputs, setShowAutreInputs] = useState(false);
  const [autreNature, setAutreNature] = useState('');
  const [autreLink, setAutreLink] = useState('');

  const [activePortfolioToggle, setActivePortfolioToggle] = useState<'lien' | 'fichier' | null>(null);
  const [portfolioLink, setPortfolioLink] = useState('');

  const handleToggleSocial = (key: string) => {
    if (key === 'autre') {
      setShowAutreInputs(prev => !prev);
      return;
    }
    setSelectedSocials(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleNext = (): void => {
    const socialLinks = Array.from(selectedSocials);
    if (autreLink.trim()) socialLinks.push(autreLink.trim());
    onUpdate({
      socialLinks,
    });
    onNext();
  };

  return (
    <Box
      sx={{
        backgroundColor: '#F2F6FC',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        py: '24px',
        gap: '20px',
      }}
    >
      {/* Spacer haut */}
      <Box sx={{ flex: 1 }} />

      <Box sx={{ px: '36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Titre */}
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
          Réalisations
        </Typography>

        {/* Bloc 1 - Réseaux sociaux */}
        <Box>
          <Typography
            variant="inherit"
            sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600, color: '#000000', mb: '12px' }}
          >
            Réseaux sociaux
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
            {SOCIALS.map((social) => {
              const active = social.key === 'autre' ? showAutreInputs : selectedSocials.has(social.key);
              if (social.key === 'autre') {
                return (
                  <Box key={social.key} onClick={() => handleToggleSocial(social.key)} sx={toggleBoxSx(active)}>
                    <Typography variant="inherit" sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 600 }}>
                      Autre
                    </Typography>
                  </Box>
                );
              }
              return (
                <Box key={social.key} onClick={() => handleToggleSocial(social.key)} sx={iconBoxSx(active)}>
                  {social.icon}
                </Box>
              );
            })}
          </Box>

          {/* Inputs "Autre" */}
          {showAutreInputs && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mt: '12px' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Indiquez la nature du contenu"
                value={autreNature}
                onChange={(e) => setAutreNature(e.target.value)}
                sx={inputSx}
              />
              <TextField
                fullWidth
                size="small"
                placeholder="Insérez un lien"
                value={autreLink}
                onChange={(e) => setAutreLink(e.target.value)}
                sx={inputSx}
              />
              <PrimaryButton
                onClick={() => {}}
                sx={{ alignSelf: 'flex-start', backgroundColor: '#225182', '&:hover': { backgroundColor: '#1A3F66' } }}
              >
                Ajouter
              </PrimaryButton>
            </Box>
          )}
        </Box>

        {/* Bloc 2 - Diplômes */}
        <Box>
          <Typography
            variant="inherit"
            sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600, color: '#000000', mb: '8px' }}
          >
            Diplômes
          </Typography>
          <PrimaryButton
            onClick={() => {}}
            sx={{
              backgroundColor: '#225182',
              '&:hover': { backgroundColor: '#1A3F66' },
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <AddIcon sx={{ fontSize: 18 }} />
            Ajouter un fichier
          </PrimaryButton>
        </Box>

        {/* Bloc 3 - Portfolio et CV */}
        <Box>
          <Typography
            variant="inherit"
            sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600, color: '#000000', mb: '8px' }}
          >
            Portfolio et CV
          </Typography>

          <Box sx={{ display: 'flex', gap: '8px', mb: activePortfolioToggle === 'lien' ? '12px' : 0 }}>
            <Box
              onClick={() => setActivePortfolioToggle(prev => prev === 'lien' ? null : 'lien')}
              sx={toggleBoxSx(activePortfolioToggle === 'lien')}
            >
              <LinkIcon sx={{ fontSize: 18 }} />
              <Typography variant="inherit" sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 600 }}>
                Lien
              </Typography>
            </Box>
            <Box
              onClick={() => setActivePortfolioToggle(prev => prev === 'fichier' ? null : 'fichier')}
              sx={toggleBoxSx(activePortfolioToggle === 'fichier')}
            >
              <UploadFileIcon sx={{ fontSize: 18 }} />
              <Typography variant="inherit" sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 600 }}>
                Fichier
              </Typography>
            </Box>
          </Box>

          {activePortfolioToggle === 'lien' && (
            <TextField
              fullWidth
              size="small"
              placeholder="Insérer votre lien"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <PrimaryButton
                        onClick={() => {}}
                        sx={{
                          backgroundColor: '#225182',
                          '&:hover': { backgroundColor: '#1A3F66' },
                          minWidth: 'auto',
                          py: '4px',
                          px: '14px',
                          fontSize: '12px',
                        }}
                      >
                        Ajouter
                      </PrimaryButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={inputSx}
            />
          )}
        </Box>
      </Box>

      {/* Spacer bas */}
      <Box sx={{ flex: 1 }} />

      {/* Barre d'avancement + Bouton Suivant */}
      <Box sx={{ px: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ProgressBar progress={progress} />
        <PrimaryButton fullWidth onClick={handleNext}>
          Suivant
        </PrimaryButton>
      </Box>
    </Box>
  );
}
