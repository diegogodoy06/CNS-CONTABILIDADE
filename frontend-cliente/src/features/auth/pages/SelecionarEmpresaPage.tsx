import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Avatar,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Skeleton,
  alpha,
  Divider,
  Button,
} from '@mui/material';
import {
  Business,
  Search,
  CheckCircle,
  Star,
  ArrowBack,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { RootState } from '../../../store';
import { setCompany, logout } from '../../../store/slices/authSlice';
import authService from '../../../services/authService';
import type { Company } from '../../../types';

const SelecionarEmpresaPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, company: currentCompany } = useAppSelector((state: RootState) => state.auth);
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      if (!user?.email) return;
      
      try {
        setLoading(true);
        const userCompanies = await authService.getUserCompanies(user.email);
        setCompanies(userCompanies);
        
        // Se só tem uma empresa, redireciona direto
        if (userCompanies.length === 1) {
          dispatch(setCompany(userCompanies[0]));
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [user?.email, dispatch, navigate]);

  const filteredCompanies = companies.filter(
    (company) =>
      company.nomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.cnpj.includes(searchTerm)
  );

  const handleSelectCompany = (company: Company) => {
    setSelectedId(company.id);
    
    // Pequeno delay para feedback visual
    setTimeout(() => {
      dispatch(setCompany(company));
      navigate('/dashboard');
    }, 300);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getRegimeLabel = (regime: string) => {
    const labels: Record<string, { label: string; color: 'primary' | 'secondary' | 'warning' }> = {
      simples: { label: 'Simples Nacional', color: 'primary' },
      presumido: { label: 'Lucro Presumido', color: 'secondary' },
      real: { label: 'Lucro Real', color: 'warning' },
    };
    return labels[regime] || { label: regime, color: 'primary' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'success';
      case 'inativo':
        return 'default';
      case 'bloqueado':
        return 'error';
      default:
        return 'default';
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
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        p: 3,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        {/* Header */}
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
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            Selecione a Empresa
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Olá, <strong>{user?.name}</strong>! Escolha a empresa que deseja acessar.
          </Typography>
        </Box>

        {/* Card Principal */}
        <Card elevation={8} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <CardContent sx={{ p: 4 }}>
            {/* Busca */}
            <TextField
              fullWidth
              placeholder="Buscar por nome, razão social ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            {/* Lista de Empresas */}
            {loading ? (
              <Grid container spacing={2}>
                {[1, 2, 3].map((i) => (
                  <Grid item xs={12} key={i}>
                    <Skeleton variant="rounded" height={100} />
                  </Grid>
                ))}
              </Grid>
            ) : filteredCompanies.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Business sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Nenhuma empresa encontrada
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tente ajustar os termos da busca
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredCompanies.map((company) => {
                  const isSelected = selectedId === company.id;
                  const isCurrent = currentCompany?.id === company.id;
                  const regime = getRegimeLabel(company.regimeTributario);

                  return (
                    <Grid item xs={12} key={company.id}>
                      <Card
                        elevation={isSelected ? 8 : 1}
                        sx={{
                          position: 'relative',
                          border: '2px solid',
                          borderColor: isSelected
                            ? 'primary.main'
                            : isCurrent
                            ? 'success.light'
                            : 'transparent',
                          transition: 'all 0.2s ease-in-out',
                          transform: isSelected ? 'scale(1.02)' : 'none',
                          '&:hover': {
                            borderColor: 'primary.light',
                            boxShadow: 4,
                          },
                        }}
                      >
                        <CardActionArea
                          onClick={() => handleSelectCompany(company)}
                          disabled={company.status !== 'ativo'}
                          sx={{ p: 0 }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              p: 2.5,
                              gap: 2,
                            }}
                          >
                            {/* Avatar */}
                            <Avatar
                              sx={{
                                width: 56,
                                height: 56,
                                bgcolor: isSelected
                                  ? 'primary.main'
                                  : alpha('#1976d2', 0.1),
                                color: isSelected ? 'white' : 'primary.main',
                                fontSize: '1.25rem',
                                fontWeight: 600,
                              }}
                            >
                              {company.nomeFantasia?.substring(0, 2).toUpperCase() ||
                                company.razaoSocial.substring(0, 2).toUpperCase()}
                            </Avatar>

                            {/* Informações */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: 600,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {company.nomeFantasia || company.razaoSocial}
                                </Typography>
                                {isCurrent && (
                                  <Chip
                                    icon={<Star sx={{ fontSize: 14 }} />}
                                    label="Atual"
                                    size="small"
                                    color="success"
                                    sx={{ height: 22 }}
                                  />
                                )}
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {company.razaoSocial}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  CNPJ: {company.cnpj}
                                </Typography>
                                <Chip
                                  label={regime.label}
                                  size="small"
                                  color={regime.color}
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                                <Chip
                                  label={company.status}
                                  size="small"
                                  color={getStatusColor(company.status) as any}
                                  sx={{ height: 20, fontSize: '0.65rem', textTransform: 'capitalize' }}
                                />
                              </Box>
                            </Box>

                            {/* Indicador de Seleção */}
                            {isSelected && (
                              <CheckCircle
                                sx={{
                                  color: 'primary.main',
                                  fontSize: 28,
                                }}
                              />
                            )}
                          </Box>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Rodapé */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={handleLogout}
                color="inherit"
              >
                Sair da conta
              </Button>
              <Typography variant="caption" color="text.secondary">
                {companies.length} empresa{companies.length !== 1 ? 's' : ''} disponíve{companies.length !== 1 ? 'is' : 'l'}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Copyright */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            color: 'grey.500',
            mt: 3,
          }}
        >
          © {new Date().getFullYear()} CNS Contábil. Todos os direitos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default SelecionarEmpresaPage;
