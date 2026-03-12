import { Box, Typography, TextField } from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { ApplicationData } from '../ApplicationFlow';
import { Announcement } from '../../../types/announcement';
import { User } from '../../../types/user';
import ApplicationStepLayout from '../ApplicationStepLayout';

interface SkillsStepProps {
  announcement: Announcement;
  currentUser: User;
  data: ApplicationData;
  onUpdate: (data: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
  progress: number;
}

const EXPERIENCE_LEVELS = ['Débutant', 'Confirmé', 'Senior', 'Jeune diplômé', "Chef d'équipe"];

const chipSx = (active: boolean) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  px: '14px',
  py: '8px',
  borderRadius: '24px',
  cursor: 'pointer',
  fontSize: '14px',
  fontFamily: 'Nunito, sans-serif',
  fontWeight: active ? 600 : 400,
  backgroundColor: active ? 'secondary.main' : 'background.paper',
  color: active ? '#FFFFFF' : 'text.primary',
  transition: 'all 0.2s',
  userSelect: 'none',
  '&:hover': { opacity: 0.85 },
});

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

export default function SkillsStep({
  announcement,
  currentUser,
  data,
  onUpdate,
  onNext,
  onBack,
  progress,
}: SkillsStepProps) {
  // Initialise les skills depuis le profil utilisateur
  const userJobNames = (currentUser.jobs || []).map(j => j.name);
  const [availableSkills, setAvailableSkills] = useState<string[]>(userJobNames);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(data.skills.length > 0 ? data.skills : userJobNames);
  const [experienceLevel, setExperienceLevel] = useState<string>(data.experienceLevel);
  const [availability, setAvailability] = useState<'immediate' | 'date'>(data.availability);
  const [availabilityDate, setAvailabilityDate] = useState<string>(data.availabilityDate);
  const [newSkill, setNewSkill] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed || availableSkills.includes(trimmed)) return;
    setAvailableSkills(prev => [...prev, trimmed]);
    setSelectedSkills(prev => [...prev, trimmed]);
    setNewSkill('');
    setShowSkillInput(false);
  };

  const handleNext = () => {
    onUpdate({ skills: selectedSkills, experienceLevel, availability, availabilityDate });
    onNext();
  };

  return (
    <ApplicationStepLayout
      announcement={announcement}
      onBack={onBack}
      progress={progress}
      onNext={handleNext}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', pb: '16px' }}>

        {/* Compétences mises en avant */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Typography sx={{ fontFamily: 'Quicksand, sans-serif', fontSize: '17px', fontWeight: 600, color: 'text.primary' }}>
            Compétences mises en avant
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {availableSkills.map(skill => {
              const active = selectedSkills.includes(skill);
              return (
                <Box key={skill} sx={chipSx(active)} onClick={() => toggleSkill(skill)}>
                  {active && <CheckIcon sx={{ fontSize: 14 }} />}
                  {skill}
                </Box>
              );
            })}
            {/* Bouton + */}
            {showSkillInput ? (
              <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Ajouter une compétence"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addSkill(); if (e.key === 'Escape') setShowSkillInput(false); }}
                  autoFocus
                  sx={{ ...inputSx, width: '180px' }}
                />
                <Box
                  onClick={addSkill}
                  sx={{
                    px: '12px', py: '6px', borderRadius: '24px', cursor: 'pointer',
                    backgroundColor: 'secondary.main', color: '#fff',
                    fontSize: '13px', fontFamily: 'Nunito, sans-serif', fontWeight: 600,
                  }}
                >
                  OK
                </Box>
              </Box>
            ) : (
              <Box
                onClick={() => setShowSkillInput(true)}
                sx={{
                  width: 36, height: 36, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  backgroundColor: 'background.paper', color: 'text.primary',
                  '&:hover': { backgroundColor: 'background.hover' },
                }}
              >
                <AddIcon sx={{ fontSize: 20 }} />
              </Box>
            )}
          </Box>
        </Box>

        {/* Niveau d'expérience */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Typography sx={{ fontFamily: 'Quicksand, sans-serif', fontSize: '17px', fontWeight: 600, color: 'text.primary' }}>
            Niveau d'expérience
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {EXPERIENCE_LEVELS.map(level => {
              const active = experienceLevel === level;
              return (
                <Box key={level} sx={chipSx(active)} onClick={() => setExperienceLevel(active ? '' : level)}>
                  {active && <CheckIcon sx={{ fontSize: 14 }} />}
                  {level}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Disponibilité */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Typography sx={{ fontFamily: 'Quicksand, sans-serif', fontSize: '17px', fontWeight: 600, color: 'text.primary' }}>
            Disponibilité
          </Typography>
          <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Box sx={chipSx(availability === 'immediate')} onClick={() => setAvailability('immediate')}>
              {availability === 'immediate' && <CheckIcon sx={{ fontSize: 14 }} />}
              Immédiate
            </Box>
            <Box sx={chipSx(availability === 'date')} onClick={() => setAvailability('date')}>
              {availability === 'date' && <CheckIcon sx={{ fontSize: 14 }} />}
              À partir du
            </Box>
          </Box>
          {availability === 'date' && (
            <TextField
              fullWidth
              type="date"
              value={availabilityDate}
              onChange={e => setAvailabilityDate(e.target.value)}
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
              sx={inputSx}
            />
          )}
        </Box>

      </Box>
    </ApplicationStepLayout>
  );
}
