import React, { useState, useMemo } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Close,
  ChevronLeft,
  ChevronRight,
  CalendarToday,
  Receipt,
  Warning,
  CheckCircle,
  Schedule,
  TrendingUp,
  ViewModule,
  ViewList,
} from '@mui/icons-material';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  getDay,
  parseISO,
  isBefore,
  isAfter,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Guia, GuiaStatus, TipoGuia } from '../../../types';

interface CalendarioGuiasDrawerProps {
  open: boolean;
  onClose: () => void;
  guias: Guia[];
  onGuiaClick?: (guia: Guia) => void;
}

// Configuração de cores por tipo de guia
const tipoColors: Record<TipoGuia, string> = {
  DAS: '#2563eb',
  ISS: '#059669',
  INSS: '#d97706',
  IRPJ: '#7c3aed',
  CSLL: '#db2777',
  'PIS/COFINS': '#0891b2',
  FGTS: '#ea580c',
  obrigacao_acessoria: '#6b7280',
};

const statusConfig: Record<GuiaStatus, { label: string; color: string }> = {
  pendente: { label: 'Pendente', color: '#f59e0b' },
  paga: { label: 'Paga', color: '#10b981' },
  vencida: { label: 'Vencida', color: '#ef4444' },
  parcelada: { label: 'Parcelada', color: '#3b82f6' },
  cancelada: { label: 'Cancelada', color: '#6b7280' },
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const CalendarioGuiasDrawer: React.FC<CalendarioGuiasDrawerProps> = ({
  open,
  onClose,
  guias,
  onGuiaClick,
}) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Calcular dias do mês atual com padding para início da semana
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    // Adicionar dias vazios no início para alinhar com dia da semana
    const startDayOfWeek = getDay(start);
    const paddingDays: (Date | null)[] = Array(startDayOfWeek).fill(null);
    
    return [...paddingDays, ...days];
  }, [currentMonth]);

  // Agrupar guias por data de vencimento
  const guiasPorData = useMemo(() => {
    const map: Record<string, Guia[]> = {};
    guias.forEach(guia => {
      const dateKey = guia.dataVencimento;
      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(guia);
    });
    return map;
  }, [guias]);

  // Guias do dia selecionado
  const guiasDoDia = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return guiasPorData[dateKey] || [];
  }, [selectedDate, guiasPorData]);

  // Estatísticas do mês
  const estatisticasMes = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    
    const guiasDoMes = guias.filter(g => {
      const vencimento = parseISO(g.dataVencimento);
      return !isBefore(vencimento, start) && !isAfter(vencimento, end);
    });

    const pendentes = guiasDoMes.filter(g => g.status === 'pendente');
    const pagas = guiasDoMes.filter(g => g.status === 'paga');
    const vencidas = guiasDoMes.filter(g => g.status === 'vencida');

    return {
      total: guiasDoMes.length,
      pendentes: pendentes.length,
      pagas: pagas.length,
      vencidas: vencidas.length,
      valorPendente: pendentes.reduce((acc, g) => acc + g.valor, 0),
      valorPago: pagas.reduce((acc, g) => acc + g.valor, 0),
    };
  }, [currentMonth, guias]);

  // Guias próximas a vencer (7 dias)
  const proximasAVencer = useMemo(() => {
    const hoje = new Date();
    const limite = addMonths(hoje, 0);
    limite.setDate(limite.getDate() + 7);

    return guias
      .filter(g => {
        if (g.status !== 'pendente') return false;
        const vencimento = parseISO(g.dataVencimento);
        return !isBefore(vencimento, hoje) && !isAfter(vencimento, limite);
      })
      .sort((a, b) => parseISO(a.dataVencimento).getTime() - parseISO(b.dataVencimento).getTime());
  }, [guias]);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  const getGuiasForDay = (date: Date): Guia[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return guiasPorData[dateKey] || [];
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 450 } },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Calendário de Guias
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>

          {/* Toggle View */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, v) => v && setViewMode(v)}
              size="small"
            >
              <ToggleButton value="calendar">
                <ViewModule fontSize="small" sx={{ mr: 0.5 }} />
                Calendário
              </ToggleButton>
              <ToggleButton value="list">
                <ViewList fontSize="small" sx={{ mr: 0.5 }} />
                Lista
              </ToggleButton>
            </ToggleButtonGroup>
            <Button size="small" onClick={handleToday}>
              Hoje
            </Button>
          </Box>
        </Box>

        {/* Estatísticas do Mês */}
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<Schedule />}
              label={`${estatisticasMes.pendentes} pendentes`}
              size="small"
              color="warning"
              variant="outlined"
            />
            <Chip
              icon={<Warning />}
              label={`${estatisticasMes.vencidas} vencidas`}
              size="small"
              color="error"
              variant="outlined"
            />
            <Chip
              icon={<CheckCircle />}
              label={`${estatisticasMes.pagas} pagas`}
              size="small"
              color="success"
              variant="outlined"
            />
          </Box>
          {estatisticasMes.valorPendente > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Total pendente: <strong>{formatCurrency(estatisticasMes.valorPendente)}</strong>
            </Typography>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {viewMode === 'calendar' ? (
            <Box sx={{ p: 2 }}>
              {/* Month Navigation */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={handlePrevMonth} size="small">
                  <ChevronLeft />
                </IconButton>
                <Typography variant="h6" fontWeight={600}>
                  {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </Typography>
                <IconButton onClick={handleNextMonth} size="small">
                  <ChevronRight />
                </IconButton>
              </Box>

              {/* Calendar Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
                {/* Days of Week Header */}
                {diasSemana.map(dia => (
                  <Box
                    key={dia}
                    sx={{
                      textAlign: 'center',
                      py: 1,
                      fontWeight: 600,
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                    }}
                  >
                    {dia}
                  </Box>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <Box key={`empty-${index}`} />;
                  }

                  const guiasDay = getGuiasForDay(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isCurrentDay = isToday(day);

                  return (
                    <Tooltip
                      key={day.toISOString()}
                      title={guiasDay.length > 0 ? `${guiasDay.length} guia(s)` : ''}
                      arrow
                    >
                      <Box
                        onClick={() => setSelectedDate(day)}
                        sx={{
                          position: 'relative',
                          aspectRatio: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          bgcolor: isSelected
                            ? 'primary.main'
                            : isCurrentDay
                            ? alpha(theme.palette.primary.main, 0.1)
                            : 'transparent',
                          color: isSelected ? 'white' : 'text.primary',
                          border: isCurrentDay && !isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
                          '&:hover': {
                            bgcolor: isSelected ? 'primary.dark' : 'grey.100',
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isCurrentDay || guiasDay.length > 0 ? 700 : 400,
                          }}
                        >
                          {format(day, 'd')}
                        </Typography>
                        
                        {/* Indicador de guias */}
                        {guiasDay.length > 0 && (
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 0.25,
                              mt: 0.25,
                            }}
                          >
                            {guiasDay.slice(0, 3).map((guia, i) => (
                              <Box
                                key={i}
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  bgcolor: isSelected
                                    ? 'white'
                                    : statusConfig[guia.status]?.color || 'grey.400',
                                }}
                              />
                            ))}
                            {guiasDay.length > 3 && (
                              <Typography variant="caption" sx={{ fontSize: '0.6rem', ml: 0.25 }}>
                                +{guiasDay.length - 3}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>

              {/* Selected Day Details */}
              {selectedDate && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                    {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </Typography>

                  {guiasDoDia.length > 0 ? (
                    <List dense disablePadding>
                      {guiasDoDia.map(guia => (
                        <ListItem
                          key={guia.id}
                          onClick={() => onGuiaClick?.(guia)}
                          sx={{
                            borderRadius: 1,
                            mb: 1,
                            border: `1px solid ${theme.palette.divider}`,
                            cursor: onGuiaClick ? 'pointer' : 'default',
                            '&:hover': onGuiaClick ? { bgcolor: 'grey.50' } : {},
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Box
                              sx={{
                                width: 4,
                                height: 32,
                                borderRadius: 1,
                                bgcolor: tipoColors[guia.tipo] || 'grey.400',
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" fontWeight={600}>
                                  {guia.tipo}
                                </Typography>
                                <Chip
                                  label={statusConfig[guia.status]?.label}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    bgcolor: alpha(statusConfig[guia.status]?.color || '#6b7280', 0.1),
                                    color: statusConfig[guia.status]?.color,
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Typography variant="body2" fontWeight={700} color="primary">
                                {formatCurrency(guia.valor)}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
                      <Receipt sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
                      <Typography variant="body2">
                        Nenhuma guia para este dia
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ) : (
            /* List View */
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Próximas a vencer
              </Typography>

              {proximasAVencer.length > 0 ? (
                <List dense disablePadding>
                  {proximasAVencer.map(guia => {
                    const vencimento = parseISO(guia.dataVencimento);
                    const diasRestantes = Math.ceil(
                      (vencimento.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <ListItem
                        key={guia.id}
                        onClick={() => onGuiaClick?.(guia)}
                        sx={{
                          borderRadius: 1,
                          mb: 1,
                          border: `1px solid ${theme.palette.divider}`,
                          bgcolor: diasRestantes <= 3 ? alpha(theme.palette.error.main, 0.05) : 'transparent',
                          cursor: onGuiaClick ? 'pointer' : 'default',
                          '&:hover': onGuiaClick ? { bgcolor: 'grey.50' } : {},
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Box
                            sx={{
                              width: 4,
                              height: 40,
                              borderRadius: 1,
                              bgcolor: tipoColors[guia.tipo] || 'grey.400',
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" fontWeight={600}>
                                {guia.tipo}
                              </Typography>
                              <Typography variant="body2" fontWeight={700} color="primary">
                                {formatCurrency(guia.valor)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                {format(vencimento, "dd/MM/yyyy", { locale: ptBR })}
                              </Typography>
                              <Chip
                                label={
                                  diasRestantes === 0
                                    ? 'Hoje!'
                                    : diasRestantes === 1
                                    ? 'Amanhã'
                                    : `${diasRestantes} dias`
                                }
                                size="small"
                                color={diasRestantes <= 3 ? 'error' : diasRestantes <= 7 ? 'warning' : 'default'}
                                sx={{ height: 20, fontSize: '0.65rem' }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <CheckCircle sx={{ fontSize: 48, color: 'success.main', opacity: 0.5, mb: 1 }} />
                  <Typography variant="body2">
                    Nenhuma guia pendente nos próximos 7 dias
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Resumo por tipo */}
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Resumo por Tributo
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Object.entries(tipoColors).map(([tipo, color]) => {
                  const guiasTipo = guias.filter(g => g.tipo === tipo && g.status === 'pendente');
                  if (guiasTipo.length === 0) return null;

                  const total = guiasTipo.reduce((acc, g) => acc + g.valor, 0);

                  return (
                    <Box
                      key={tipo}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: alpha(color, 0.1),
                        border: `1px solid ${alpha(color, 0.3)}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: color,
                          }}
                        />
                        <Typography variant="body2" fontWeight={600}>
                          {tipo}
                        </Typography>
                        <Chip
                          label={guiasTipo.length}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            bgcolor: color,
                            color: 'white',
                          }}
                        />
                      </Box>
                      <Typography variant="body2" fontWeight={700}>
                        {formatCurrency(total)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: 'grey.50',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TrendingUp fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight={600}>
              Total Pendente do Mês
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            {formatCurrency(estatisticasMes.valorPendente)}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CalendarioGuiasDrawer;
