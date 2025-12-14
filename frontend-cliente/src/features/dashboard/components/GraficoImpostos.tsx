import React from 'react';
import {
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ImpostoData {
  name: string;
  valor: number;
  color: string;
}

const GraficoImpostos: React.FC = () => {
  const theme = useTheme();

  const impostos: ImpostoData[] = [
    { name: 'ISS', valor: 2285, color: theme.palette.primary.main },
    { name: 'IRPJ', valor: 1856, color: theme.palette.secondary.main },
    { name: 'PIS/COFINS', valor: 1245, color: theme.palette.warning.main },
    { name: 'CSLL', valor: 680, color: theme.palette.info.main },
    { name: 'INSS', valor: 1520, color: theme.palette.success.main },
  ];

  const total = impostos.reduce((acc, imp) => acc + imp.valor, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: data.color,
              }}
            />
            <Typography variant="subtitle2" fontWeight={600}>
              {data.name}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {formatCurrency(data.valor)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {((data.valor / total) * 100).toFixed(1)}% do total
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Distribuição de Impostos (Dezembro)
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <ResponsiveContainer width={150} height={150}>
          <PieChart>
            <Pie
              data={impostos}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={2}
              dataKey="valor"
            >
              {impostos.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <Box sx={{ flex: 1 }}>
          {impostos.map((imposto, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 0.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: imposto.color,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {imposto.name}
                </Typography>
              </Box>
              <Typography variant="caption" fontWeight={500}>
                {formatCurrency(imposto.valor)}
              </Typography>
            </Box>
          ))}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 1,
              pt: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              Total
            </Typography>
            <Typography variant="body2" fontWeight={700} color="primary.main">
              {formatCurrency(total)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GraficoImpostos;
