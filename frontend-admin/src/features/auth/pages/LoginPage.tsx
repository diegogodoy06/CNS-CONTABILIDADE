import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { RootState } from '../../../store';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../../../store/slices/authSlice';
import { authService } from '../../../services/authService';

interface LoginForm {
  email: string;
  senha: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    dispatch(loginStart());
    try {
      const result = await authService.login(data);
      dispatch(loginSuccess(result));
      navigate('/');
    } catch (err) {
      dispatch(
        loginFailure(err instanceof Error ? err.message : 'Erro ao fazer login')
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo e título */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'primary.main',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <AdminPanelSettings sx={{ fontSize: 36, color: 'white' }} />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              CNS Contabilidade
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Portal Administrativo
            </Typography>
          </Box>

          {/* Alerta de erro */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              {...register('senha', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter no mínimo 6 caracteres',
                },
              })}
              error={!!errors.senha}
              helperText={errors.senha?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Rodapé */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} CNS Contabilidade. Todos os direitos
              reservados.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
