import { Box, Typography, Avatar } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EditIcon from '@mui/icons-material/Edit';
import { LinearProgress } from '@mui/material';
import { ApplicationData } from '../ApplicationFlow';
import { Announcement } from '../../../types/announcement';
import PrimaryButton from '../../common/PrimaryButton';

interface ReviewStepProps {
  announcement: Announcement;
  data: ApplicationData;
  onBack: () => void;
  onGoToStep: (step: number) => void;
  onSubmit: () => void;
  progress: number;
}

function SectionBlock({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontFamily: 'Quicksand, sans-serif', fontSize: '16px', fontWeight: 700, color: 'text.primary' }}>
          {title}
        </Typography>
        <EditIcon
          onClick={onEdit}
          sx={{ fontSize: 18, cursor: 'pointer', color: 'text.primary', '&:hover': { color: 'primary.main' } }}
        />
      </Box>
      {children}
    </Box>
  );
}

function InfoLine({ value }: { value: string }) {
  return (
    <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: 'text.primary' }}>
      {value}
    </Typography>
  );
}

export default function ReviewStep({
  announcement,
  data,
  onBack,
  onGoToStep,
  onSubmit,
  progress,
}: ReviewStepProps) {
  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>

      {/* Header partagé */}
      <Box sx={{ px: '28px', pt: '24px' }}>
        <Box onClick={onBack} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: 'fit-content', mb: '28px' }}>
          <ArrowBackIosNewIcon sx={{ fontSize: 20, color: 'text.primary' }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: '20px' }}>
          <Avatar src={announcement.author?.avatar || undefined} alt={announcement.author?.name} sx={{ width: 45, height: 45 }} />
          <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '17px', fontWeight: 500, color: 'text.primary' }}>
            {announcement.author?.name}
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: 'Quicksand, sans-serif', fontSize: '24px', fontWeight: 700, color: 'text.primary', lineHeight: 1.3, mb: '32px' }}>
          {announcement.title}
        </Typography>
      </Box>

      {/* Contenu scrollable */}
      <Box sx={{ flex: 1, px: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', pb: '16px' }}>

        {/* Titre + avertissement */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography sx={{ fontFamily: 'Quicksand, sans-serif', fontSize: '20px', fontWeight: 700, color: 'text.primary' }}>
            Votre candidature
          </Typography>
          <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontStyle: 'italic', color: 'text.secondary', lineHeight: 1.5 }}>
            Avant d'envoyer votre candidature, vérifiez que toutes vos informations sont claires et complètes. Une fois la candidature envoyée, vous ne pourrez plus modifier vos informations.
          </Typography>
        </Box>

        {/* Informations personnelles */}
        <SectionBlock title="Informations personnelles" onEdit={() => onGoToStep(1)}>
          {data.lastName && <InfoLine value={data.lastName.toUpperCase()} />}
          {data.firstName && <InfoLine value={data.firstName} />}
          {data.email && <InfoLine value={data.email} />}
          {data.phone && <InfoLine value={data.phone} />}
        </SectionBlock>

        {/* Compétences */}
        <SectionBlock title="Compétences" onEdit={() => onGoToStep(2)}>
          {data.skills.length > 0
            ? <InfoLine value={data.skills.join(' / ')} />
            : <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>Aucune compétence sélectionnée</Typography>
          }
          {data.experienceLevel && <InfoLine value={data.experienceLevel} />}
          {data.availability === 'immediate'
            ? <InfoLine value="Disponibilité immédiate" />
            : data.availabilityDate
              ? <InfoLine value={`Disponible à partir du ${new Date(data.availabilityDate).toLocaleDateString('fr-FR')}`} />
              : null
          }
        </SectionBlock>

      </Box>

      {/* Footer */}
      <Box sx={{ px: '20px', pt: '12px', pb: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'background.border',
            '& .MuiLinearProgress-bar': { borderRadius: 4, backgroundColor: 'primary.main' },
          }}
        />
        <PrimaryButton fullWidth onClick={onSubmit}>
          Terminer
        </PrimaryButton>
      </Box>

    </Box>
  );
}
