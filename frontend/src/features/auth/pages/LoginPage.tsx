import React, { useState, useEffect, useCallback } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Business,
  Lock,
  Refresh,
  Warning,
  LockClock,
  Security,
  PhoneAndroid,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { RootState } from '../../../store';
import { loginStart, loginSuccess, loginFailure } from '../../../store/slices/authSlice';
import authService from '../../../services/authService';
import type { LoginForm } from '../../../types';

// Constantes de segurança
const MAX_ATTEMPTS_BEFORE_CAPTCHA = 3;
const MAX_ATTEMPTS_BEFORE_BLOCK = 5;
const BLOCK_DURATION_MINUTES = 5;

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

// Gerador de captcha simples
const generateCaptcha = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  
  // Security states
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);
  const [remainingBlockTime, setRemainingBlockTime] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  
  // 2FA states
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAError, setTwoFAError] = useState('');
  const [pendingLoginData, setPendingLoginData] = useState<LoginForm | null>(null);

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

  // Check if account is blocked
  const isBlocked = Boolean(blockedUntil && new Date() < blockedUntil);

  // Update block timer
  useEffect(() => {
    if (!blockedUntil) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((blockedUntil.getTime() - now.getTime()) / 1000));
      setRemainingBlockTime(diff);
      
      if (diff === 0) {
        setBlockedUntil(null);
        setLoginAttempts(0);
        setShowCaptcha(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [blockedUntil]);

  // Show captcha after N attempts
  useEffect(() => {
    if (loginAttempts >= MAX_ATTEMPTS_BEFORE_CAPTCHA) {
      setShowCaptcha(true);
    }
  }, [loginAttempts]);

  const refreshCaptcha = useCallback(() => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput('');
    setCaptchaError('');
  }, []);

  const handleLoginAttempt = async (data: LoginForm) => {
    // Check if blocked
    if (isBlocked) {
      return;
    }

    // Validate captcha if required
    if (showCaptcha) {
      if (captchaInput.toUpperCase() !== captchaCode) {
        setCaptchaError('Código incorreto. Tente novamente.');
        refreshCaptcha();
        return;
      }
    }

    dispatch(loginStart());
    try {
      const cleanCNPJ = data.cnpj.replace(/\D/g, '');
      const result = await authService.login({ ...data, cnpj: cleanCNPJ });
      
      // Check if 2FA is required (simulated - always show for demo CNPJ)
      if (cleanCNPJ === '12345678000199') {
        setPendingLoginData(data);
        setShow2FADialog(true);
        dispatch(loginFailure('')); // Clear loading state
        return;
      }
      
      // Reset security states on success
      setLoginAttempts(0);
      setShowCaptcha(false);
      dispatch(loginSuccess(result));
      navigate('/dashboard');
    } catch (err) {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      
      // Block account after max attempts
      if (attempts >= MAX_ATTEMPTS_BEFORE_BLOCK) {
        const blockUntil = new Date();
        blockUntil.setMinutes(blockUntil.getMinutes() + BLOCK_DURATION_MINUTES);
        setBlockedUntil(blockUntil);
      }
      
      refreshCaptcha();
      dispatch(loginFailure(err instanceof Error ? err.message : 'Erro ao fazer login'));
    }
  };

  const handle2FASubmit = async () => {
    if (twoFACode.length !== 6) {
      setTwoFAError('Digite o código de 6 dígitos');
      return;
    }

    // Simulate 2FA validation (in production, this would be an API call)
    if (twoFACode === '123456') {
      setShow2FADialog(false);
      setTwoFACode('');
      setTwoFAError('');
      setLoginAttempts(0);
      setShowCaptcha(false);
      
      // Complete login
      if (pendingLoginData) {
        const cleanCNPJ = pendingLoginData.cnpj.replace(/\D/g, '');
        const result = await authService.login({ ...pendingLoginData, cnpj: cleanCNPJ });
        dispatch(loginSuccess(result));
        navigate('/dashboard');
      }
    } else {
      setTwoFAError('Código inválido. Tente novamente.');
    }
  };

  const onSubmit = async (data: LoginForm) => {
    await handleLoginAttempt(data);
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setValue('cnpj', formatted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

            {/* Block Warning */}
            {isBlocked && (
              <Alert 
                severity="error" 
                icon={<LockClock />}
                sx={{ mb: 3 }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Conta bloqueada temporariamente
                </Typography>
                <Typography variant="body2">
                  Muitas tentativas de login. Tente novamente em {formatTime(remainingBlockTime)}.
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(1 - remainingBlockTime / (BLOCK_DURATION_MINUTES * 60)) * 100}
                  sx={{ mt: 1, height: 4, borderRadius: 2 }}
                />
              </Alert>
            )}

            {/* Attempts Warning */}
            {!isBlocked && loginAttempts > 0 && loginAttempts < MAX_ATTEMPTS_BEFORE_BLOCK && (
              <Alert 
                severity="warning" 
                icon={<Warning />}
                sx={{ mb: 3 }}
              >
                <Typography variant="body2">
                  Tentativa {loginAttempts} de {MAX_ATTEMPTS_BEFORE_BLOCK}. 
                  {MAX_ATTEMPTS_BEFORE_BLOCK - loginAttempts === 1 
                    ? ' Mais uma tentativa e sua conta será bloqueada.'
                    : ` Mais ${MAX_ATTEMPTS_BEFORE_BLOCK - loginAttempts} tentativas até o bloqueio.`}
                </Typography>
              </Alert>
            )}

            {error && !isBlocked && (
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
                disabled={isBlocked}
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
                disabled={isBlocked}
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
                        disabled={isBlocked}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              {/* Captcha */}
              {showCaptcha && !isBlocked && (
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Verificação de segurança
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        flex: 1,
                        bgcolor: 'grey.100',
                        p: 1.5,
                        borderRadius: 1,
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        letterSpacing: 4,
                        color: 'primary.main',
                        userSelect: 'none',
                        background: 'linear-gradient(45deg, #e3f2fd 25%, #bbdefb 25%, #bbdefb 50%, #e3f2fd 50%, #e3f2fd 75%, #bbdefb 75%)',
                        backgroundSize: '20px 20px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      {captchaCode}
                    </Box>
                    <IconButton onClick={refreshCaptcha} size="small">
                      <Refresh />
                    </IconButton>
                  </Box>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Digite o código acima"
                    value={captchaInput}
                    onChange={(e) => {
                      setCaptchaInput(e.target.value.toUpperCase());
                      setCaptchaError('');
                    }}
                    error={!!captchaError}
                    helperText={captchaError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Security fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& input': {
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                        letterSpacing: 2,
                      },
                    }}
                  />
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                  control={<Checkbox {...register('lembrar')} color="primary" size="small" disabled={isBlocked} />}
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
                disabled={isLoading || isBlocked}
                sx={{ py: 1.5, fontSize: '1rem' }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isBlocked ? (
                  `Bloqueado (${formatTime(remainingBlockTime)})`
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
              <Chip
                icon={<Security fontSize="small" />}
                label="Conexão segura"
                size="small"
                color="success"
                variant="outlined"
                sx={{ mt: 2 }}
              />
            </Box>
          </CardContent>
        </Card>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 3, color: 'grey.400' }}>
          © {new Date().getFullYear()} CNS Contábil. Todos os direitos reservados.
        </Typography>
      </Box>

      {/* 2FA Dialog */}
      <Dialog open={show2FADialog} onClose={() => setShow2FADialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PhoneAndroid color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Verificação em duas etapas
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Digite o código de 6 dígitos gerado pelo seu aplicativo autenticador.
          </Typography>

          {twoFAError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {twoFAError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Código de verificação"
            placeholder="000000"
            value={twoFACode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setTwoFACode(value);
              setTwoFAError('');
            }}
            inputProps={{
              maxLength: 6,
              style: { 
                textAlign: 'center', 
                fontSize: '1.5rem', 
                letterSpacing: 8,
                fontFamily: 'monospace',
              },
            }}
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" color="text.secondary">
            Não tem acesso ao autenticador?{' '}
            <Link href="#" sx={{ cursor: 'pointer' }}>
              Use um código de backup
            </Link>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setShow2FADialog(false)}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handle2FASubmit}
            disabled={twoFACode.length !== 6}
          >
            Verificar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoginPage;
