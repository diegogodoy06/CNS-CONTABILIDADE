import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Link,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Business,
  Lock,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { RootState } from '../../../store';
import { loginStart, loginSuccess, loginFailure } from '../../../store/slices/authSlice';
import authService from '../../../services/authService';
import type { LoginForm } from '../../../types';

// Validação do formulário
const schema = yup.object({
  cnpj: yup
    .string()
    .required('CNPJ é obrigatório')
    .matches(/^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido'),
  senha: yup
    .string()
    .required('Senha é obrigatória')
    .min(8, 'Senha deve ter no mínimo 8 caracteres'),
  lembrar: yup.boolean().default(false),
}).required();

// Formatação de CNPJ
const formatCNPJ = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      cnpj: '',
      senha: '',
      lembrar: false,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    dispatch(loginStart());
    try {
      // Remove formatação do CNPJ antes de enviar
      const cleanCNPJ = data.cnpj.replace(/\D/g, '');
      const result = await authService.login({ ...data, cnpj: cleanCNPJ });
      dispatch(loginSuccess(result));
      navigate('/dashboard');
    } catch (err) {
      dispatch(loginFailure(err instanceof Error ? err.message : 'Erro ao fazer login'));
    }
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setValue('cnpj', formatted);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        {/* Logo e título */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 2,
              bgcolor: 'primary.main',
              mb: 2,
            }}
          >
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
              C
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            CNS Contábil
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.400', mt: 1 }}>
            Plataforma de Gestão Contábil Digital
          </Typography>
        </Box>

        <Card elevation={8} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Acesse sua conta
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Entre com seu CNPJ e senha para continuar
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('cnpj')}
                fullWidth
                label="CNPJ"
                placeholder="00.000.000/0000-00"
                error={!!errors.cnpj}
                helperText={errors.cnpj?.message}
                onChange={handleCNPJChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2.5 }}
              />

              <TextField
                {...register('senha')}
                fullWidth
                label="Senha"
                type={showPassword ? 'text' : 'password'}
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
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                  control={<Checkbox {...register('lembrar')} color="primary" size="small" />}
                  label={<Typography variant="body2">Lembrar-me</Typography>}
                />
                <Link
                  component={RouterLink}
                  to="/recuperar-senha"
                  variant="body2"
                  sx={{ textDecoration: 'none' }}
                >
                  Esqueceu a senha?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ py: 1.5, fontSize: '1rem' }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Precisa de ajuda?
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Entre em contato com seu escritório de contabilidade
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 3, color: 'grey.400' }}>
          © {new Date().getFullYear()} CNS Contábil. Todos os direitos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
