import { Box, Typography, TextField, Collapse, InputAdornment } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import { ProfileData } from '../ProfileSetup';
import PrimaryButton from '../../common/PrimaryButton';
import ProgressBar from '../ProgressBar';
import api from '../../../api/client';

interface Job {
  code: string;
  name: string;
}

interface Category {
  id: number;
  name: string;
  jobs: Job[];
}

interface City {
  nom: string;
  code: string;
  codesPostaux: string[];
}

const EXPERIENCE_LEVELS = [
  'Débutant',
  'Jeune diplômé',
  'Confirmé',
  'Sénior',
  "Chef d'équipe",
];

interface ProfessionalStepProps {
  data: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
  progress: number;
}

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
  backgroundColor: active ? '#FF8C5F' : '#FFFFFF',
  color: active ? '#FFFFFF' : '#000000',
  transition: 'all 0.2s',
  '&:hover': { backgroundColor: active ? '#E67E50' : '#F0F4FA' },
});

const selectAllSx = (active: boolean) => ({
  ...chipSx(active),
  backgroundColor: active ? '#FF8C5F' : '#C7DCF0',
  color: active ? '#FFFFFF' : '#000000',
  '&:hover': { backgroundColor: active ? '#E67E50' : '#B0CCE4' },
});

export default function ProfessionalStep({ onUpdate, onNext, progress }: ProfessionalStepProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const allJobsSelected = categories.length > 0 && categories.every(c => c.jobs.every(j => selectedJobs.has(j.code)));

  const [cityQuery, setCityQuery] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const cityDebounce = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [selectedExperience, setSelectedExperience] = useState<Set<string>>(new Set());
  const allExpSelected = selectedExperience.size === EXPERIENCE_LEVELS.length;

  const [jobError, setJobError] = useState(false);

  useEffect(() => {
    api.get<Category[]>('/category').then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (cityQuery.length < 2) {
      setCitySuggestions([]);
      return;
    }
    clearTimeout(cityDebounce.current);
    cityDebounce.current = setTimeout(() => {
      fetch(`https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(cityQuery)}&fields=nom,code,codesPostaux&limit=5`)
        .then(r => r.json())
        .then((cities: City[]) => setCitySuggestions(cities))
        .catch(() => setCitySuggestions([]));
    }, 300);
  }, [cityQuery]);

  // -- Jobs --
  const handleToggleCategory = (categoryId: number) => {
    setOpenCategory(prev => prev === categoryId ? null : categoryId);
  };

  const handleToggleJob = (job: Job) => {
    setSelectedJobs(prev => {
      const next = new Set(prev);
      if (next.has(job.code)) next.delete(job.code);
      else next.add(job.code);
      return next;
    });
    if (jobError) setJobError(false);
  };

  const handleSelectAllJobs = () => {
    if (allJobsSelected) {
      setSelectedJobs(new Set());
    } else {
      const all = new Set<string>();
      categories.forEach(c => c.jobs.forEach(j => all.add(j.code)));
      setSelectedJobs(all);
    }
  };

  // -- City --
  const handleSelectCity = (city: City) => {
    setSelectedCity(city.nom);
    setCityQuery(city.nom);
    setCitySuggestions([]);
  };

  // -- Experience --
  const handleToggleExperience = (level: string) => {
    setSelectedExperience(prev => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  };

  const handleSelectAllExperience = () => {
    if (allExpSelected) {
      setSelectedExperience(new Set());
    } else {
      setSelectedExperience(new Set(EXPERIENCE_LEVELS));
    }
  };

  const handleNext = (): void => {
    if (selectedJobs.size === 0) {
      setJobError(true);
      return;
    }

    onUpdate({
      jobCodes: Array.from(selectedJobs),
      location: selectedCity,
      experience: Array.from(selectedExperience)[0] || '',
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

      <Box sx={{ px: '36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
        Profil professionnel
      </Typography>

      {/* Bloc 1 - Métier */}
      <Box>
        <Typography
          variant="inherit"
          sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600, color: jobError ? '#d32f2f' : '#000000', mb: '8px' }}
        >
          Métier *{jobError && ' — Sélectionne au moins un métier'}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Tout sélectionner */}
          <Box onClick={handleSelectAllJobs} sx={selectAllSx(allJobsSelected)}>
            Tout sélectionner
            {allJobsSelected && <CheckIcon sx={{ fontSize: 16 }} />}
          </Box>

          {categories.map((category) => {
            const categoryJobsSelected = category.jobs.every(j => selectedJobs.has(j.code));
            return (
              <Box key={category.id}>
                <Box
                  onClick={() => handleToggleCategory(category.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: categoryJobsSelected ? '#225182' : '#FFFFFF',
                    borderRadius: '24px',
                    px: '16px',
                    py: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { backgroundColor: categoryJobsSelected ? '#1A3F66' : '#F0F4FA' },
                  }}
                >
                  <Typography
                    variant="inherit"
                    sx={{
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: categoryJobsSelected ? '#FFFFFF' : '#000000',
                    }}
                  >
                    {category.name}
                  </Typography>
                  <KeyboardArrowDownIcon
                    sx={{
                      fontSize: 20,
                      color: categoryJobsSelected ? '#FFFFFF' : '#666',
                      transition: 'transform 0.2s',
                      transform: openCategory === category.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </Box>

                <Collapse in={openCategory === category.id}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px', mt: '6px', ml: '8px' }}>
                    {category.jobs.map((job) => {
                      const active = selectedJobs.has(job.code);
                      return (
                        <Box key={job.code} onClick={() => handleToggleJob(job)} sx={chipSx(active)}>
                          {job.name}
                          {active && <CheckIcon sx={{ fontSize: 14 }} />}
                        </Box>
                      );
                    })}
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Bloc 2 - Localisation */}
      <Box>
        <Typography
          variant="inherit"
          sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600, color: '#000000', mb: '4px' }}
        >
          Localisation
        </Typography>
        <TextField
          fullWidth
          placeholder="Lyon"
          value={cityQuery}
          onChange={(e) => {
            setCityQuery(e.target.value);
            if (selectedCity) setSelectedCity('');
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: '#999' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '100px',
              backgroundColor: '#FFFFFF',
              '& fieldset': { border: 'none' },
            },
            '& .MuiInputBase-input::placeholder': {
              fontSize: '13px',
              fontStyle: 'italic',
            },
          }}
        />
        {citySuggestions.length > 0 && !selectedCity && (
          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              mt: '4px',
              overflow: 'hidden',
            }}
          >
            {citySuggestions.map((city) => (
              <Box
                key={city.code}
                onClick={() => handleSelectCity(city)}
                sx={{
                  px: '16px',
                  py: '10px',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#F0F4FA' },
                }}
              >
                <Typography
                  variant="inherit"
                  sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#000000' }}
                >
                  {city.nom} {city.codesPostaux?.[0] && `(${city.codesPostaux[0]})`}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Bloc 3 - Niveau d'expérience */}
      <Box>
        <Typography
          variant="inherit"
          sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600, color: '#000000', mb: '8px' }}
        >
          Niveau d'expérience
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Box onClick={handleSelectAllExperience} sx={selectAllSx(allExpSelected)}>
            Tout sélectionner
            {allExpSelected && <CheckIcon sx={{ fontSize: 16 }} />}
          </Box>
          {EXPERIENCE_LEVELS.map((level) => {
            const active = selectedExperience.has(level);
            return (
              <Box key={level} onClick={() => handleToggleExperience(level)} sx={chipSx(active)}>
                {level}
                {active && <CheckIcon sx={{ fontSize: 14 }} />}
              </Box>
            );
          })}
        </Box>
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
