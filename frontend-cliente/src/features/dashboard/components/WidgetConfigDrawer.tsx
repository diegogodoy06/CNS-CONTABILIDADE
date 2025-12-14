import React, { useState, useCallback } from 'react';
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
  Paper,
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
  reorderWidgets,
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
  
  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  // Drag and Drop handlers
  const handleDragStart = useCallback((e: React.DragEvent<HTMLLIElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
    
    // Create custom drag image
    const element = e.currentTarget;
    element.style.opacity = '0.5';
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.style.opacity = '1';
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLIElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    
    if (dragIndex !== dropIndex) {
      dispatch(reorderWidgets({ dragIndex, hoverIndex: dropIndex }));
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [dispatch]);

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
        <Paper 
          elevation={0}
          sx={{ 
            p: 2, 
            mb: 2, 
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            ✨ <strong>Arraste</strong> os widgets para reordenar usando o ícone ≡ ou use as setas.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Ative/desative o switch para mostrar ou ocultar widgets no dashboard.
          </Typography>
        </Paper>

        <List disablePadding>
          {widgets.map((widget, index) => (
            <ListItem
              key={widget.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              sx={{
                mb: 1,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '2px solid',
                borderColor: dragOverIndex === index 
                  ? 'primary.main' 
                  : widget.visible 
                    ? 'divider' 
                    : alpha(theme.palette.text.disabled, 0.1),
                opacity: draggedIndex === index ? 0.5 : widget.visible ? 1 : 0.6,
                transition: 'all 0.2s',
                cursor: 'grab',
                transform: dragOverIndex === index ? 'scale(1.02)' : 'scale(1)',
                '&:active': {
                  cursor: 'grabbing',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <DragIndicator 
                  sx={{ 
                    color: draggedIndex === index ? 'primary.main' : 'text.disabled',
                    cursor: 'grab',
                    '&:hover': { color: 'primary.main' },
                  }} 
                />
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
