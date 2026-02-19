import { FormEvent, useState } from 'react';
import { Box, Typography, TextField, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../api/client';
import { parseJwt } from '../utils/jwt';
import PrimaryButton from '../components/common/PrimaryButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await api.post('/auth/login', { email, password });
      const token = result.data?.access_token;
      if (token) {
        setAuthToken(token);
        parseJwt(token);
      } else {
        setError('Aucun token reçu du serveur');
        return;
      }
      navigate('/');
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'response' in e) {
        const err = e as { response?: { data?: { message?: string } }; message?: string };
        setError(err?.response?.data?.message || err.message || 'Identifiants incorrects');
      } else {
        setError('Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F2F6FC',
        px: 3,
        // Annuler le padding du MainLayout/Container parent
        mx: { xs: -2.25, md: -3 },
        mt: { xs: -2, md: -10 },
        mb: { xs: -10, md: -2 },
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src="/logo/logo_color.svg"
        alt="InScene"
        sx={{ width: 80, height: 80, mb: 2 }}
      />

      <Typography
        sx={{
          fontFamily: 'Quicksand, sans-serif',
          fontSize: '28px',
          fontWeight: 700,
          mb: 0.5,
          textAlign: 'center',
        }}
      >
        Bon retour !
      </Typography>
      <Typography
        sx={{
          fontSize: '15px',
          color: 'text.secondary',
          mb: 4,
          textAlign: 'center',
        }}
      >
        Connecte-toi à ton compte InScene
      </Typography>

      {/* Card formulaire */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 400,
          bgcolor: 'background.white',
          borderRadius: '24px',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          boxShadow: '0px 4px 20px rgba(0,0,0,0.06)',
        }}
      >
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: '14px' },
          }}
        />

        <TextField
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: '14px' },
          }}
        />

        <PrimaryButton
          type="submit"
          fullWidth
          disabled={loading}
          sx={{ borderRadius: '50px', padding: '14px', fontSize: '16px', mt: 1 }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </PrimaryButton>
      </Box>

      {/* Lien inscription */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
          Pas encore de compte ?{' '}
          <Typography
            component="span"
            onClick={() => navigate('/profile-setup')}
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Créer un compte
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}
