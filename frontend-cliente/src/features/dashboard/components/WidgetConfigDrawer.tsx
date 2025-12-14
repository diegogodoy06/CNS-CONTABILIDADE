import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Button,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close,
  DragIndicator,
  KeyboardArrowUp,
  KeyboardArrowDown,
  RestartAlt,
  Receipt,
  AccountBalance,
  Assessment,
  CalendarMonth,
  Description,
  Notifications,
  TrendingUp,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { RootState } from '../../../store';
import {
  toggleWidgetVisibility,
  setIsCustomizing,
  resetWidgets,
  moveWidgetUp,
  moveWidgetDown,
  type WidgetConfig,
} from '../../../store/slices/widgetsSlice';

interface WidgetConfigDrawerProps {
  open: boolean;
  onClose: () => void;
}

const WidgetConfigDrawer: React.FC<WidgetConfigDrawerProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const widgets = useAppSelector((state: RootState) => state.widgets.widgets);

  const getWidgetIcon = (type: WidgetConfig['type']) => {
    switch (type) {
      case 'notas':
        return <Receipt />;
      case 'faturamento':
        return <TrendingUp />;
      case 'impostos':
        return <AccountBalance />;
      case 'guias':
        return <Assessment />;
      case 'calendario':
        return <CalendarMonth />;
      case 'documentos':
        return <Description />;
      case 'notificacoes':
        return <Notifications />;
      default:
        return <Assessment />;
    }
  };

  const getWidgetColor = (type: WidgetConfig['type']): 'primary' | 'success' | 'error' | 'warning' | 'info' | 'secondary' => {
    switch (type) {
      case 'notas':
        return 'primary';
      case 'faturamento':
        return 'success';
      case 'impostos':
        return 'error';
      case 'guias':
        return 'warning';
      case 'calendario':
        return 'info';
      case 'documentos':
        return 'secondary';
      case 'notificacoes':
      default:
        return 'primary';
    }
  };

  const handleToggle = (widgetId: string) => {
    dispatch(toggleWidgetVisibility(widgetId));
  };

  const handleMoveUp = (widgetId: string) => {
    dispatch(moveWidgetUp(widgetId));
  };

  const handleMoveDown = (widgetId: string) => {
    dispatch(moveWidgetDown(widgetId));
  };

  const handleReset = () => {
    dispatch(resetWidgets());
  };

  const handleClose = () => {
    dispatch(setIsCustomizing(false));
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 380 },
          bgcolor: 'background.default',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Personalizar Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Organize seus widgets
          </Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Arraste os widgets para reordenar ou use as setas. Ative/desative para mostrar ou ocultar.
        </Typography>

        <List disablePadding>
          {widgets.map((widget, index) => (
            <ListItem
              key={widget.id}
              sx={{
                mb: 1,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: widget.visible ? 'divider' : alpha(theme.palette.text.disabled, 0.1),
                opacity: widget.visible ? 1 : 0.6,
                transition: 'all 0.2s',
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <DragIndicator sx={{ color: 'text.disabled', cursor: 'grab' }} />
              </ListItemIcon>
              
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette[getWidgetColor(widget.type)].main, 0.1),
                    color: `${getWidgetColor(widget.type)}.main`,
                  }}
                >
                  {getWidgetIcon(widget.type)}
                </Box>
              </ListItemIcon>
              
              <ListItemText
                primary={widget.title}
                secondary={
                  <Chip
                    size="small"
                    label={widget.size === 'small' ? 'KPI' : widget.size === 'medium' ? 'Médio' : 'Grande'}
                    sx={{ height: 20, fontSize: 10, mt: 0.5 }}
                  />
                }
              />
              
              <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleMoveUp(widget.id)}
                    disabled={index === 0}
                    sx={{ p: 0.25 }}
                  >
                    <KeyboardArrowUp fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleMoveDown(widget.id)}
                    disabled={index === widgets.length - 1}
                    sx={{ p: 0.25 }}
                  >
                    <KeyboardArrowDown fontSize="small" />
                  </IconButton>
                </Box>
                <Switch
                  edge="end"
                  checked={widget.visible}
                  onChange={() => handleToggle(widget.id)}
                  size="small"
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<RestartAlt />}
          onClick={handleReset}
          color="inherit"
        >
          Restaurar Padrão
        </Button>
      </Box>
    </Drawer>
  );
};

export default WidgetConfigDrawer;
