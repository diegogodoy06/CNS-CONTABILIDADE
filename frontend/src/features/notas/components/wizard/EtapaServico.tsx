import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  InputAdornment,
  Autocomplete,
  Divider,
  Chip,
  Alert,
  alpha,
  useTheme,
} from '@mui/material';
import {
  AttachMoney,
  Percent,
  LocationCity,
  Category,
} from '@mui/icons-material';
import type { DadosServico } from '../EmitirNotaWizard';

// Lista de CNAEs comuns para serviços
const cnaesComuns = [
  { codigo: '6201501', descricao: 'Desenvolvimento de programas de computador sob encomenda' },
  { codigo: '6202300', descricao: 'Desenvolvimento e licenciamento de programas de computador customizáveis' },
  { codigo: '6203100', descricao: 'Desenvolvimento e licenciamento de programas de computador não-customizáveis' },
  { codigo: '6204000', descricao: 'Consultoria em tecnologia da informação' },
  { codigo: '6209100', descricao: 'Suporte técnico, manutenção e outros serviços em TI' },
  { codigo: '6311900', descricao: 'Tratamento de dados, provedores e hospedagem' },
  { codigo: '7020400', descricao: 'Atividades de consultoria em gestão empresarial' },
  { codigo: '7319099', descricao: 'Outras atividades de publicidade não especificadas' },
  { codigo: '7410203', descricao: 'Design de interiores' },
  { codigo: '7490104', descricao: 'Atividades de intermediação e agenciamento de serviços' },
  { codigo: '8599603', descricao: 'Treinamento em informática' },
  { codigo: '9609205', descricao: 'Atividades de saúde e bem estar pessoal' },
];

// Códigos de tributação municipal (São Paulo)
const codigosTributacao = [
  { codigo: '01.01', descricao: 'Análise e desenvolvimento de sistemas' },
  { codigo: '01.02', descricao: 'Programação' },
  { codigo: '01.03', descricao: 'Processamento de dados e congêneres' },
  { codigo: '01.04', descricao: 'Elaboração de programas de computadores' },
  { codigo: '01.05', descricao: 'Licenciamento ou cessão de uso de programas' },
  { codigo: '01.06', descricao: 'Assessoria e consultoria em informática' },
  { codigo: '01.07', descricao: 'Suporte técnico em informática' },
  { codigo: '01.08', descricao: 'Planejamento, confecção, manutenção de páginas' },
  { codigo: '17.01', descricao: 'Assessoria ou consultoria de qualquer natureza' },
  { codigo: '17.02', descricao: 'Análise, exame, pesquisa, coleta de dados' },
  { codigo: '17.05', descricao: 'Auditoria' },
  { codigo: '17.19', descricao: 'Contabilidade, auditoria e escrituração' },
];

interface TributosCalculados {
  valorISS: number;
  valorIR: number;
  valorPIS: number;
  valorCOFINS: number;
  valorCSLL: number;
  valorINSS: number;
  totalRetencoes: number;
  valorLiquido: number;
}

interface EtapaServicoProps {
  dados: DadosServico;
  onChange: (dados: DadosServico) => void;
  tributos: TributosCalculados;
  errors: Record<string, string>;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const EtapaServico: React.FC<EtapaServicoProps> = ({
  dados,
  onChange,
  tributos,
  errors,
}) => {
  const theme = useTheme();

  const handleChange = (field: keyof DadosServico, value: unknown) => {
    onChange({ ...dados, [field]: value });
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numericValue = parseFloat(value) / 100;
    handleChange('valorServico', isNaN(numericValue) ? 0 : numericValue);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Dados do Serviço Prestado
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Informe os detalhes do serviço e os tributos serão calculados automaticamente
      </Typography>

      <Grid container spacing={3}>
        {/* Descrição do Serviço */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descrição do Serviço"
            multiline
            rows={3}
            value={dados.descricao}
            onChange={(e) => handleChange('descricao', e.target.value)}
            placeholder="Descreva detalhadamente o serviço prestado..."
            error={!!errors.descricao}
            helperText={errors.descricao || 'Seja específico na descrição para evitar problemas fiscais'}
          />
        </Grid>

        {/* Valor */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Valor do Serviço"
            value={dados.valorServico > 0 ? formatCurrency(dados.valorServico) : ''}
            onChange={handleValorChange}
            placeholder="R$ 0,00"
            error={!!errors.valorServico}
            helperText={errors.valorServico}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Alíquota ISS */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Alíquota ISS</InputLabel>
            <Select
              value={dados.aliquotaISS}
              label="Alíquota ISS"
              onChange={(e) => handleChange('aliquotaISS', e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <Percent color="action" />
                </InputAdornment>
              }
            >
              <MenuItem value={2}>2%</MenuItem>
              <MenuItem value={2.5}>2,5%</MenuItem>
              <MenuItem value={3}>3%</MenuItem>
              <MenuItem value={4}>4%</MenuItem>
              <MenuItem value={5}>5%</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* CNAE */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={cnaesComuns}
            getOptionLabel={(option) => `${option.codigo} - ${option.descricao}`}
            value={cnaesComuns.find((c) => c.codigo === dados.cnae) || null}
            onChange={(_, newValue) => handleChange('cnae', newValue?.codigo || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="CNAE do Serviço"
                error={!!errors.cnae}
                helperText={errors.cnae}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <Category color="action" />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {option.codigo}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.descricao}
                  </Typography>
                </Box>
              </li>
            )}
          />
        </Grid>

        {/* Código de Tributação */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={codigosTributacao}
            getOptionLabel={(option) => `${option.codigo} - ${option.descricao}`}
            value={codigosTributacao.find((c) => c.codigo === dados.codigoTributacao) || null}
            onChange={(_, newValue) => handleChange('codigoTributacao', newValue?.codigo || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Código de Tributação Municipal"
                InputProps={{
                  ...params.InputProps,
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {option.codigo}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.descricao}
                  </Typography>
                </Box>
              </li>
            )}
          />
        </Grid>

        {/* Local de Prestação */}
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Município de Prestação"
            value={dados.municipioPrestacao}
            onChange={(e) => handleChange('municipioPrestacao', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCity color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>UF</InputLabel>
            <Select
              value={dados.ufPrestacao}
              label="UF"
              onChange={(e) => handleChange('ufPrestacao', e.target.value)}
            >
              <MenuItem value="SP">SP</MenuItem>
              <MenuItem value="RJ">RJ</MenuItem>
              <MenuItem value="MG">MG</MenuItem>
              <MenuItem value="RS">RS</MenuItem>
              <MenuItem value="PR">PR</MenuItem>
              <MenuItem value="SC">SC</MenuItem>
              <MenuItem value="BA">BA</MenuItem>
              <MenuItem value="PE">PE</MenuItem>
              <MenuItem value="CE">CE</MenuItem>
              <MenuItem value="DF">DF</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Retenções */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }}>
            <Chip label="Retenções na Fonte" size="small" />
          </Divider>
        </Grid>

        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Marque os tributos que devem ser retidos pelo tomador. As retenções serão deduzidas do valor líquido a receber.
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dados.retencaoIR}
                    onChange={(e) => handleChange('retencaoIR', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">IR (1,5%)</Typography>
                    {dados.retencaoIR && dados.valorServico > 0 && (
                      <Typography variant="caption" color="error">
                        -{formatCurrency(tributos.valorIR)}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dados.retencaoPIS}
                    onChange={(e) => handleChange('retencaoPIS', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">PIS (0,65%)</Typography>
                    {dados.retencaoPIS && dados.valorServico > 0 && (
                      <Typography variant="caption" color="error">
                        -{formatCurrency(tributos.valorPIS)}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dados.retencaoCOFINS}
                    onChange={(e) => handleChange('retencaoCOFINS', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">COFINS (3%)</Typography>
                    {dados.retencaoCOFINS && dados.valorServico > 0 && (
                      <Typography variant="caption" color="error">
                        -{formatCurrency(tributos.valorCOFINS)}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dados.retencaoCSLL}
                    onChange={(e) => handleChange('retencaoCSLL', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">CSLL (1%)</Typography>
                    {dados.retencaoCSLL && dados.valorServico > 0 && (
                      <Typography variant="caption" color="error">
                        -{formatCurrency(tributos.valorCSLL)}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dados.retencaoINSS}
                    onChange={(e) => handleChange('retencaoINSS', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">INSS (11%)</Typography>
                    {dados.retencaoINSS && dados.valorServico > 0 && (
                      <Typography variant="caption" color="error">
                        -{formatCurrency(tributos.valorINSS)}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dados.retencaoISS}
                    onChange={(e) => handleChange('retencaoISS', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">ISS ({dados.aliquotaISS}%)</Typography>
                    {dados.retencaoISS && dados.valorServico > 0 && (
                      <Typography variant="caption" color="error">
                        -{formatCurrency(tributos.valorISS)}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Resumo de Valores */}
        {dados.valorServico > 0 && (
          <Grid item xs={12}>
            <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Resumo dos Valores
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Valor Bruto
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {formatCurrency(dados.valorServico)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      ISS ({dados.aliquotaISS}%)
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="info.main">
                      {formatCurrency(tributos.valorISS)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Total Retenções
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="error.main">
                      -{formatCurrency(tributos.totalRetencoes + (dados.retencaoISS ? tributos.valorISS : 0))}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Valor Líquido
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="success.main">
                      {formatCurrency(tributos.valorLiquido)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default EtapaServico;
