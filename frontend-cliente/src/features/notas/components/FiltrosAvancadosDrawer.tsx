import { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Autocomplete,
  Slider,
  InputAdornment,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { NotaFiscalStatus } from '../../../types';

export interface FiltrosNotas {
  dataInicio: Date | null;
  dataFim: Date | null;
  competencia: string;
  status: NotaFiscalStatus[];
  tomadorId: string | null;
  valorMinimo: number | null;
  valorMaximo: number | null;
  numeroInicio: number | null;
  numeroFim: number | null;
  cnaeList: string[];
  comRetencao: boolean | null;
  municipioPrestacao: string;
}

interface FiltrosAvancadosDrawerProps {
  open: boolean;
  onClose: () => void;
  filtros: FiltrosNotas;
  onAplicar: (filtros: FiltrosNotas) => void;
  onLimpar: () => void;
}

const STATUS_OPTIONS: { value: NotaFiscalStatus; label: string; color: string }[] = [
  { value: 'emitida', label: 'Emitida', color: '#4caf50' },
  { value: 'rascunho', label: 'Rascunho', color: '#9e9e9e' },
  { value: 'cancelada', label: 'Cancelada', color: '#f44336' },
  { value: 'processando', label: 'Processando', color: '#ff9800' },
  { value: 'simulada', label: 'Simulada', color: '#2196f3' },
  { value: 'erro', label: 'Erro', color: '#f44336' },
];

const CNAE_OPTIONS = [
  { codigo: '6201-5/01', descricao: 'Desenvolvimento de software sob encomenda' },
  { codigo: '6202-3/00', descricao: 'Desenvolvimento de software customizável' },
  { codigo: '6203-1/00', descricao: 'Desenvolvimento de software não customizável' },
  { codigo: '6204-0/00', descricao: 'Consultoria em TI' },
  { codigo: '6209-1/00', descricao: 'Suporte técnico em TI' },
  { codigo: '6311-9/00', descricao: 'Tratamento de dados' },
  { codigo: '7020-4/00', descricao: 'Consultoria em gestão empresarial' },
  { codigo: '7319-0/99', descricao: 'Marketing e publicidade' },
];

const COMPETENCIAS = [
  '01/2025', '02/2025', '03/2025', '04/2025', '05/2025', '06/2025',
  '07/2025', '08/2025', '09/2025', '10/2025', '11/2025', '12/2025',
  '01/2024', '02/2024', '03/2024', '04/2024', '05/2024', '06/2024',
  '07/2024', '08/2024', '09/2024', '10/2024', '11/2024', '12/2024',
];

const MOCK_TOMADORES = [
  { id: '1', nome: 'Tech Solutions LTDA' },
  { id: '2', nome: 'Consultoria Alpha S.A' },
  { id: '3', nome: 'João Silva' },
  { id: '4', nome: 'Startup Digital ME' },
];

export const filtrosIniciais: FiltrosNotas = {
  dataInicio: null,
  dataFim: null,
  competencia: '',
  status: [],
  tomadorId: null,
  valorMinimo: null,
  valorMaximo: null,
  numeroInicio: null,
  numeroFim: null,
  cnaeList: [],
  comRetencao: null,
  municipioPrestacao: '',
};

export default function FiltrosAvancadosDrawer({
  open,
  onClose,
  filtros,
  onAplicar,
  onLimpar,
}: FiltrosAvancadosDrawerProps) {
  const [filtrosLocais, setFiltrosLocais] = useState<FiltrosNotas>(filtros);
  const [valorRange, setValorRange] = useState<number[]>([0, 50000]);

  const handleChange = <K extends keyof FiltrosNotas>(campo: K, valor: FiltrosNotas[K]) => {
    setFiltrosLocais(prev => ({ ...prev, [campo]: valor }));
  };

  const handleStatusToggle = (status: NotaFiscalStatus) => {
    setFiltrosLocais(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status],
    }));
  };

  const handleValorRangeChange = (_: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setValorRange([min, max]);
    setFiltrosLocais(prev => ({
      ...prev,
      valorMinimo: min > 0 ? min : null,
      valorMaximo: max < 50000 ? max : null,
    }));
  };

  const handleAplicar = () => {
    onAplicar(filtrosLocais);
    onClose();
  };

  const handleLimpar = () => {
    setFiltrosLocais(filtrosIniciais);
    setValorRange([0, 50000]);
    onLimpar();
  };

  const contarFiltrosAtivos = () => {
    let count = 0;
    if (filtrosLocais.dataInicio) count++;
    if (filtrosLocais.dataFim) count++;
    if (filtrosLocais.competencia) count++;
    if (filtrosLocais.status.length > 0) count++;
    if (filtrosLocais.tomadorId) count++;
    if (filtrosLocais.valorMinimo || filtrosLocais.valorMaximo) count++;
    if (filtrosLocais.numeroInicio || filtrosLocais.numeroFim) count++;
    if (filtrosLocais.cnaeList.length > 0) count++;
    if (filtrosLocais.comRetencao !== null) count++;
    if (filtrosLocais.municipioPrestacao) count++;
    return count;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 420 } }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon color="primary" />
            <Typography variant="h6">Filtros Avançados</Typography>
            {contarFiltrosAtivos() > 0 && (
              <Chip
                label={contarFiltrosAtivos()}
                size="small"
                color="primary"
              />
            )}
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <Stack spacing={3}>
            {/* Período */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Período de Emissão
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label="Data Início"
                  value={filtrosLocais.dataInicio}
                  onChange={(date) => handleChange('dataInicio', date)}
                  slotProps={{
                    textField: { size: 'small', fullWidth: true }
                  }}
                />
                <DatePicker
                  label="Data Fim"
                  value={filtrosLocais.dataFim}
                  onChange={(date) => handleChange('dataFim', date)}
                  slotProps={{
                    textField: { size: 'small', fullWidth: true }
                  }}
                />
              </Box>
            </Box>

            {/* Competência */}
            <FormControl size="small" fullWidth>
              <InputLabel>Competência</InputLabel>
              <Select
                value={filtrosLocais.competencia}
                label="Competência"
                onChange={(e) => handleChange('competencia', e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {COMPETENCIAS.map(comp => (
                  <MenuItem key={comp} value={comp}>{comp}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider />

            {/* Status */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Status
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {STATUS_OPTIONS.map(opt => (
                  <Chip
                    key={opt.value}
                    label={opt.label}
                    onClick={() => handleStatusToggle(opt.value)}
                    color={filtrosLocais.status.includes(opt.value) ? 'primary' : 'default'}
                    variant={filtrosLocais.status.includes(opt.value) ? 'filled' : 'outlined'}
                    sx={{
                      cursor: 'pointer',
                      borderColor: opt.color,
                      '&.MuiChip-filled': {
                        bgcolor: opt.color,
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Divider />

            {/* Tomador */}
            <Autocomplete
              size="small"
              options={MOCK_TOMADORES}
              getOptionLabel={(opt) => opt.nome}
              value={MOCK_TOMADORES.find(t => t.id === filtrosLocais.tomadorId) || null}
              onChange={(_, newValue) => handleChange('tomadorId', newValue?.id || null)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tomador"
                  placeholder="Buscar tomador..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" color="action" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            <Divider />

            {/* Valor */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Faixa de Valor
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={valorRange}
                  onChange={handleValorRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={50000}
                  step={500}
                  valueLabelFormat={(v) => `R$ ${v.toLocaleString('pt-BR')}`}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    R$ {valorRange[0].toLocaleString('pt-BR')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    R$ {valorRange[1].toLocaleString('pt-BR')}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Número da Nota */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Número da Nota
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  size="small"
                  label="De"
                  type="number"
                  value={filtrosLocais.numeroInicio || ''}
                  onChange={(e) => handleChange('numeroInicio', e.target.value ? Number(e.target.value) : null)}
                  fullWidth
                />
                <TextField
                  size="small"
                  label="Até"
                  type="number"
                  value={filtrosLocais.numeroFim || ''}
                  onChange={(e) => handleChange('numeroFim', e.target.value ? Number(e.target.value) : null)}
                  fullWidth
                />
              </Box>
            </Box>

            <Divider />

            {/* CNAE */}
            <Autocomplete
              multiple
              size="small"
              options={CNAE_OPTIONS}
              getOptionLabel={(opt) => `${opt.codigo} - ${opt.descricao}`}
              value={CNAE_OPTIONS.filter(c => filtrosLocais.cnaeList.includes(c.codigo))}
              onChange={(_, newValue) => handleChange('cnaeList', newValue.map(v => v.codigo))}
              renderInput={(params) => (
                <TextField {...params} label="CNAE do Serviço" placeholder="Selecione..." />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.codigo}
                    label={option.codigo}
                    size="small"
                  />
                ))
              }
            />

            {/* Município */}
            <TextField
              size="small"
              label="Município de Prestação"
              value={filtrosLocais.municipioPrestacao}
              onChange={(e) => handleChange('municipioPrestacao', e.target.value)}
              placeholder="Ex: São Paulo"
            />

            {/* Retenção */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Retenção de ISS
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label="Com Retenção"
                  onClick={() => handleChange('comRetencao', filtrosLocais.comRetencao === true ? null : true)}
                  color={filtrosLocais.comRetencao === true ? 'primary' : 'default'}
                  variant={filtrosLocais.comRetencao === true ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Sem Retenção"
                  onClick={() => handleChange('comRetencao', filtrosLocais.comRetencao === false ? null : false)}
                  color={filtrosLocais.comRetencao === false ? 'primary' : 'default'}
                  variant={filtrosLocais.comRetencao === false ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer' }}
                />
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleLimpar}
            fullWidth
          >
            Limpar
          </Button>
          <Button
            variant="contained"
            startIcon={<FilterIcon />}
            onClick={handleAplicar}
            fullWidth
          >
            Aplicar Filtros
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
