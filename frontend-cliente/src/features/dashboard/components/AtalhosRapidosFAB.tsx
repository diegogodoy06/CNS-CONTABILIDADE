import React, { useState } from 'react';
import {
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  useTheme,
  Zoom,
} from '@mui/material';
import {
  Add,
  Receipt,
  CloudUpload,
  Chat,
  CalendarMonth,
  Assessment,
  Close,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface AcaoRapida {
  icon: React.ReactNode;
  name: string;
  tooltip: string;
  onClick: () => void;
  color?: string;
}

interface AtalhosRapidosFABProps {
  visible?: boolean;
}

const AtalhosRapidosFAB: React.FC<AtalhosRapidosFABProps> = ({ visible = true }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const acoes: AcaoRapida[] = [
    {
      icon: <Receipt />,
      name: 'emitir-nota',
      tooltip: 'Emitir NF-e',
      onClick: () => navigate('/notas/emitir'),
      color: theme.palette.primary.main,
    },
    {
      icon: <CloudUpload />,
      name: 'upload-documento',
      tooltip: 'Enviar Documento',
      onClick: () => navigate('/documentos?upload=true'),
      color: theme.palette.info.main,
    },
    {
      icon: <CalendarMonth />,
      name: 'calendario',
      tooltip: 'Ver Calendário',
      onClick: () => navigate('/calendario'),
      color: theme.palette.warning.main,
    },
    {
      icon: <Assessment />,
      name: 'relatorio',
      tooltip: 'Gerar Relatório',
      onClick: () => navigate('/relatorios'),
      color: theme.palette.secondary.main,
    },
    {
      icon: <Chat />,
      name: 'falar-contador',
      tooltip: 'Falar com Contador',
      onClick: () => {
        // TODO: Abrir chat ou modal de contato
        console.log('Falar com contador');
      },
      color: theme.palette.success.main,
    },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1200,
      }}
    >
      <Zoom in>
        <SpeedDial
          ariaLabel="Ações rápidas"
          icon={<SpeedDialIcon icon={<Add />} openIcon={<Close />} />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          direction="up"
          FabProps={{
            sx: {
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              boxShadow: 4,
            },
          }}
        >
          {acoes.map((acao) => (
            <SpeedDialAction
              key={acao.name}
              icon={acao.icon}
              tooltipTitle={acao.tooltip}
              tooltipOpen
              onClick={() => {
                acao.onClick();
                handleClose();
              }}
              FabProps={{
                sx: {
                  bgcolor: acao.color || 'primary.main',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: acao.color || 'primary.main',
                    filter: 'brightness(0.9)',
                  },
                },
              }}
              sx={{
                '& .MuiSpeedDialAction-staticTooltipLabel': {
                  whiteSpace: 'nowrap',
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  boxShadow: 2,
                  fontWeight: 500,
                },
              }}
            />
          ))}
        </SpeedDial>
      </Zoom>
    </Box>
  );
};

export default AtalhosRapidosFAB;
