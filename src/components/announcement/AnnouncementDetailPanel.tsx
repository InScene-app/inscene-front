import { useNavigate } from 'react-router-dom';
import { Typography, Box, Avatar, Stack } from '@mui/material';
import AnnouncementTags from './AnnouncementTags';
import AnnouncementInfoTags from './AnnouncementInfoTags';
import AnnouncementDetailsBlock from './AnnouncementDetailsBlock';
import AnnouncementProfileBlock from './AnnouncementProfileBlock';
import PrimaryButton from '../common/PrimaryButton';
import SaveButton from './SaveButton';
import { formatRelativeDate } from '../../utils/dateFormat';
import { Announcement } from '../../types/announcement';

interface AnnouncementDetailPanelProps {
  announcement: Announcement;
  isSaved: boolean;
  onToggleSave: () => void;
}

export default function AnnouncementDetailPanel({ announcement, isSaved, onToggleSave }: AnnouncementDetailPanelProps) {
  const navigate = useNavigate();
  const displayDate = formatRelativeDate(announcement.createdAt);

  const handleAuthorClick = () => {
    if (announcement.author?.id) {
      navigate(`/profile/${announcement.author.id}`);
    }
  };

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 4 }}>
      {/* Author + Save */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: announcement.author?.id ? 'pointer' : 'default',
            '&:hover': announcement.author?.id ? { opacity: 0.7 } : {},
          }}
          onClick={handleAuthorClick}
        >
          <Avatar
            src={announcement.author?.avatar || undefined}
            alt={announcement.author?.name}
            sx={{ width: 45, height: 45 }}
          />
          <Typography sx={{ fontSize: '17px', fontWeight: 500 }}>
            {announcement.author?.name}
          </Typography>
        </Box>
        <SaveButton isSaved={isSaved} onToggle={onToggleSave} />
      </Box>

      {/* Title */}
      <Typography sx={{ fontSize: '24px', fontWeight: 700, mb: 2 }}>
        {announcement.title}
      </Typography>

      {/* Tags */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
        <AnnouncementTags isUrgent={announcement.isUrgent} tags={announcement.tags} variant="detail" />
        <AnnouncementInfoTags
          location={announcement.location}
          contractType={announcement.contractType}
          exactSalary={announcement.exactSalary}
          minSalary={announcement.minSalary}
          maxSalary={announcement.maxSalary}
        />
      </Box>

      {/* Candidats + Date */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
          {announcement.applicantsCount !== undefined
            ? `${announcement.applicantsCount} candidat${announcement.applicantsCount > 1 ? 's' : ''}`
            : '0 candidat'}
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{displayDate}</Typography>
      </Stack>

      {/* Postuler */}
      <Box sx={{ mb: 3 }}>
        <PrimaryButton fullWidth>Postuler</PrimaryButton>
      </Box>

      <AnnouncementDetailsBlock
        missionDetails={announcement.missionDetails}
        advantages={announcement.advantages}
        process={announcement.process}
      />

      <Box sx={{ mt: 3 }}>
        <AnnouncementProfileBlock
          profileRequired={announcement.profileRequired}
          skillsRequired={announcement.skillsRequired}
        />
      </Box>
    </Box>
  );
}
