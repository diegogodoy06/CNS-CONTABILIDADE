import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Download, FilterList } from '@mui/icons-material';
import CalendarioObrigacoes from '../../../components/shared/CalendarioObrigacoes';

const CalendarioPage: React.FC = () => {
  const resumoMes = {
    total: 7,
    pendentes: 5,
    pagos: 2,
    valorTotal: 4620.00,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Calendário de Obrigações
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Acompanhe todas as suas obrigações fiscais e tributárias
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<FilterList />}>
            Filtrar
          </Button>
          <Button variant="outlined" startIcon={<Download />}>
            Exportar
          </Button>
        </Box>
      </Box>

      {/* Resumo do mês */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {resumoMes.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de obrigações
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {resumoMes.pendentes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pendentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {resumoMes.pagos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pagos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700}>
                {formatCurrency(resumoMes.valorTotal)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Valor total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Calendário */}
      <CalendarioObrigacoes />
    </Box>
  );
};

export default CalendarioPage;
