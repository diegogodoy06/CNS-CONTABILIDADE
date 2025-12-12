import React from 'react';
import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import EmitirNotaWizard from '../components/EmitirNotaWizard';

const EmitirNotaPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Verifica se é modo simulação via query param
  const modoSimulacao = searchParams.get('simulacao') === 'true';

  const handleClose = () => {
    navigate('/notas');
  };

  const handleSuccess = () => {
    navigate('/notas');
  };

  return (
    <Box>
      {/* Botão Voltar */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleClose}
          color="inherit"
        >
          Voltar para Notas Fiscais
        </Button>
      </Box>

      {/* Wizard */}
      <EmitirNotaWizard
        onClose={handleClose}
        onSuccess={handleSuccess}
        modoSimulacao={modoSimulacao}
      />
    </Box>
  );
};

export default EmitirNotaPage;
