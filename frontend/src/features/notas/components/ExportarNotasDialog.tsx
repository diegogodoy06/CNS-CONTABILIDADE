import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  FormGroup,
  Divider,
  LinearProgress,
  Alert,
  Chip,
  Paper,
  alpha,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Description as ExcelIcon,
  PictureAsPdf as PdfIcon,
  FolderZip as ZipIcon,
  TableChart as CsvIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

interface ExportarNotasDialogProps {
  open: boolean;
  onClose: () => void;
  totalNotas: number;
  notasSelecionadas: number;
}

type FormatoExportacao = 'excel' | 'csv' | 'pdf' | 'xml-zip';

interface CamposExportacao {
  numero: boolean;
  data: boolean;
  tomador: boolean;
  cnpjTomador: boolean;
  servico: boolean;
  cnae: boolean;
  valor: boolean;
  tributos: boolean;
  status: boolean;
  codigoVerificacao: boolean;
}

const FORMATOS = [
  { 
    value: 'excel' as FormatoExportacao, 
    label: 'Excel (.xlsx)', 
    icon: <ExcelIcon />,
    color: '#217346',
    descricao: 'Planilha completa com formatação'
  },
  { 
    value: 'csv' as FormatoExportacao, 
    label: 'CSV (.csv)', 
    icon: <CsvIcon />,
    color: '#607d8b',
    descricao: 'Arquivo de texto separado por vírgulas'
  },
  { 
    value: 'pdf' as FormatoExportacao, 
    label: 'PDF (.pdf)', 
    icon: <PdfIcon />,
    color: '#d32f2f',
    descricao: 'Relatório formatado para impressão'
  },
  { 
    value: 'xml-zip' as FormatoExportacao, 
    label: 'XMLs em ZIP', 
    icon: <ZipIcon />,
    color: '#ff9800',
    descricao: 'Arquivos XML originais das NFS-e'
  },
];

export default function ExportarNotasDialog({
  open,
  onClose,
  totalNotas,
  notasSelecionadas,
}: ExportarNotasDialogProps) {
  const [formato, setFormato] = useState<FormatoExportacao>('excel');
  const [escopo, setEscopo] = useState<'selecionadas' | 'filtradas' | 'todas'>('filtradas');
  const [campos, setCampos] = useState<CamposExportacao>({
    numero: true,
    data: true,
    tomador: true,
    cnpjTomador: true,
    servico: true,
    cnae: true,
    valor: true,
    tributos: true,
    status: true,
    codigoVerificacao: true,
  });
  const [exportando, setExportando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [concluido, setConcluido] = useState(false);

  const handleCampoChange = (campo: keyof CamposExportacao) => {
    setCampos(prev => ({ ...prev, [campo]: !prev[campo] }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(campos).every(v => v);
    const newValue = !allSelected;
    setCampos({
      numero: newValue,
      data: newValue,
      tomador: newValue,
      cnpjTomador: newValue,
      servico: newValue,
      cnae: newValue,
      valor: newValue,
      tributos: newValue,
      status: newValue,
      codigoVerificacao: newValue,
    });
  };

  const handleExportar = async () => {
    setExportando(true);
    setProgresso(0);
    
    // Simula progresso
    const interval = setInterval(() => {
      setProgresso(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simula tempo de exportação
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    clearInterval(interval);
    setProgresso(100);
    setConcluido(true);
    
    // Simula download
    setTimeout(() => {
      const extensao = formato === 'excel' ? 'xlsx' : formato === 'xml-zip' ? 'zip' : formato;
      const nomeArquivo = `notas_fiscais_${new Date().toISOString().split('T')[0]}.${extensao}`;
      console.log('Baixando:', nomeArquivo);
    }, 500);
  };

  const handleClose = () => {
    setExportando(false);
    setProgresso(0);
    setConcluido(false);
    onClose();
  };

  const getQuantidadeNotas = () => {
    switch (escopo) {
      case 'selecionadas': return notasSelecionadas;
      case 'filtradas': return totalNotas;
      case 'todas': return totalNotas; // Em produção seria o total do banco
      default: return 0;
    }
  };

  const formatoSelecionado = FORMATOS.find(f => f.value === formato);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DownloadIcon color="primary" />
          <Typography variant="h6">Exportar Notas Fiscais</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {concluido ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Exportação Concluída!
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {getQuantidadeNotas()} notas exportadas com sucesso.
            </Typography>
            <Chip 
              icon={formatoSelecionado?.icon}
              label={`notas_fiscais_${new Date().toISOString().split('T')[0]}.${formato === 'excel' ? 'xlsx' : formato === 'xml-zip' ? 'zip' : formato}`}
              sx={{ bgcolor: alpha(formatoSelecionado?.color || '#000', 0.1) }}
            />
          </Box>
        ) : exportando ? (
          <Box sx={{ py: 4 }}>
            <Typography variant="body1" align="center" gutterBottom>
              Exportando {getQuantidadeNotas()} notas fiscais...
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progresso} 
              sx={{ mt: 2, height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>
              {progresso}%
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Formato */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Formato de Exportação
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {FORMATOS.map(fmt => (
                  <Paper
                    key={fmt.value}
                    variant="outlined"
                    onClick={() => setFormato(fmt.value)}
                    sx={{
                      p: 1.5,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      borderColor: formato === fmt.value ? 'primary.main' : 'divider',
                      borderWidth: formato === fmt.value ? 2 : 1,
                      bgcolor: formato === fmt.value ? alpha(fmt.color, 0.05) : 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: fmt.color,
                        bgcolor: alpha(fmt.color, 0.05),
                      },
                    }}
                  >
                    <Box sx={{ color: fmt.color }}>{fmt.icon}</Box>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {fmt.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {fmt.descricao}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>

            <Divider />

            {/* Escopo */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Quais notas exportar?
              </Typography>
              <FormControl>
                <RadioGroup
                  value={escopo}
                  onChange={(e) => setEscopo(e.target.value as typeof escopo)}
                >
                  {notasSelecionadas > 0 && (
                    <FormControlLabel
                      value="selecionadas"
                      control={<Radio size="small" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>Apenas selecionadas</span>
                          <Chip label={notasSelecionadas} size="small" color="primary" />
                        </Box>
                      }
                    />
                  )}
                  <FormControlLabel
                    value="filtradas"
                    control={<Radio size="small" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>Resultado da busca/filtro</span>
                        <Chip label={totalNotas} size="small" />
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="todas"
                    control={<Radio size="small" />}
                    label="Todas as notas"
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            {formato !== 'xml-zip' && (
              <>
                <Divider />

                {/* Campos */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Campos a Incluir
                    </Typography>
                    <Button size="small" onClick={handleSelectAll}>
                      {Object.values(campos).every(v => v) ? 'Desmarcar Todos' : 'Selecionar Todos'}
                    </Button>
                  </Box>
                  <FormGroup sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    <FormControlLabel
                      control={<Checkbox size="small" checked={campos.numero} onChange={() => handleCampoChange('numero')} />}
                      label="Número/Série"
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" checked={campos.data} onChange={() => handleCampoChange('data')} />}
                      label="Data Emissão"
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" checked={campos.tomador} onChange={() => handleCampoChange('tomador')} />}
                      label="Tomador"
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" checked={campos.cnpjTomador} onChange={() => handleCampoChange('cnpjTomador')} />}
                      label="CNPJ/CPF Tomador"
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" checked={campos.servico} onChange={() => handleCampoChange('servico')} />}
                      label="Descrição Serviço"
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" checked={campos.cnae} onChange={() => handleCampoChange('cnae')} />}
                      label="CNAE"
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" checked={campos.valor} onChange={() => handleCampoChange('valor')} />}
                      label="Valores"
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" checked={campos.tributos} onChange={() => handleCampoChange('tributos')} />}
                      label="Tributos"
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" checked={campos.status} onChange={() => handleCampoChange('status')} />}
                      label="Status"
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" checked={campos.codigoVerificacao} onChange={() => handleCampoChange('codigoVerificacao')} />}
                      label="Cód. Verificação"
                    />
                  </FormGroup>
                </Box>
              </>
            )}

            {formato === 'xml-zip' && (
              <Alert severity="info">
                Será gerado um arquivo ZIP contendo os XMLs originais de todas as notas selecionadas.
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {concluido ? (
          <Button onClick={handleClose} variant="contained">
            Fechar
          </Button>
        ) : (
          <>
            <Button onClick={handleClose} disabled={exportando}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExportar}
              disabled={exportando || getQuantidadeNotas() === 0}
            >
              Exportar {getQuantidadeNotas()} Notas
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
