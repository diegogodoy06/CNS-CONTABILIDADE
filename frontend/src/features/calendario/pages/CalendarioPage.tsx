import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Menu,
  MenuItem,
  Chip,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Divider,
  FormControlLabel,
  Switch,
  Paper,
} from '@mui/material';
import { Download, FilterList, Close } from '@mui/icons-material';
import CalendarioObrigacoes from '../../../components/shared/CalendarioObrigacoes';

const tiposGuia = [
  { id: 'imposto', label: 'Impostos', color: '#0066CC' },
  { id: 'declaracao', label: 'Declarações', color: '#7B1FA2' },
  { id: 'folha', label: 'Folha de Pagamento', color: '#2E7D32' },
  { id: 'outros', label: 'Outros', color: '#757575' },
];

const CalendarioPage: React.FC = () => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTipos, setSelectedTipos] = useState<string[]>(tiposGuia.map(t => t.id));
  const [mostrarPagos, setMostrarPagos] = useState(true);
  const [mostrarPendentes, setMostrarPendentes] = useState(true);

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

  const handleToggleTipo = (tipoId: string) => {
    setSelectedTipos(prev => 
      prev.includes(tipoId) 
        ? prev.filter(t => t !== tipoId)
        : [...prev, tipoId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTipos(tiposGuia.map(t => t.id));
  };

  const handleClearFilters = () => {
    setSelectedTipos(tiposGuia.map(t => t.id));
    setMostrarPagos(true);
    setMostrarPendentes(true);
  };

  const activeFiltersCount = tiposGuia.length - selectedTipos.length + (!mostrarPagos ? 1 : 0) + (!mostrarPendentes ? 1 : 0);

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
          <Button 
            variant="outlined" 
            startIcon={<FilterList />}
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            color={activeFiltersCount > 0 ? 'primary' : 'inherit'}
          >
            Filtrar
            {activeFiltersCount > 0 && (
              <Chip 
                label={activeFiltersCount} 
                size="small" 
                color="primary" 
                sx={{ ml: 1, height: 20, minWidth: 20 }} 
              />
            )}
          </Button>
          <Button variant="outlined" startIcon={<Download />}>
            Exportar
          </Button>
        </Box>
      </Box>

      {/* Filtros Ativos */}
      {activeFiltersCount > 0 && (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            mb: 3, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Filtros ativos:
          </Typography>
          {tiposGuia.filter(t => !selectedTipos.includes(t.id)).map(tipo => (
            <Chip
              key={tipo.id}
              label={`Sem ${tipo.label}`}
              size="small"
              onDelete={() => handleToggleTipo(tipo.id)}
              sx={{ bgcolor: tipo.color, color: 'white' }}
            />
          ))}
          {!mostrarPagos && (
            <Chip
              label="Sem pagos"
              size="small"
              color="success"
              onDelete={() => setMostrarPagos(true)}
            />
          )}
          {!mostrarPendentes && (
            <Chip
              label="Sem pendentes"
              size="small"
              color="warning"
              onDelete={() => setMostrarPendentes(true)}
            />
          )}
          <Button 
            size="small" 
            onClick={handleClearFilters}
            startIcon={<Close />}
          >
            Limpar filtros
          </Button>
        </Paper>
      )}

      {/* Menu de Filtros */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{ sx: { minWidth: 280, p: 1 } }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Tipo de Obrigação
        </Typography>
        {tiposGuia.map(tipo => (
          <MenuItem key={tipo.id} onClick={() => handleToggleTipo(tipo.id)} dense>
            <ListItemIcon>
              <Checkbox
                checked={selectedTipos.includes(tipo.id)}
                size="small"
                sx={{ p: 0 }}
              />
            </ListItemIcon>
            <ListItemText>{tipo.label}</ListItemText>
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                bgcolor: tipo.color,
                ml: 1
              }} 
            />
          </MenuItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Status
        </Typography>
        <MenuItem dense>
          <FormControlLabel
            control={
              <Switch
                checked={mostrarPendentes}
                onChange={(e) => setMostrarPendentes(e.target.checked)}
                size="small"
              />
            }
            label="Mostrar pendentes"
            sx={{ ml: 0 }}
          />
        </MenuItem>
        <MenuItem dense>
          <FormControlLabel
            control={
              <Switch
                checked={mostrarPagos}
                onChange={(e) => setMostrarPagos(e.target.checked)}
                size="small"
              />
            }
            label="Mostrar pagos"
            sx={{ ml: 0 }}
          />
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ px: 2, py: 1, display: 'flex', gap: 1 }}>
          <Button size="small" onClick={handleSelectAll}>
            Selecionar todos
          </Button>
          <Button size="small" onClick={handleClearFilters}>
            Limpar
          </Button>
        </Box>
      </Menu>

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
