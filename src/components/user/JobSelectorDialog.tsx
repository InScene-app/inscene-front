import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, Collapse, Chip, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import { Category } from '../../api/userService';

interface JobSelectorDialogProps {
    open: boolean;
    onClose: () => void;
    categories: Category[];
    editJobCodes: string[];
    onToggleJob: (code: string) => void;
}

export default function JobSelectorDialog({ open, onClose, categories, editJobCodes, onToggleJob }: JobSelectorDialogProps) {
    const [openCategory, setOpenCategory] = useState<number | null>(null);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Sélectionner des métiers
                <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent>
                {categories.map((category) => (
                    <Box key={category.id} sx={{ mb: 1 }}>
                        <Box onClick={() => setOpenCategory(prev => prev === category.id ? null : category.id)}
                            sx={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                backgroundColor: '#F2F6FC', borderRadius: '12px', px: 2, py: 1.5,
                                cursor: 'pointer', '&:hover': { backgroundColor: '#E3ECF7' },
                            }}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{category.name}</Typography>
                            <KeyboardArrowDownIcon sx={{
                                fontSize: 20, color: '#666', transition: 'transform 0.2s',
                                transform: openCategory === category.id ? 'rotate(180deg)' : 'rotate(0deg)',
                            }} />
                        </Box>
                        <Collapse in={openCategory === category.id}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, ml: 1, mb: 1 }}>
                                {category.jobs.map((job) => {
                                    const active = editJobCodes.includes(job.code);
                                    return (
                                        <Chip key={job.code} label={job.name} size="small"
                                            onClick={() => onToggleJob(job.code)}
                                            icon={active ? <CheckIcon sx={{ fontSize: 14 }} /> : undefined}
                                            sx={{
                                                fontSize: '13px', fontWeight: active ? 600 : 400,
                                                backgroundColor: active ? '#FF8C5F' : '#FFFFFF',
                                                color: active ? '#FFFFFF' : '#000000',
                                                border: active ? 'none' : '1px solid #E0E0E0',
                                                cursor: 'pointer', '& .MuiChip-icon': { color: '#FFFFFF' },
                                                '&:hover': { backgroundColor: active ? '#E67E50' : '#F0F4FA' },
                                            }} />
                                    );
                                })}
                            </Box>
                        </Collapse>
                    </Box>
                ))}
            </DialogContent>
        </Dialog>
    );
}
