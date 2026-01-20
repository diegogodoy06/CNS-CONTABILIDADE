import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  alpha,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  CalendarMonth,
  Circle,
} from '@mui/icons-material';
import guiasService from '../../services/guiasService';
import type { Guia } from '../../types';

interface Obrigacao {
  id: string;
  dia: number;
  titulo: string;
  tipo: 'imposto' | 'declaracao' | 'folha' | 'outros';
  valor?: number;
  status: 'pendente' | 'pago' | 'atrasado';
}

interface CalendarioObrigacoesProps {
  empresaId?: string;
}

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Mapear tipo de guia para tipo de obrigação
const mapTipoGuiaToObrigacao = (tipo: string): 'imposto' | 'declaracao' | 'folha' | 'outros' => {
  const impostos = ['DAS', 'ISS', 'IRPJ', 'CSLL', 'PIS/COFINS'];
  const folha = ['INSS', 'FGTS'];
  if (impostos.includes(tipo)) return 'imposto';
  if (folha.includes(tipo)) return 'folha';
  if (tipo === 'obrigacao_acessoria') return 'declaracao';
  return 'outros';
};

// Converter guia para obrigação
const guiaToObrigacao = (guia: Guia): Obrigacao => ({
  id: guia.id,
  dia: new Date(guia.dataVencimento).getDate(),
  titulo: guia.tipo,
  tipo: mapTipoGuiaToObrigacao(guia.tipo),
  valor: guia.valor,
  status: guia.status === 'paga' ? 'pago' : guia.status === 'vencida' ? 'atrasado' : 'pendente',
});

const tipoColors: Record<string, string> = {
  imposto: '#0066CC',
  declaracao: '#7B1FA2',
  folha: '#2E7D32',
  outros: '#757575',
};

const CalendarioObrigacoes: React.FC<CalendarioObrigacoesProps> = ({
  empresaId,
}) => {
  const theme = useTheme();
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);
  const [obrigacoes, setObrigacoes] = useState<Obrigacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar guias da API
  const fetchGuias = useCallback(async () => {
    setIsLoading(true);
    try {
      const primeiroDia = new Date(anoAtual, mesAtual, 1);
      const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);
      
      const response = await guiasService.findAll({
        empresaId,
        dataVencimentoInicio: primeiroDia.toISOString().split('T')[0],
        dataVencimentoFim: ultimoDia.toISOString().split('T')[0],
        limit: 100,
      });
      
      const guias = response.items || [];
      setObrigacoes(guias.map(guiaToObrigacao));
    } catch (err) {
      console.error('Erro ao carregar guias:', err);
      setObrigacoes([]);
    } finally {
      setIsLoading(false);
    }
  }, [empresaId, mesAtual, anoAtual]);

  useEffect(() => {
    fetchGuias();
  }, [fetchGuias]);

  const primeiroDiaMes = new Date(anoAtual, mesAtual, 1);
  const ultimoDiaMes = new Date(anoAtual, mesAtual + 1, 0);
  const diasNoMes = ultimoDiaMes.getDate();
  const primeiroDiaSemana = primeiroDiaMes.getDay();

  const mesAnterior = () => {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual(anoAtual - 1);
    } else {
      setMesAtual(mesAtual - 1);
    }
    setDiaSelecionado(null);
  };

  const proximoMes = () => {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual(anoAtual + 1);
    } else {
      setMesAtual(mesAtual + 1);
    }
    setDiaSelecionado(null);
  };

  const getObrigacoesDia = (dia: number) => {
    return obrigacoes.filter((o) => o.dia === dia);
  };

  const isHoje = (dia: number) => {
    return (
      dia === hoje.getDate() &&
      mesAtual === hoje.getMonth() &&
      anoAtual === hoje.getFullYear()
    );
  };

  const renderCalendario = () => {
    const dias: React.ReactNode[] = [];
    
    // Dias vazios antes do primeiro dia do mês
    for (let i = 0; i < primeiroDiaSemana; i++) {
      dias.push(
        <Box
          key={`empty-${i}`}
          sx={{
            aspectRatio: '1',
            p: 0.5,
          }}
        />
      );
    }

    // Dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const obrigacoesDia = getObrigacoesDia(dia);
      const temObrigacaoDia = obrigacoesDia.length > 0;
      const ehHoje = isHoje(dia);
      const selecionado = diaSelecionado === dia;

      dias.push(
        <Box
          key={dia}
          onClick={() => setDiaSelecionado(dia)}
          sx={{
            aspectRatio: '1',
            p: 0.5,
            cursor: 'pointer',
          }}
        >
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              bgcolor: selecionado
                ? 'primary.main'
                : ehHoje
                ? alpha(theme.palette.primary.main, 0.1)
                : 'transparent',
              color: selecionado ? '#fff' : 'text.primary',
              border: ehHoje && !selecionado ? `2px solid ${theme.palette.primary.main}` : 'none',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: selecionado
                  ? 'primary.dark'
                  : alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <Typography
              variant="body2"
              fontWeight={ehHoje || selecionado ? 600 : 400}
            >
              {dia}
            </Typography>
            {temObrigacaoDia && (
              <Box sx={{ display: 'flex', gap: 0.3, mt: 0.3 }}>
                {obrigacoesDia.slice(0, 3).map((o, idx) => (
                  <Circle
                    key={idx}
                    sx={{
                      fontSize: 6,
                      color: selecionado ? '#fff' : tipoColors[o.tipo],
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      );
    }

    return dias;
  };

  const obrigacoesDodia = diaSelecionado ? getObrigacoesDia(diaSelecionado) : [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonth color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Calendário de Obrigações
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={mesAnterior} disabled={isLoading}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="subtitle1" fontWeight={500} sx={{ minWidth: 140, textAlign: 'center' }}>
              {meses[mesAtual]} {anoAtual}
            </Typography>
            <IconButton size="small" onClick={proximoMes} disabled={isLoading}>
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
        <Grid container spacing={2}>
          {/* Calendário */}
          <Grid item xs={12} md={7}>
            {/* Dias da semana */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                mb: 1,
              }}
            >
              {diasSemana.map((dia) => (
                <Typography
                  key={dia}
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 1 }}
                >
                  {dia}
                </Typography>
              ))}
            </Box>

            {/* Grid do calendário */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 0.5,
              }}
            >
              {renderCalendario()}
            </Box>

            {/* Legenda */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
              {Object.entries(tipoColors).map(([tipo, cor]) => (
                <Box key={tipo} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Circle sx={{ fontSize: 10, color: cor }} />
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                    {tipo}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Lista de obrigações */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                bgcolor: alpha(theme.palette.grey[500], 0.05),
                borderRadius: 2,
                p: 2,
                height: '100%',
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {diaSelecionado
                  ? `Obrigações do dia ${diaSelecionado}`
                  : 'Selecione um dia'}
              </Typography>

              {diaSelecionado && obrigacoesDodia.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  Nenhuma obrigação neste dia
                </Typography>
              )}

              {obrigacoesDodia.length > 0 && (
                <List dense sx={{ py: 0 }}>
                  {obrigacoesDodia.map((obrigacao) => (
                    <ListItem
                      key={obrigacao.id}
                      sx={{
                        px: 0,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <Box
                        sx={{
                          width: 4,
                          height: 36,
                          borderRadius: 1,
                          bgcolor: tipoColors[obrigacao.tipo],
                          mr: 1.5,
                        }}
                      />
                      <ListItemText
                        primary={obrigacao.titulo}
                        secondary={obrigacao.valor ? formatCurrency(obrigacao.valor) : 'Declaração'}
                        primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem' }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      />
                      <Chip
                        size="small"
                        label={obrigacao.status}
                        color={
                          obrigacao.status === 'pago'
                            ? 'success'
                            : obrigacao.status === 'atrasado'
                            ? 'error'
                            : 'warning'
                        }
                        sx={{ height: 22, fontSize: '0.7rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              {!diaSelecionado && (
                <Box sx={{ py: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Próximas obrigações
                  </Typography>
                  {obrigacoes.slice(0, 4).map((obrigacao) => (
                    <Box
                      key={obrigacao.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        py: 0.75,
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '6px',
                          bgcolor: alpha(tipoColors[obrigacao.tipo], 0.1),
                          color: tipoColors[obrigacao.tipo],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {obrigacao.dia}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {obrigacao.titulo}
                        </Typography>
                      </Box>
                      {obrigacao.valor && (
                        <Typography variant="caption" color="text.secondary">
                          {formatCurrency(obrigacao.valor)}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarioObrigacoes;
