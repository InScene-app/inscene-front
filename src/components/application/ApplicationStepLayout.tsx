import { Box, Typography, Avatar, LinearProgress } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { ReactNode } from 'react';
import { Announcement } from '../../types/announcement';
import PrimaryButton from '../common/PrimaryButton';

interface ApplicationStepLayoutProps {
  announcement: Announcement;
  onBack: () => void;
  progress: number;
  buttonLabel?: string;
  onNext: () => void;
  children: ReactNode;
}

export default function ApplicationStepLayout({
  announcement,
  onBack,
  progress,
  buttonLabel = 'Suivant',
  onNext,
  children,
}: ApplicationStepLayoutProps) {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header partagé */}
      <Box sx={{ px: '28px', pt: '24px' }}>
        <Box
          onClick={onBack}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: 'fit-content', mb: '28px' }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 20, color: 'text.primary' }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: '20px' }}>
          <Avatar
            src={announcement.author?.avatar || undefined}
            alt={announcement.author?.name}
            sx={{ width: 45, height: 45 }}
          />
          <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '17px', fontWeight: 500, color: 'text.primary' }}>
            {announcement.author?.name}
          </Typography>
        </Box>

        <Typography
          sx={{ fontFamily: 'Quicksand, sans-serif', fontSize: '24px', fontWeight: 700, color: 'text.primary', lineHeight: 1.3, mb: '32px' }}
        >
          {announcement.title}
        </Typography>
      </Box>

      {/* Contenu scrollable */}
      <Box sx={{ flex: 1, px: '28px', overflowY: 'auto' }}>
        {children}
      </Box>

      {/* Footer : progress bar + bouton — même padding horizontal */}
      <Box sx={{ px: '20px', pt: '12px', pb: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'background.border',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundColor: 'primary.main',
            },
          }}
        />
        <PrimaryButton fullWidth onClick={onNext}>
          {buttonLabel}
        </PrimaryButton>
      </Box>
    </Box>
  );
}
