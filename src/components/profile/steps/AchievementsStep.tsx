import { Box, Typography, TextField, InputAdornment, useTheme, IconButton } from '@mui/material';
import { useState, useRef, type ChangeEvent } from 'react';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkIcon from '@mui/icons-material/Link';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
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
    backgroundColor: 'background.paper',
    '& fieldset': { border: 'none' },
  },
  '& .MuiInputBase-input::placeholder': {
    fontSize: '13px',
    fontStyle: 'italic',
  },
};

const iconBoxSx = (active: boolean, isDark: boolean) => ({
  width: '48px',
  height: '40px',
  backgroundColor: active ? (isDark ? 'secondary.main' : 'primary.main') : 'background.paper',
  borderRadius: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s',
  color: active ? '#FFFFFF' : 'text.primary',
  flexShrink: 0,
});

const toggleBoxSx = (active: boolean, isDark: boolean) => ({
  height: '40px',
  backgroundColor: active ? (isDark ? 'secondary.main' : 'primary.main') : 'background.paper',
  borderRadius: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  px: '16px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  color: active ? '#FFFFFF' : 'text.primary',
});

const SOCIALS = [
  { key: 'tiktok', icon: <TikTokIcon />, label: 'TikTok', placeholder: 'Lien TikTok' },
  { key: 'instagram', icon: <InstagramIcon sx={{ fontSize: 20 }} />, label: 'Instagram', placeholder: 'Lien Instagram' },
  { key: 'facebook', icon: <FacebookIcon sx={{ fontSize: 20 }} />, label: 'Facebook', placeholder: 'Lien Facebook' },
  { key: 'x', icon: <XIcon />, label: 'X', placeholder: 'Lien X (Twitter)' },
  { key: 'youtube', icon: <YouTubeIcon sx={{ fontSize: 20 }} />, label: 'YouTube', placeholder: 'Lien YouTube' },
  { key: 'autre', icon: null, label: 'Autre', placeholder: '' },
];

export default function AchievementsStep({ onUpdate, onNext, progress }: AchievementsStepProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [showAutreInputs, setShowAutreInputs] = useState(false);
  const [autreNature, setAutreNature] = useState('');
  const [autreLink, setAutreLink] = useState('');

  const [activePortfolioToggle, setActivePortfolioToggle] = useState<'lien' | 'fichier' | null>(null);
  const [portfolioLink, setPortfolioLink] = useState('');

  const diplomeInputRef = useRef<HTMLInputElement>(null);
  const [diplomeFile, setDiplomeFile] = useState<File | null>(null);

  const handleToggleSocial = (key: string) => {
    if (key === 'autre') {
      setShowAutreInputs(prev => !prev);
      return;
    }
    setSocialLinks(prev => {
      const next = { ...prev };
      if (key in next) {
        delete next[key];
      } else {
        next[key] = '';
      }
      return next;
    });
  };

  const handleSocialLinkChange = (key: string, url: string) => {
    setSocialLinks(prev => ({ ...prev, [key]: url }));
  };

  const handleDiplomeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setDiplomeFile(file);
  };

  const handleNext = (): void => {
    const links: { key: string; url: string }[] = Object.entries(socialLinks)
      .filter(([, url]) => url.trim())
      .map(([key, url]) => ({ key, url: url.trim() }));
    if (autreLink.trim()) links.push({ key: 'autre', url: autreLink.trim() });
    onUpdate({ socialLinks: links, diplomeFile: diplomeFile || undefined });
    onNext();
  };

  const activeSocials = SOCIALS.filter(s => s.key !== 'autre' && s.key in socialLinks);

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
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
            color: 'text.primary',
          }}
        >
          Réalisations
        </Typography>

        {/* Bloc 1 - Réseaux sociaux */}
        <Box>
          <Typography
            variant="inherit"
            sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600, color: 'text.primary', mb: '12px' }}
          >
            Réseaux sociaux
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '6px', flexWrap: 'wrap' }}>
            {SOCIALS.map((social) => {
              const active = social.key === 'autre' ? showAutreInputs : social.key in socialLinks;
              if (social.key === 'autre') {
                return (
                  <Box key={social.key} onClick={() => handleToggleSocial(social.key)} sx={toggleBoxSx(active, isDark)}>
                    <Typography variant="inherit" sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 600 }}>
                      Autre
                    </Typography>
                  </Box>
                );
              }
              return (
                <Box key={social.key} onClick={() => handleToggleSocial(social.key)} sx={iconBoxSx(active, isDark)}>
                  {social.icon}
                </Box>
              );
            })}
          </Box>

          {/* Inputs par réseau actif */}
          {activeSocials.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mt: '12px' }}>
              {activeSocials.map((social) => (
                <TextField
                  key={social.key}
                  fullWidth
                  size="small"
                  placeholder={social.placeholder}
                  value={socialLinks[social.key] || ''}
                  onChange={(e) => handleSocialLinkChange(social.key, e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <PrimaryButton
                            onClick={() => {}}
                            sx={{
                              backgroundColor: isDark ? 'secondary.main' : 'primary.main',
                              '&:hover': { backgroundColor: isDark ? 'secondary.dark' : 'primary.dark' },
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
              ))}
            </Box>
          )}

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
            </Box>
          )}
        </Box>

        {/* Bloc 2 - Diplômes */}
        <Box>
          <Typography
            variant="inherit"
            sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600, color: 'text.primary', mb: '8px' }}
          >
            Diplômes
          </Typography>
          <input
            ref={diplomeInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={handleDiplomeChange}
          />

          {/* Card du fichier sélectionné */}
          {diplomeFile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                mb: '8px',
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <InsertDriveFileOutlinedIcon sx={{ color: 'primary.main', fontSize: 28, flexShrink: 0 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {diplomeFile.name}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {diplomeFile.name.split('.').pop()?.toUpperCase()} —{' '}
                  {diplomeFile.size >= 1000000
                    ? `${(diplomeFile.size / 1000000).toFixed(1)} Mo`
                    : `${Math.round(diplomeFile.size / 1000)} Ko`}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => {
                  setDiplomeFile(null);
                  if (diplomeInputRef.current) diplomeInputRef.current.value = '';
                }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          )}

          {/* Bouton ajouter */}
          <Box onClick={() => diplomeInputRef.current?.click()} sx={{ ...toggleBoxSx(false, isDark), width: 'fit-content' }}>
            <AddIcon sx={{ fontSize: 18 }} />
            <Typography variant="inherit" sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 600 }}>
              Ajouter un fichier
            </Typography>
          </Box>
        </Box>

        {/* Bloc 3 - Portfolio et CV */}
        <Box>
          <Typography
            variant="inherit"
            sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600, color: 'text.primary', mb: '8px' }}
          >
            Portfolio et CV
          </Typography>

          <Box sx={{ display: 'flex', gap: '8px', mb: activePortfolioToggle === 'lien' ? '12px' : 0 }}>
            <Box
              onClick={() => setActivePortfolioToggle(prev => prev === 'lien' ? null : 'lien')}
              sx={toggleBoxSx(activePortfolioToggle === 'lien', isDark)}
            >
              <LinkIcon sx={{ fontSize: 18 }} />
              <Typography variant="inherit" sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 600 }}>
                Lien
              </Typography>
            </Box>
            <Box
              onClick={() => setActivePortfolioToggle(prev => prev === 'fichier' ? null : 'fichier')}
              sx={toggleBoxSx(activePortfolioToggle === 'fichier', isDark)}
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
                          backgroundColor: isDark ? 'secondary.main' : 'primary.main',
                          '&:hover': { backgroundColor: isDark ? 'secondary.dark' : 'primary.dark' },
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
