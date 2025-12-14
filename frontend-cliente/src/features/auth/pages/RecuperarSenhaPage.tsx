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
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import {
  Email,
  Badge,
  ArrowBack,
} from '@mui/icons-material';
import authService from '../../../services/authService';
import type { ResetPasswordForm } from '../../../types';

const schema = yup.object({
  email: yup
    .string()
    .required('E-mail é obrigatório')
    .email('E-mail inválido'),
  cpf: yup
    .string()
    .required('CPF do responsável é obrigatório')
    .matches(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
});

const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

const RecuperarSenhaPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      cpf: '',
    },
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const cleanCPF = data.cpf.replace(/\D/g, '');
      await authService.requestPasswordReset({ ...data, cpf: cleanCPF });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar recuperação de senha');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setValue('cpf', formatted);
  };

  if (success) {
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
        <Card elevation={8} sx={{ borderRadius: 3, maxWidth: 440 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'success.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Email sx={{ fontSize: 32, color: 'success.main' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              E-mail enviado!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enviamos um link de recuperação para o seu e-mail. 
              Verifique sua caixa de entrada e siga as instruções.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              fullWidth
            >
              Voltar para login
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

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
        <Card elevation={8} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Link
              component={RouterLink}
              to="/login"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                mb: 3,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} />
              <Typography variant="body2">Voltar para login</Typography>
            </Link>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Recuperar senha
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Informe o e-mail da empresa e o CPF do responsável legal
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('email')}
                fullWidth
                label="E-mail da empresa"
                placeholder="contato@empresa.com.br"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2.5 }}
              />

              <TextField
                {...register('cpf')}
                fullWidth
                label="CPF do responsável legal"
                placeholder="000.000.000-00"
                error={!!errors.cpf}
                helperText={errors.cpf?.message}
                onChange={handleCPFChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ py: 1.5 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Enviar link de recuperação'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default RecuperarSenhaPage;
