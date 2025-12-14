import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Badge,
  Chip,
  alpha,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Notifications,
  Receipt,
  Warning,
  CheckCircle,
  Info,
  Close,
  Circle,
} from '@mui/icons-material';

export interface Notificacao {
  id: string;
  tipo: 'info' | 'warning' | 'success' | 'error';
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  acao?: {
    label: string;
    href: string;
  };
}

interface CentralNotificacoesProps {
  notificacoes?: Notificacao[];
  onMarcarLida?: (id: string) => void;
  onMarcarTodasLidas?: () => void;
  compacto?: boolean;
}

const notificacoesMock: Notificacao[] = [
  {
    id: '1',
    tipo: 'warning',
    titulo: 'Guia de ISS vence em 3 dias',
    mensagem: 'A guia de ISS referente a dezembro/2024 vence em 20/12.',
    data: 'Há 2 horas',
    lida: false,
    acao: { label: 'Ver guia', href: '/guias' },
  },
  {
    id: '2',
    tipo: 'success',
    titulo: 'Nota fiscal emitida',
    mensagem: 'A NFS-e nº 1023 foi emitida com sucesso para Tech Solutions LTDA.',
    data: 'Há 5 horas',
    lida: false,
    acao: { label: 'Ver nota', href: '/notas' },
  },
  {
    id: '3',
    tipo: 'info',
    titulo: 'Novo documento disponível',
    mensagem: 'Seu balanço patrimonial de novembro está disponível.',
    data: 'Ontem',
    lida: true,
    acao: { label: 'Download', href: '/documentos' },
  },
  {
    id: '4',
    tipo: 'error',
    titulo: 'Ação necessária',
    mensagem: 'Há documentos pendentes de envio para a contabilidade.',
    data: '2 dias atrás',
    lida: true,
    acao: { label: 'Enviar', href: '/documentos' },
  },
];

const CentralNotificacoes: React.FC<CentralNotificacoesProps> = ({
  notificacoes = notificacoesMock,
  onMarcarLida,
  onMarcarTodasLidas,
  compacto = false,
}) => {
  const theme = useTheme();

  const getIconByTipo = (tipo: Notificacao['tipo']) => {
    switch (tipo) {
      case 'warning':
        return <Warning fontSize="small" />;
      case 'success':
        return <CheckCircle fontSize="small" />;
      case 'error':
        return <Receipt fontSize="small" />;
      default:
        return <Info fontSize="small" />;
    }
  };

  const getColorByTipo = (tipo: Notificacao['tipo']) => {
    switch (tipo) {
      case 'warning':
        return theme.palette.warning.main;
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Badge badgeContent={naoLidas} color="error">
            <Notifications color="action" />
          </Badge>
          <Typography variant="subtitle2" color="text.secondary">
            Notificações
          </Typography>
        </Box>
        {naoLidas > 0 && (
          <Typography
            variant="caption"
            color="primary"
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={onMarcarTodasLidas}
          >
            Marcar todas como lidas
          </Typography>
        )}
      </Box>

      <List disablePadding>
        {notificacoes.slice(0, compacto ? 3 : undefined).map((notificacao) => (
          <ListItem
            key={notificacao.id}
            sx={{
              px: 1.5,
              py: 1,
              mb: 1,
              borderRadius: 1,
              bgcolor: notificacao.lida
                ? 'transparent'
                : alpha(getColorByTipo(notificacao.tipo), 0.05),
              border: '1px solid',
              borderColor: notificacao.lida ? 'divider' : alpha(getColorByTipo(notificacao.tipo), 0.2),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
            secondaryAction={
              !notificacao.lida && (
                <Tooltip title="Marcar como lida">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => onMarcarLida?.(notificacao.id)}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Tooltip>
              )
            }
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: getColorByTipo(notificacao.tipo),
              }}
            >
              {getIconByTipo(notificacao.tipo)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {!notificacao.lida && (
                    <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                  )}
                  <Typography variant="body2" fontWeight={notificacao.lida ? 400 : 600}>
                    {notificacao.titulo}
                  </Typography>
                </Box>
              }
              secondary={
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {notificacao.mensagem}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Typography variant="caption" color="text.disabled">
                      {notificacao.data}
                    </Typography>
                    {notificacao.acao && (
                      <Chip
                        label={notificacao.acao.label}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ height: 20, fontSize: '0.65rem' }}
                        clickable
                      />
                    )}
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>

      {compacto && notificacoes.length > 3 && (
        <Typography
          variant="caption"
          color="primary"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 1,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Ver todas ({notificacoes.length}) →
        </Typography>
      )}
    </Box>
  );
};

export default CentralNotificacoes;
