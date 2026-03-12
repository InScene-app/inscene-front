import { Box, Typography, TextField, Checkbox } from '@mui/material';
import { useState, useRef } from 'react';
import LinkIcon from '@mui/icons-material/Link';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AddIcon from '@mui/icons-material/Add';
import { SvgIcon } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { ApplicationData, SocialLinkEntry } from '../ApplicationFlow';
import { Announcement } from '../../../types/announcement';
import { User, UserFile } from '../../../types/user';
import ApplicationStepLayout from '../ApplicationStepLayout';

interface AdditionalInfoStepProps {
  announcement: Announcement;
  currentUser: User;
  data: ApplicationData;
  onUpdate: (data: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
  progress: number;
}

// Icône TikTok SVG custom
function TikTokIcon() {
  return (
    <SvgIcon sx={{ fontSize: 20 }}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z" />
    </SvgIcon>
  );
}

// Icône Twitter/X SVG custom
function XIcon() {
  return (
    <SvgIcon sx={{ fontSize: 20 }}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </SvgIcon>
  );
}

const PLATFORMS = [
  { key: 'tiktok', icon: <TikTokIcon />, label: 'TikTok' },
  { key: 'instagram', icon: <InstagramIcon sx={{ fontSize: 20 }} />, label: 'Instagram' },
  { key: 'facebook', icon: <FacebookIcon sx={{ fontSize: 20 }} />, label: 'Facebook' },
  { key: 'twitter', icon: <XIcon />, label: 'Twitter' },
  { key: 'youtube', icon: <YouTubeIcon sx={{ fontSize: 20 }} />, label: 'YouTube' },
];

const iconBoxSx = (active: boolean) => ({
  width: 48,
  height: 40,
  borderRadius: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: active ? 'secondary.main' : 'secondary.light',
  color: active ? '#FFFFFF' : 'text.primary',
  transition: 'all 0.2s',
  userSelect: 'none',
});

const autreSx = (active: boolean) => ({
  height: 40,
  px: '14px',
  borderRadius: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: active ? 'secondary.main' : 'secondary.light',
  color: active ? '#FFFFFF' : 'text.primary',
  fontFamily: 'Nunito, sans-serif',
  fontSize: '13px',
  fontWeight: 600,
  transition: 'all 0.2s',
  userSelect: 'none',
});

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '100px',
    backgroundColor: 'background.paper',
    '& fieldset': { border: 'none' },
  },
  '& .MuiInputBase-input::placeholder': { fontSize: '13px', fontStyle: 'italic' },
};

interface DocFileItem {
  id: string;
  name: string;
  valid: boolean;
  file?: File;
  userFileId?: number;
}

function FileRow({ item, checked, onToggle, onDelete }: { item: DocFileItem; checked: boolean; onToggle: () => void; onDelete: () => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', py: '4px' }}>
      <Checkbox checked={checked} onChange={onToggle} sx={{ p: 0, color: 'background.border', '&.Mui-checked': { color: 'secondary.main' } }} />
      <Typography sx={{ flex: 1, fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.name}
      </Typography>
      {item.valid ? <CheckCircleIcon sx={{ fontSize: 18, color: '#4CAF50', flexShrink: 0 }} /> : <ErrorIcon sx={{ fontSize: 18, color: '#F44336', flexShrink: 0 }} />}
      <DeleteOutlineIcon onClick={onDelete} sx={{ fontSize: 20, color: 'text.secondary', cursor: 'pointer', flexShrink: 0, '&:hover': { color: '#F44336' } }} />
    </Box>
  );
}

export default function AdditionalInfoStep({
  announcement,
  currentUser,
  data,
  onUpdate,
  onNext,
  onBack,
  progress,
}: AdditionalInfoStepProps) {
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLinkEntry[]>(data.socialLinks);

  // Documents additionnels
  const profileDocs: DocFileItem[] = (currentUser.files || [])
    .filter((f: UserFile) => f.category === 'Attachment')
    .map(f => ({ id: String(f.id), name: f.filename, valid: true, userFileId: f.id }));
  const [docFiles, setDocFiles] = useState<DocFileItem[]>(profileDocs);
  const [docChecked, setDocChecked] = useState<string[]>(profileDocs.map(f => f.id));
  const fileRef = useRef<HTMLInputElement>(null);

  const togglePlatform = (key: string) => {
    setActivePlatform(prev => prev === key ? null : key);
    setLinkTitle('');
    setLinkUrl('');
  };

  const addLink = () => {
    if (!activePlatform || !linkUrl.trim()) return;
    const label = [...PLATFORMS, { key: 'autre', label: 'Autre' }].find(p => p.key === activePlatform)?.label || activePlatform;
    setSocialLinks(prev => [...prev, { platform: label, title: linkTitle, url: linkUrl }]);
    setLinkTitle('');
    setLinkUrl('');
    setActivePlatform(null);
  };

  const removeLink = (index: number) => setSocialLinks(prev => prev.filter((_, i) => i !== index));

  const addDocFile = (file: File) => {
    const item: DocFileItem = { id: `doc-${Date.now()}`, name: file.name, valid: true, file };
    setDocFiles(prev => [...prev, item]);
    setDocChecked(prev => [...prev, item.id]);
  };

  const toggleDoc = (id: string) => setDocChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const deleteDoc = (id: string) => { setDocFiles(prev => prev.filter(f => f.id !== id)); setDocChecked(prev => prev.filter(x => x !== id)); };

  const handleNext = () => {
    onUpdate({
      socialLinks,
      additionalDocuments: docFiles.filter(f => docChecked.includes(f.id) && f.userFileId).map(f => f.userFileId!),
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

        {/* Liens et réseaux sociaux */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Typography sx={{ fontFamily: 'Quicksand, sans-serif', fontSize: '17px', fontWeight: 600, color: 'text.primary' }}>
            Informations complémentaires
          </Typography>
          <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 600, color: 'text.primary' }}>
            Liens et réseaux sociaux
          </Typography>

          {/* Icônes plateformes */}
          <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {PLATFORMS.map(p => (
              <Box key={p.key} sx={iconBoxSx(activePlatform === p.key)} onClick={() => togglePlatform(p.key)}>
                {p.icon}
              </Box>
            ))}
            <Box sx={autreSx(activePlatform === 'autre')} onClick={() => togglePlatform('autre')}>
              Autre
            </Box>
          </Box>

          {/* Formulaire d'ajout de lien */}
          {activePlatform && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Box>
                <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600, color: 'text.primary', mb: '4px' }}>
                  Titre
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Indiquez la nature du contenu"
                  value={linkTitle}
                  onChange={e => setLinkTitle(e.target.value)}
                  sx={inputSx}
                />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600, color: 'text.primary', mb: '4px' }}>
                  Lien
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'background.paper', borderRadius: '100px', px: '16px', py: '4px' }}>
                  <LinkIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <input
                    type="url"
                    placeholder="Insérer un lien"
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Nunito, sans-serif', fontSize: '14px', width: '100%', color: 'inherit' }}
                  />
                </Box>
              </Box>
              <Box
                onClick={addLink}
                sx={{
                  display: 'inline-flex', alignItems: 'center', px: '18px', py: '8px',
                  borderRadius: '24px', cursor: 'pointer', width: 'fit-content',
                  backgroundColor: 'secondary.main', color: '#fff',
                  fontSize: '14px', fontFamily: 'Nunito, sans-serif', fontWeight: 600,
                  '&:hover': { backgroundColor: 'secondary.dark' },
                }}
              >
                Ajouter
              </Box>
            </Box>
          )}

          {/* Liste des liens ajoutés */}
          {socialLinks.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {socialLinks.map((link, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'background.paper', borderRadius: '12px', px: '14px', py: '8px' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600, color: 'text.primary' }}>
                      {link.platform}{link.title ? ` — ${link.title}` : ''}
                    </Typography>
                    <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {link.url}
                    </Typography>
                  </Box>
                  <DeleteOutlineIcon onClick={() => removeLink(i)} sx={{ fontSize: 18, cursor: 'pointer', color: 'text.secondary', '&:hover': { color: '#F44336' } }} />
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Documents */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Typography sx={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 600, color: 'text.primary' }}>
            Documents
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {docFiles.map(item => (
              <FileRow key={item.id} item={item} checked={docChecked.includes(item.id)} onToggle={() => toggleDoc(item.id)} onDelete={() => deleteDoc(item.id)} />
            ))}
          </Box>
          <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) addDocFile(e.target.files[0]); }} />
          <Box
            onClick={() => fileRef.current?.click()}
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              px: '14px', py: '8px', borderRadius: '24px', cursor: 'pointer',
              backgroundColor: 'secondary.main', color: '#fff',
              fontSize: '13px', fontFamily: 'Nunito, sans-serif', fontWeight: 600, width: 'fit-content',
              '&:hover': { backgroundColor: 'secondary.dark' },
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
            Ajouter un fichier
          </Box>
        </Box>

      </Box>
    </ApplicationStepLayout>
  );
}
