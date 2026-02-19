import { Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EuroIcon from '@mui/icons-material/Euro';
import WorkIcon from '@mui/icons-material/Work';
import { ContractType } from '../../types/announcement';

interface AnnouncementInfoTagsProps {
  location: string;
  contractType: ContractType;
  exactSalary?: number;
  minSalary?: number;
  maxSalary?: number;
}

const contractTypeLabels: Record<ContractType, string> = {
  [ContractType.CDI]: 'CDI',
  [ContractType.CDD]: 'CDD',
  [ContractType.STAGE]: 'Stage',
  [ContractType.ALTERNANCE]: 'Alternance',
  [ContractType.PRESTATION]: 'Prestation',
  [ContractType.BENEVOLAT]: 'Bénévolat',
};

export default function AnnouncementInfoTags({
  location,
  contractType,
  exactSalary,
  minSalary,
  maxSalary,
}: AnnouncementInfoTagsProps) {
  const getSalaryLabel = (): string | null => {
    if (exactSalary) {
      return `${exactSalary}€`;
    }
    if (minSalary && maxSalary) {
      return `${minSalary}€ - ${maxSalary}€`;
    }
    if (minSalary) {
      return `Dès ${minSalary}€`;
    }
    if (maxSalary) {
      return `Jusqu'à ${maxSalary}€`;
    }
    return null;
  };

  const salaryLabel = getSalaryLabel();

  return (
    <>
      {/* Localisation */}
      <Chip
        icon={<LocationOnIcon />}
        label={location}
        size="small"
        sx={{
          fontSize: '14px',
          fontWeight: 500,
          backgroundColor: 'background.middle',
          color: 'text.secondary',
          border: 'none',
          '& .MuiChip-icon': {
            fontSize: '16px',
            color: 'text.secondary',
          },
        }}
      />

      {/* Salaire */}
      {salaryLabel && (
        <Chip
          icon={<EuroIcon />}
          label={salaryLabel}
          size="small"
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            backgroundColor: 'background.middle',
            color: 'text.secondary',
            border: 'none',
            '& .MuiChip-icon': {
              fontSize: '16px',
              color: 'text.secondary',
            },
          }}
        />
      )}

      {/* Type de contrat */}
      <Chip
        icon={<WorkIcon />}
        label={contractTypeLabels[contractType] || contractType}
        size="small"
        sx={{
          fontSize: '14px',
          fontWeight: 500,
          backgroundColor: 'background.middle',
          color: 'text.secondary',
          border: 'none',
          '& .MuiChip-icon': {
            fontSize: '16px',
            color: 'text.secondary',
          },
        }}
      />
    </>
  );
}
