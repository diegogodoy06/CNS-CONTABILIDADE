import React, { useState, useMemo } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Save,
  Send,
  Description,
} from '@mui/icons-material';
import EtapaTomador from './wizard/EtapaTomador';
import EtapaServico from './wizard/EtapaServico';
import EtapaRevisao from './wizard/EtapaRevisao';
import type { Tomador } from '../../../types';

// Tipos do Wizard
export interface DadosServico {
  descricao: string;
  cnae: string;
  codigoTributacao: string;
  valorServico: number;
  municipioPrestacao: string;
  ufPrestacao: string;
  // Retenções
  retencaoIR: boolean;
  retencaoPIS: boolean;
  retencaoCOFINS: boolean;
  retencaoCSLL: boolean;
  retencaoINSS: boolean;
  retencaoISS: boolean;
  // Valores calculados
  aliquotaISS: number;
  valorISS: number;
  valorIR: number;
  valorPIS: number;
  valorCOFINS: number;
  valorCSLL: number;
  valorINSS: number;
  valorLiquido: number;
}

export interface DadosNota {
  tomador: Tomador | null;
  servico: DadosServico;
}

const steps = ['Tomador', 'Serviço', 'Revisão'];

const initialServico: DadosServico = {
  descricao: '',
  cnae: '',
  codigoTributacao: '',
  valorServico: 0,
  municipioPrestacao: 'São Paulo',
  ufPrestacao: 'SP',
  retencaoIR: false,
  retencaoPIS: false,
  retencaoCOFINS: false,
  retencaoCSLL: false,
  retencaoINSS: false,
  retencaoISS: false,
  aliquotaISS: 5,
  valorISS: 0,
  valorIR: 0,
  valorPIS: 0,
  valorCOFINS: 0,
  valorCSLL: 0,
  valorINSS: 0,
  valorLiquido: 0,
};

interface EmitirNotaWizardProps {
  onClose?: () => void;
  onSuccess?: (nota: DadosNota) => void;
  modoSimulacao?: boolean;
}

const EmitirNotaWizard: React.FC<EmitirNotaWizardProps> = ({
  onClose: _onClose,
  onSuccess,
  modoSimulacao = false,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [tomadorSelecionado, setTomadorSelecionado] = useState<Tomador | null>(null);
  const [dadosServico, setDadosServico] = useState<DadosServico>(initialServico);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calcular tributos automaticamente
  const tributosCalculados = useMemo(() => {
    const valor = dadosServico.valorServico;
    const aliquotaISS = dadosServico.aliquotaISS / 100;

    const valorISS = valor * aliquotaISS;
    const valorIR = dadosServico.retencaoIR ? valor * 0.015 : 0; // 1,5%
    const valorPIS = dadosServico.retencaoPIS ? valor * 0.0065 : 0; // 0,65%
    const valorCOFINS = dadosServico.retencaoCOFINS ? valor * 0.03 : 0; // 3%
    const valorCSLL = dadosServico.retencaoCSLL ? valor * 0.01 : 0; // 1%
    const valorINSS = dadosServico.retencaoINSS ? valor * 0.11 : 0; // 11%

    const totalRetencoes = valorIR + valorPIS + valorCOFINS + valorCSLL + valorINSS;
    const valorLiquido = valor - totalRetencoes - (dadosServico.retencaoISS ? valorISS : 0);

    return {
      valorISS,
      valorIR,
      valorPIS,
      valorCOFINS,
      valorCSLL,
      valorINSS,
      totalRetencoes,
      valorLiquido,
    };
  }, [dadosServico]);

  // Validar etapa atual
  const validarEtapa = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!tomadorSelecionado) {
        newErrors.tomador = 'Selecione um tomador para continuar';
      }
    }

    if (step === 1) {
      if (!dadosServico.descricao.trim()) {
        newErrors.descricao = 'Informe a descrição do serviço';
      }
      if (dadosServico.valorServico <= 0) {
        newErrors.valorServico = 'Informe o valor do serviço';
      }
      if (!dadosServico.cnae) {
        newErrors.cnae = 'Selecione o CNAE';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validarEtapa(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSalvarRascunho = async () => {
    setIsSubmitting(true);
    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    console.log('Rascunho salvo:', { tomador: tomadorSelecionado, servico: dadosServico });
    alert('Rascunho salvo com sucesso!');
  };

  const handleEmitir = async () => {
    if (!validarEtapa(2)) return;

    setIsSubmitting(true);
    // Simular emissão
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);

    const dadosNota: DadosNota = {
      tomador: tomadorSelecionado,
      servico: {
        ...dadosServico,
        ...tributosCalculados,
      },
    };

    console.log(modoSimulacao ? 'Simulação:' : 'Emissão:', dadosNota);
    
    if (onSuccess) {
      onSuccess(dadosNota);
    } else {
      alert(modoSimulacao ? 'Simulação gerada com sucesso!' : 'Nota fiscal emitida com sucesso!');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <EtapaTomador
            tomadorSelecionado={tomadorSelecionado}
            onSelectTomador={setTomadorSelecionado}
            error={errors.tomador}
          />
        );
      case 1:
        return (
          <EtapaServico
            dados={dadosServico}
            onChange={setDadosServico}
            tributos={tributosCalculados}
            errors={errors}
          />
        );
      case 2:
        return (
          <EtapaRevisao
            tomador={tomadorSelecionado}
            servico={dadosServico}
            tributos={tributosCalculados}
            modoSimulacao={modoSimulacao}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Description sx={{ fontSize: 32, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {modoSimulacao ? 'Simular Nota Fiscal' : 'Emitir Nota Fiscal'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {modoSimulacao
                ? 'Visualize como ficará a nota antes de emitir oficialmente'
                : 'Preencha os dados para emissão de NFS-e'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stepper */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontWeight: activeStep === index ? 600 : 400,
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Alerta de Simulação */}
      {modoSimulacao && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Modo Simulação:</strong> Esta nota não será transmitida para a prefeitura.
            Você receberá um PDF com marca d'água para conferência.
          </Typography>
        </Alert>
      )}

      {/* Conteúdo da Etapa */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          {renderStepContent(activeStep)}
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              {activeStep > 0 && (
                <Button
                  startIcon={<ArrowBack />}
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Voltar
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Próximo
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<Save />}
                    onClick={handleSalvarRascunho}
                    disabled={isSubmitting}
                  >
                    Salvar Rascunho
                  </Button>
                  <Button
                    variant="contained"
                    color={modoSimulacao ? 'secondary' : 'primary'}
                    startIcon={<Send />}
                    onClick={handleEmitir}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? 'Processando...'
                      : modoSimulacao
                      ? 'Gerar Simulação'
                      : 'Emitir Nota Fiscal'}
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmitirNotaWizard;
