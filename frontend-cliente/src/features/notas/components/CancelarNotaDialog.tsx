import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  alpha,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Receipt as ReceiptIcon,
  Check as CheckIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import type { NotaFiscal } from '../../../types';

interface CancelarNotaDialogProps {
  open: boolean;
  onClose: () => void;
  nota: NotaFiscal | null;
  onConfirm: (notaId: string, justificativa: string) => Promise<void>;
}

const steps = ['Justificativa', 'Confirmação'];

const MOTIVOS_PREDEFINIDOS = [
  'Erro no valor do serviço',
  'Erro nos dados do tomador',
  'Serviço não prestado',
  'Emissão em duplicidade',
  'Desistência do cliente',
  'Outro (especificar)',
];

export default function CancelarNotaDialog({
  open,
  onClose,
  nota,
  onConfirm,
}: CancelarNotaDialogProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [motivoSelecionado, setMotivoSelecionado] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [confirmacaoDigitada, setConfirmacaoDigitada] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleClose = () => {
    if (!loading) {
      setActiveStep(0);
      setMotivoSelecionado('');
      setJustificativa('');
      setConfirmacaoDigitada('');
      setAceitouTermos(false);
      setError('');
      setSucesso(false);
      onClose();
    }
  };

  const getJustificativaCompleta = () => {
    if (motivoSelecionado === 'Outro (especificar)') {
      return justificativa;
    }
    return justificativa ? `${motivoSelecionado}: ${justificativa}` : motivoSelecionado;
  };

  const validarEtapa1 = () => {
    const justificativaFinal = getJustificativaCompleta();
    return justificativaFinal.length >= 15 && justificativaFinal.length <= 255;
  };

  const validarEtapa2 = () => {
    const numeroNota = nota?.numero?.toString() || '';
    return confirmacaoDigitada === numeroNota && aceitouTermos;
  };

  const handleNext = () => {
    if (activeStep === 0 && validarEtapa1()) {
      setActiveStep(1);
    }
  };

  const handleBack = () => {
    setActiveStep(0);
    setConfirmacaoDigitada('');
    setAceitouTermos(false);
  };

  const handleConfirmar = async () => {
    if (!nota || !validarEtapa2()) return;

    setLoading(true);
    setError('');

    try {
      await onConfirm(nota.id, getJustificativaCompleta());
      setSucesso(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar nota fiscal');
    } finally {
      setLoading(false);
    }
  };

  if (!nota) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CancelIcon color="error" />
          <Typography variant="h6">Cancelar Nota Fiscal</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {sucesso ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Nota Cancelada com Sucesso!
            </Typography>
            <Typography color="text.secondary">
              A NF-e #{nota.numero} foi cancelada.
            </Typography>
          </Box>
        ) : (
          <>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Card com dados da nota */}
            <Card 
              variant="outlined" 
              sx={{ 
                mb: 3, 
                bgcolor: (theme) => alpha(theme.palette.warning.main, 0.05),
                borderColor: 'warning.main'
              }}
            >
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ReceiptIcon fontSize="small" color="warning" />
                  <Typography variant="subtitle2">
                    NF-e #{nota.numero}
                  </Typography>
                  <Chip 
                    label={nota.status} 
                    size="small" 
                    color="success"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Tomador: {nota.tomador?.nome || nota.tomador?.razaoSocial || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(nota.valores?.valorServico || 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Emissão: {nota.dataEmissao ? new Date(nota.dataEmissao).toLocaleDateString('pt-BR') : 'N/A'}
                </Typography>
              </CardContent>
            </Card>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }} icon={<ErrorIcon />}>
                {error}
              </Alert>
            )}

            {activeStep === 0 && (
              <Box>
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    O cancelamento de uma nota fiscal é <strong>irreversível</strong> e deve ser
                    realizado em até 24 horas após a emissão. Uma justificativa será enviada à prefeitura.
                  </Typography>
                </Alert>

                <Typography variant="subtitle2" gutterBottom>
                  Selecione o motivo do cancelamento:
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {MOTIVOS_PREDEFINIDOS.map((motivo) => (
                    <Chip
                      key={motivo}
                      label={motivo}
                      onClick={() => setMotivoSelecionado(motivo)}
                      color={motivoSelecionado === motivo ? 'primary' : 'default'}
                      variant={motivoSelecionado === motivo ? 'filled' : 'outlined'}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={motivoSelecionado === 'Outro (especificar)' ? 'Justificativa *' : 'Detalhes adicionais (opcional)'}
                  placeholder="Descreva detalhadamente o motivo do cancelamento..."
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  helperText={`${getJustificativaCompleta().length}/255 caracteres (mínimo 15)`}
                  error={getJustificativaCompleta().length > 0 && getJustificativaCompleta().length < 15}
                />
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Alert severity="error" sx={{ mb: 3 }} icon={<WarningIcon />}>
                  <Typography variant="body2" fontWeight="bold">
                    ATENÇÃO: Esta ação não pode ser desfeita!
                  </Typography>
                  <Typography variant="body2">
                    O cancelamento será registrado na prefeitura e a nota fiscal perderá sua validade fiscal.
                  </Typography>
                </Alert>

                <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Justificativa informada:
                  </Typography>
                  <Typography variant="body2">
                    "{getJustificativaCompleta()}"
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Para confirmar, digite o número da nota: <strong>{nota.numero}</strong>
                </Typography>

                <TextField
                  fullWidth
                  label="Número da Nota"
                  value={confirmacaoDigitada}
                  onChange={(e) => setConfirmacaoDigitada(e.target.value)}
                  placeholder={`Digite ${nota.numero}`}
                  sx={{ mb: 2 }}
                  error={confirmacaoDigitada.length > 0 && confirmacaoDigitada !== nota.numero?.toString()}
                />

                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={aceitouTermos}
                      onChange={(e) => setAceitouTermos(e.target.checked)}
                      color="error"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Estou ciente de que esta ação é irreversível e que a nota fiscal será cancelada
                      junto à prefeitura.
                    </Typography>
                  }
                />
              </Box>
            )}
          </>
        )}
      </DialogContent>

      {!sucesso && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          
          {activeStep === 0 ? (
            <Button 
              variant="contained" 
              onClick={handleNext}
              disabled={!validarEtapa1()}
            >
              Próximo
            </Button>
          ) : (
            <>
              <Button onClick={handleBack} disabled={loading}>
                Voltar
              </Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={handleConfirmar}
                disabled={!validarEtapa2() || loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CancelIcon />}
              >
                {loading ? 'Cancelando...' : 'Confirmar Cancelamento'}
              </Button>
            </>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
