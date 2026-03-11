import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, TextField, Stack, Divider, IconButton, Alert, Switch,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import PrimaryButton from '../components/common/PrimaryButton';
import api from '../api/client';
import { logout } from '../api/client';
import { useThemeMode } from '../contexts/ThemeContext';

export default function Settings() {
    const navigate = useNavigate();
    const { mode, toggleTheme } = useThemeMode();

    // Password change
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [saving, setSaving] = useState(false);

    const handleChangePassword = async () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('Tous les champs sont obligatoires');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('Le nouveau mot de passe doit contenir au moins 6 caractères');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Les mots de passe ne correspondent pas');
            return;
        }

        setSaving(true);
        try {
            await api.patch('/auth/password', {
                currentPassword,
                newPassword,
            });
            setPasswordSuccess('Mot de passe modifié avec succès');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordForm(false);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setPasswordError(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Header */}
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
            >
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>
                    Paramètres
                </Typography>
            </Box>

            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Alerts */}
                {passwordSuccess && <Alert severity="success" onClose={() => setPasswordSuccess('')}>{passwordSuccess}</Alert>}
                {passwordError && <Alert severity="error" onClose={() => setPasswordError('')}>{passwordError}</Alert>}

                {/* Section Sécurité */}
                <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, overflow: 'hidden' }}>
                    <Typography sx={{ px: 2, pt: 2, pb: 1, fontSize: '14px', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>
                        Sécurité
                    </Typography>

                    {/* Modifier le mot de passe */}
                    <Box
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            px: 2,
                            py: 1.5,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'background.hover' },
                        }}
                    >
                        <LockOutlinedIcon sx={{ color: 'text.secondary' }} />
                        <Typography sx={{ flex: 1, fontSize: '16px' }}>
                            Modifier le mot de passe
                        </Typography>
                        <ChevronRightIcon
                            sx={{
                                color: 'text.secondary',
                                transition: 'transform 0.2s',
                                transform: showPasswordForm ? 'rotate(90deg)' : 'rotate(0deg)',
                            }}
                        />
                    </Box>

                    {showPasswordForm && (
                        <Box sx={{ px: 2, pb: 2, pt: 1 }}>
                            <Stack spacing={2}>
                                <TextField
                                    type="password"
                                    label="Mot de passe actuel"
                                    size="small"
                                    fullWidth
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                                <TextField
                                    type="password"
                                    label="Nouveau mot de passe"
                                    size="small"
                                    fullWidth
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                                <TextField
                                    type="password"
                                    label="Confirmer le nouveau mot de passe"
                                    size="small"
                                    fullWidth
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                                <PrimaryButton
                                    onClick={handleChangePassword}
                                    disabled={saving}
                                    sx={{ borderRadius: '50px' }}
                                >
                                    {saving ? 'Enregistrement...' : 'Changer le mot de passe'}
                                </PrimaryButton>
                            </Stack>
                        </Box>
                    )}
                </Box>

                {/* Section Apparence */}
                <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, overflow: 'hidden' }}>
                    <Typography sx={{ px: 2, pt: 2, pb: 1, fontSize: '14px', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>
                        Apparence
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            px: 2,
                            py: 1.5,
                        }}
                    >
                        <DarkModeOutlinedIcon sx={{ color: 'text.secondary' }} />
                        <Typography sx={{ flex: 1, fontSize: '16px' }}>
                            Mode sombre
                        </Typography>
                        <Switch
                            checked={mode === 'dark'}
                            onChange={toggleTheme}
                        />
                    </Box>
                </Box>

                <Divider />

                {/* Déconnexion */}
                <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, overflow: 'hidden' }}>
                    <Box
                        onClick={handleLogout}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            px: 2,
                            py: 1.5,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: (theme: Theme) => alpha(theme.palette.error.main, 0.08) },
                        }}
                    >
                        <LogoutIcon sx={{ color: 'error.main' }} />
                        <Typography sx={{ fontSize: '16px', color: 'error.main', fontWeight: 500 }}>
                            Se déconnecter
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
