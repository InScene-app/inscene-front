import { Box, Typography, Checkbox } from '@mui/material';
import { useState, useRef } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { ApplicationData } from '../ApplicationFlow';
import { Announcement } from '../../../types/announcement';
import { User, UserFile } from '../../../types/user';
import ApplicationStepLayout from '../ApplicationStepLayout';

interface DocumentsStepProps {
  announcement: Announcement;
  currentUser: User;
  data: ApplicationData;
  onUpdate: (data: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
  progress: number;
}

type PortfolioMode = 'profile' | 'link' | 'file';

interface FileItem {
  id: string;
  name: string;
  valid: boolean;
  file?: File;
  userFileId?: number;
}

const toggleSx = (active: boolean) => ({
  px: '14px',
  py: '7px',
  borderRadius: '100px',
  cursor: 'pointer',
  fontSize: '13px',
  fontFamily: 'Nunito, sans-serif',
  fontWeight: 600,
  backgroundColor: active ? 'secondary.main' : 'secondary.light',
  color: active ? '#FFFFFF' : 'text.primary',
  transition: 'all 0.2s',
  userSelect: 'none',
});

const sectionTitleSx = {
  fontFamily: 'Quicksand, sans-serif',
  fontSize: '17px',
  fontWeight: 600,
  color: 'text.primary',
};

function FileRow({
  item,
  checked,
  onToggle,
  onDelete,
}: {
  item: FileItem;
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        py: '4px',
      }}
    >
      <Checkbox
        checked={checked}
        onChange={onToggle}
        sx={{ p: 0, color: 'background.border', '&.Mui-checked': { color: 'secondary.main' } }}
      />
      <Typography
        sx={{ flex: 1, fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {item.name}
      </Typography>
      {item.valid
        ? <CheckCircleIcon sx={{ fontSize: 18, color: '#4CAF50', flexShrink: 0 }} />
        : <ErrorIcon sx={{ fontSize: 18, color: '#F44336', flexShrink: 0 }} />
      }
      <DeleteOutlineIcon
        onClick={onDelete}
        sx={{ fontSize: 20, color: 'text.secondary', cursor: 'pointer', flexShrink: 0, '&:hover': { color: '#F44336' } }}
      />
    </Box>
  );
}

function AddFileButton({ onAdd }: { onAdd: (file: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input ref={ref} type="file" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) onAdd(e.target.files[0]); }} />
      <Box
        onClick={() => ref.current?.click()}
        sx={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          px: '14px', py: '8px', borderRadius: '24px', cursor: 'pointer',
          backgroundColor: 'secondary.main', color: '#fff',
          fontSize: '13px', fontFamily: 'Nunito, sans-serif', fontWeight: 600,
          width: 'fit-content',
          '&:hover': { backgroundColor: 'secondary.dark' },
        }}
      >
        <AddIcon sx={{ fontSize: 16 }} />
        Ajouter un fichier
      </Box>
    </>
  );
}

export default function DocumentsStep({
  announcement,
  currentUser,
  data,
  onUpdate,
  onNext,
  onBack,
  progress,
}: DocumentsStepProps) {
  // Initialise depuis les fichiers du profil
  const profileCvFiles: FileItem[] = (currentUser.files || [])
    .filter((f: UserFile) => f.category === 'Diploma')
    .map(f => ({ id: String(f.id), name: f.filename, valid: true, userFileId: f.id }));

  const profilePortfolioFiles: FileItem[] = (currentUser.files || [])
    .filter((f: UserFile) => f.category === 'Portfolio')
    .map(f => ({ id: String(f.id), name: f.filename, valid: true, userFileId: f.id }));

  const [cvFiles, setCvFiles] = useState<FileItem[]>(profileCvFiles);
  const [cvChecked, setCvChecked] = useState<string[]>(profileCvFiles.map(f => f.id));

  const [portfolioMode, setPortfolioMode] = useState<PortfolioMode>(data.portfolioMode);
  const [portfolioFiles, setPortfolioFiles] = useState<FileItem[]>(profilePortfolioFiles);
  const [portfolioChecked, setPortfolioChecked] = useState<string[]>(profilePortfolioFiles.map(f => f.id));
  const [portfolioLink, setPortfolioLink] = useState(data.portfolioLink);

  const toggleCv = (id: string) => setCvChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const togglePortfolio = (id: string) => setPortfolioChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const addCvFile = (file: File) => {
    const item: FileItem = { id: `new-cv-${Date.now()}`, name: file.name, valid: true, file };
    setCvFiles(prev => [...prev, item]);
    setCvChecked(prev => [...prev, item.id]);
  };

  const addPortfolioFile = (file: File) => {
    const item: FileItem = { id: `new-p-${Date.now()}`, name: file.name, valid: true, file };
    setPortfolioFiles(prev => [...prev, item]);
    setPortfolioChecked(prev => [...prev, item.id]);
  };

  const deleteCv = (id: string) => {
    setCvFiles(prev => prev.filter(f => f.id !== id));
    setCvChecked(prev => prev.filter(x => x !== id));
  };

  const deletePortfolio = (id: string) => {
    setPortfolioFiles(prev => prev.filter(f => f.id !== id));
    setPortfolioChecked(prev => prev.filter(x => x !== id));
  };

  const handleNext = () => {
    onUpdate({
      cvFiles: cvFiles.filter(f => cvChecked.includes(f.id) && f.userFileId).map(f => f.userFileId!),
      portfolioMode,
      portfolioFiles: portfolioFiles.filter(f => portfolioChecked.includes(f.id) && f.userFileId).map(f => f.userFileId!),
      portfolioLink,
    });
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

        {/* CV */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Typography sx={sectionTitleSx}>CV et portfolio</Typography>
          <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 600, color: 'text.primary' }}>CV</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {cvFiles.map(item => (
              <FileRow key={item.id} item={item} checked={cvChecked.includes(item.id)} onToggle={() => toggleCv(item.id)} onDelete={() => deleteCv(item.id)} />
            ))}
          </Box>
          <AddFileButton onAdd={addCvFile} />
        </Box>

        {/* Portfolio */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 600, color: 'text.primary' }}>Portfolio</Typography>

          {/* Onglets */}
          <Box sx={{ display: 'flex', gap: '8px' }}>
            {(['profile', 'link', 'file'] as PortfolioMode[]).map(mode => {
              const labels: Record<PortfolioMode, string> = { profile: 'Depuis mon profil', link: 'Lien', file: 'Fichier' };
              return (
                <Box key={mode} sx={toggleSx(portfolioMode === mode)} onClick={() => setPortfolioMode(mode)}>
                  {labels[mode]}
                </Box>
              );
            })}
          </Box>

          {/* Contenu selon onglet */}
          {portfolioMode === 'profile' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {portfolioFiles.length === 0 && (
                <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
                  Aucun fichier portfolio sur votre profil
                </Typography>
              )}
              {portfolioFiles.map(item => (
                <FileRow key={item.id} item={item} checked={portfolioChecked.includes(item.id)} onToggle={() => togglePortfolio(item.id)} onDelete={() => deletePortfolio(item.id)} />
              ))}
            </Box>
          )}

          {portfolioMode === 'link' && (
            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: 'background.paper', borderRadius: '100px', px: '16px', py: '4px',
              }}
            >
              <Typography sx={{ fontSize: '16px' }}>🔗</Typography>
              <input
                type="url"
                placeholder="Insérer un lien"
                value={portfolioLink}
                onChange={e => setPortfolioLink(e.target.value)}
                style={{
                  border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: 'Nunito, sans-serif', fontSize: '14px', width: '100%',
                  color: 'inherit',
                }}
              />
            </Box>
          )}

          {portfolioMode === 'file' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {portfolioFiles.map(item => (
                  <FileRow key={item.id} item={item} checked={portfolioChecked.includes(item.id)} onToggle={() => togglePortfolio(item.id)} onDelete={() => deletePortfolio(item.id)} />
                ))}
              </Box>
              <AddFileButton onAdd={addPortfolioFile} />
            </Box>
          )}
        </Box>

      </Box>
    </ApplicationStepLayout>
  );
}
