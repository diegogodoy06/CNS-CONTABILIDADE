import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Collapse,
  IconButton,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
  CalendarMonth,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ptBR } from 'date-fns/locale/pt-BR';
import type { DocumentCategory, DocumentFilters as FiltersType } from '../../../types';

interface DocumentFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  onClearFilters: () => void;
  resultCount?: number;
}

interface CategoryOption {
  id: DocumentCategory;
  label: string;
  color: string;
}

const categories: CategoryOption[] = [
  { id: 'fiscal', label: 'Fiscal', color: '#3b82f6' },
  { id: 'contabil', label: 'Contábil', color: '#10b981' },
  { id: 'trabalhista', label: 'Trabalhista', color: '#8b5cf6' },
  { id: 'juridico', label: 'Jurídico', color: '#f59e0b' },
  { id: 'operacional', label: 'Operacional', color: '#6366f1' },
  { id: 'certificados', label: 'Certificados', color: '#ec4899' },
  { id: 'modelos', label: 'Modelos', color: '#64748b' },
];

const fileTypes = [
  { value: 'pdf', label: 'PDF' },
  { value: 'xlsx,xls', label: 'Excel (XLS/XLSX)' },
  { value: 'doc,docx', label: 'Word (DOC/DOCX)' },
  { value: 'jpg,jpeg,png', label: 'Imagens (JPG/PNG)' },
];

const competenciaSuggestions = [
  '12/2024',
  '11/2024',
  '10/2024',
  '09/2024',
  '2024',
  '2023',
];

const tagSuggestions = [
  'Importante',
  'Urgente',
  'Arquivado',
  'Pendente revisão',
  'Anual',
  'Mensal',
];

const DocumentFiltersComponent: React.FC<DocumentFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, busca: value || undefined });
  };

  const handleCategoryChange = (category: DocumentCategory | '') => {
    onFiltersChange({ ...filters, categoria: category || undefined });
  };

  const handleDateChange = (field: 'dataInicio' | 'dataFim', date: Date | null) => {
    onFiltersChange({
      ...filters,
      [field]: date ? date.toISOString().split('T')[0] : undefined,
    });
  };

  const handleCompetenciaChange = (value: string | null) => {
    onFiltersChange({ ...filters, competencia: value || undefined });
  };

  const handleTagsChange = (tags: string[]) => {
    onFiltersChange({ ...filters, tags: tags.length > 0 ? tags : undefined });
  };

  const activeFiltersCount = [
    filters.categoria,
    filters.dataInicio,
    filters.dataFim,
    filters.competencia,
    filters.tags?.length,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0 || filters.busca;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Paper sx={{ p: 2, mb: 3 }}>
        {/* Main Search Bar */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Buscar por nome do arquivo, competência..."
            value={filters.busca || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: filters.busca && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => handleSearchChange('')}>
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={filters.categoria || ''}
              onChange={(e) => handleCategoryChange(e.target.value as DocumentCategory | '')}
              label="Categoria"
            >
              <MenuItem value="">Todas</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: cat.color,
                      }}
                    />
                    {cat.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant={expanded ? 'contained' : 'outlined'}
            startIcon={<FilterList />}
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setExpanded(!expanded)}
            sx={{ minWidth: 140 }}
          >
            Filtros
            {activeFiltersCount > 0 && (
              <Chip
                label={activeFiltersCount}
                size="small"
                color="primary"
                sx={{ ml: 1, height: 20, minWidth: 20 }}
              />
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="text"
              color="error"
              startIcon={<Clear />}
              onClick={onClearFilters}
              size="small"
            >
              Limpar
            </Button>
          )}

          {resultCount !== undefined && (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
              {resultCount} {resultCount === 1 ? 'documento encontrado' : 'documentos encontrados'}
            </Typography>
          )}
        </Box>

        {/* Advanced Filters */}
        <Collapse in={expanded}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 2,
              mt: 3,
              pt: 3,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            {/* Date Range - Start */}
            <DatePicker
              label="Data inicial"
              value={filters.dataInicio ? new Date(filters.dataInicio) : null}
              onChange={(date) => handleDateChange('dataInicio', date)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonth fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />

            {/* Date Range - End */}
            <DatePicker
              label="Data final"
              value={filters.dataFim ? new Date(filters.dataFim) : null}
              onChange={(date) => handleDateChange('dataFim', date)}
              minDate={filters.dataInicio ? new Date(filters.dataInicio) : undefined}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonth fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />

            {/* Competência */}
            <Autocomplete
              freeSolo
              options={competenciaSuggestions}
              value={filters.competencia || ''}
              onChange={(_, value) => handleCompetenciaChange(value)}
              onInputChange={(_, value) => handleCompetenciaChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Competência"
                  size="small"
                  placeholder="Ex: 11/2024"
                />
              )}
            />

            {/* File Type */}
            <FormControl size="small" fullWidth>
              <InputLabel>Tipo de arquivo</InputLabel>
              <Select
                value=""
                label="Tipo de arquivo"
              >
                <MenuItem value="">Todos</MenuItem>
                {fileTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Tags */}
            <Box sx={{ gridColumn: { md: 'span 4' } }}>
              <Autocomplete
                multiple
                freeSolo
                options={tagSuggestions}
                value={filters.tags || []}
                onChange={(_, value) => handleTagsChange(value)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    size="small"
                    placeholder="Adicionar tags..."
                  />
                )}
              />
            </Box>
          </Box>
        </Collapse>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {filters.busca && (
              <Chip
                label={`Busca: "${filters.busca}"`}
                size="small"
                onDelete={() => handleSearchChange('')}
              />
            )}
            {filters.categoria && (
              <Chip
                label={`Categoria: ${categories.find(c => c.id === filters.categoria)?.label}`}
                size="small"
                onDelete={() => handleCategoryChange('')}
                sx={{
                  bgcolor: `${categories.find(c => c.id === filters.categoria)?.color}15`,
                  color: categories.find(c => c.id === filters.categoria)?.color,
                }}
              />
            )}
            {filters.dataInicio && (
              <Chip
                label={`De: ${new Date(filters.dataInicio).toLocaleDateString('pt-BR')}`}
                size="small"
                onDelete={() => handleDateChange('dataInicio', null)}
              />
            )}
            {filters.dataFim && (
              <Chip
                label={`Até: ${new Date(filters.dataFim).toLocaleDateString('pt-BR')}`}
                size="small"
                onDelete={() => handleDateChange('dataFim', null)}
              />
            )}
            {filters.competencia && (
              <Chip
                label={`Competência: ${filters.competencia}`}
                size="small"
                onDelete={() => handleCompetenciaChange(null)}
              />
            )}
            {filters.tags?.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                onDelete={() => handleTagsChange(filters.tags?.filter(t => t !== tag) || [])}
              />
            ))}
          </Box>
        )}
      </Paper>
    </LocalizationProvider>
  );
};

export default DocumentFiltersComponent;
