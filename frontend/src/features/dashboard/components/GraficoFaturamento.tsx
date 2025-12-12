import React from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
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

interface DadosMensais {
  mes: string;
  faturamento: number;
  despesas: number;
  lucro: number;
}

const dadosMensais: DadosMensais[] = [
  { mes: 'Jul', faturamento: 32000, despesas: 18000, lucro: 14000 },
  { mes: 'Ago', faturamento: 38000, despesas: 19500, lucro: 18500 },
  { mes: 'Set', faturamento: 35000, despesas: 17800, lucro: 17200 },
  { mes: 'Out', faturamento: 42000, despesas: 21000, lucro: 21000 },
  { mes: 'Nov', faturamento: 48000, despesas: 22500, lucro: 25500 },
  { mes: 'Dez', faturamento: 45678, despesas: 20800, lucro: 24878 },
];

interface GraficoFaturamentoProps {
  periodo?: '6m' | '12m' | 'ytd';
}

const GraficoFaturamento: React.FC<GraficoFaturamentoProps> = () => {
  const theme = useTheme();
  const [periodo, setPeriodo] = React.useState<'6m' | '12m' | 'ytd'>('6m');

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

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={dadosMensais}
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
    </Box>
  );
};

export default GraficoFaturamento;
