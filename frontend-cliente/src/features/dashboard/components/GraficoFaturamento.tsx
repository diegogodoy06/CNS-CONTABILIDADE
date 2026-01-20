import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import dashboardService from '../../../services/dashboardService';

interface DadosMensais {
  mes: string;
  faturamento: number;
  despesas: number;
  lucro: number;
}

interface GraficoFaturamentoProps {
  empresaId?: string;
}

const GraficoFaturamento: React.FC<GraficoFaturamentoProps> = ({ empresaId }) => {
  const theme = useTheme();
  const [periodo, setPeriodo] = useState<'6m' | '12m' | 'ytd'>('6m');
  const [dados, setDados] = useState<DadosMensais[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFaturamento = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await dashboardService.getFaturamentoMensal({
        empresaId,
        periodo,
      });
      
      // Transformar resposta da API para o formato do gráfico
      if (response && Array.isArray(response)) {
        setDados(response.map((item: any) => ({
          mes: item.mes || item.label || '',
          faturamento: item.faturamento || item.valor || 0,
          despesas: item.despesas || 0,
          lucro: item.lucro || (item.faturamento || 0) - (item.despesas || 0),
        })));
      } else {
        setDados([]);
      }
    } catch (err) {
      console.error('Erro ao carregar faturamento:', err);
      setDados([]);
    } finally {
      setIsLoading(false);
    }
  }, [empresaId, periodo]);

  useEffect(() => {
    fetchFaturamento();
  }, [fetchFaturamento]);

  const handlePeriodoChange = (
    _event: React.MouseEvent<HTMLElement>,
    newPeriodo: '6m' | '12m' | 'ytd' | null
  ) => {
    if (newPeriodo) {
      setPeriodo(newPeriodo);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1.5,
            boxShadow: 2,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: entry.color,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {entry.name}:
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {formatCurrency(entry.value)}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Evolução do Faturamento
        </Typography>
        <ToggleButtonGroup
          size="small"
          value={periodo}
          exclusive
          onChange={handlePeriodoChange}
          sx={{
            '& .MuiToggleButton-root': {
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
            },
          }}
        >
          <ToggleButton value="6m">6M</ToggleButton>
          <ToggleButton value="12m">12M</ToggleButton>
          <ToggleButton value="ytd">YTD</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
          <CircularProgress />
        </Box>
      ) : dados.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
          <Typography color="text.secondary">Sem dados de faturamento</Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={dados}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
          <defs>
            <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
              <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3} />
              <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis
            dataKey="mes"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            tickFormatter={(value) => formatCurrency(value)}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span style={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
                {value}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="faturamento"
            name="Faturamento"
            stroke={theme.palette.primary.main}
            fillOpacity={1}
            fill="url(#colorFaturamento)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="lucro"
            name="Lucro Líquido"
            stroke={theme.palette.success.main}
            fillOpacity={1}
            fill="url(#colorLucro)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
      )}
    </Box>
  );
};

export default GraficoFaturamento;
