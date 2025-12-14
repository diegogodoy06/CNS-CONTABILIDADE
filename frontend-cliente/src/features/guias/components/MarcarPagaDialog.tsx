import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Close,
  CheckCircle,
  CloudUpload,
  UploadFile,
  CreditCard,
  Pix,
  AccountBalance,
  Receipt,
  CalendarToday,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Guia, TipoGuia } from '../../../types';

interface MarcarPagaDialogProps {
  open: boolean;
  onClose: () => void;
  guia: Guia | null;
  onConfirmar: (guiaId: string, dados: DadosPagamento) => Promise<void>;
}

export interface DadosPagamento {
  dataPagamento: string;
  formaPagamento: 'pix' | 'boleto' | 'debito' | 'transferencia';
  valorPago: number;
  comprovante?: File;
  observacao?: string;
}

const tipoConfig: Record<TipoGuia, { label: string; color: string }> = {
  DAS: { label: 'DAS - Simples Nacional', color: '#2563eb' },
  ISS: { label: 'ISS - Imposto sobre Serviços', color: '#059669' },
  INSS: { label: 'INSS - Previdência Social', color: '#d97706' },
  IRPJ: { label: 'IRPJ - Imposto de Renda PJ', color: '#7c3aed' },
  CSLL: { label: 'CSLL - Contribuição Social', color: '#db2777' },
  'PIS/COFINS': { label: 'PIS/COFINS - Contribuições', color: '#0891b2' },
  FGTS: { label: 'FGTS - Fundo de Garantia', color: '#ea580c' },
  obrigacao_acessoria: { label: 'Obrigação Acessória', color: '#6b7280' },
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formasPagamento = [
  { value: 'pix', label: 'PIX', icon: <Pix /> },
  { value: 'boleto', label: 'Boleto Bancário', icon: <Receipt /> },
  { value: 'debito', label: 'Débito Automático', icon: <CreditCard /> },
  { value: 'transferencia', label: 'Transferência Bancária', icon: <AccountBalance /> },
];

const MarcarPagaDialog: React.FC<MarcarPagaDialogProps> = ({
  open,
  onClose,
  guia,
  onConfirmar,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [dataPagamento, setDataPagamento] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [formaPagamento, setFormaPagamento] = useState<DadosPagamento['formaPagamento']>('pix');
  const [valorPago, setValorPago] = useState('');
  const [comprovante, setComprovante] = useState<File | null>(null);
  const [observacao, setObservacao] = useState('');

  if (!guia) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onConfirmar(guia.id, {
        dataPagamento,
        formaPagamento,
        valorPago: parseFloat(valorPago) || guia.valor,
        comprovante: comprovante || undefined,
        observacao: observacao || undefined,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setComprovante(file);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircle sx={{ fontSize: 28, color: 'success.main' }} />
            <Typography variant="h6" fontWeight={600}>
              Marcar como Paga
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Resumo da Guia */}
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            borderColor: alpha(theme.palette.primary.main, 0.2)
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={guia.tipo}
                  size="small"
                  sx={{ 
                    bgcolor: tipoConfig[guia.tipo]?.color,
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Competência: {guia.competencia}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Valor da Guia
              </Typography>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                {formatCurrency(guia.valor)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Vencimento
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {format(parseISO(guia.dataVencimento), "dd/MM/yyyy", { locale: ptBR })}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Alerta se vencida */}
        {guia.status === 'vencida' && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Esta guia está vencida. Verifique se há multa ou juros a serem pagos.
          </Alert>
        )}

        {/* Formulário */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Data do Pagamento"
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <CalendarToday sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Valor Pago"
              placeholder={formatCurrency(guia.valor)}
              value={valorPago}
              onChange={(e) => setValorPago(e.target.value.replace(/[^\d.,]/g, ''))}
              helperText="Deixe em branco para usar o valor original"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Forma de Pagamento</InputLabel>
              <Select
                value={formaPagamento}
                label="Forma de Pagamento"
                onChange={(e) => setFormaPagamento(e.target.value as DadosPagamento['formaPagamento'])}
              >
                {formasPagamento.map((forma) => (
                  <MenuItem key={forma.value} value={forma.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {forma.icon}
                      {forma.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Comprovante de Pagamento (opcional)
            </Typography>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: comprovante ? 'success.main' : 'grey.300',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                bgcolor: comprovante ? alpha(theme.palette.success.main, 0.05) : 'transparent',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                },
              }}
              onClick={() => document.getElementById('comprovante-input')?.click()}
            >
              <input
                id="comprovante-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              {comprovante ? (
                <Box>
                  <UploadFile sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="body2" fontWeight={500}>
                    {comprovante.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(comprovante.size / 1024).toFixed(1)} KB
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CloudUpload sx={{ fontSize: 40, color: 'grey.400', mb: 1 }} />
                  <Typography variant="body2">
                    Clique para anexar comprovante
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PDF, JPG ou PNG até 5MB
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observação"
              placeholder="Informações adicionais sobre o pagamento..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Confirmando...' : 'Confirmar Pagamento'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarcarPagaDialog;
