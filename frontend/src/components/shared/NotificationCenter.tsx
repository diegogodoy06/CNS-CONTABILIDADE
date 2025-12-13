import React, { useState, useRef } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Divider,
  Chip,
  Tooltip,
  Tabs,
  Tab,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Notifications,
  ErrorOutline,
  WarningAmber,
  InfoOutlined,
  Close,
  DoneAll,
  Settings,
  NotificationsOff,
} from '@mui/icons-material';
import { formatDistanceToNow, parseISO, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
} from '../../store/slices/notificationsSlice';
import type { Notification } from '../../types';

const getNotificationIcon = (tipo: Notification['tipo']) => {
  switch (tipo) {
    case 'critica':
      return <ErrorOutline sx={{ color: 'error.main' }} />;
    case 'importante':
      return <WarningAmber sx={{ color: 'warning.main' }} />;
    case 'informativa':
    default:
      return <InfoOutlined sx={{ color: 'info.main' }} />;
  }
};

const getNotificationColor = (tipo: Notification['tipo']): 'error' | 'warning' | 'info' => {
  switch (tipo) {
    case 'critica':
      return 'error';
    case 'importante':
      return 'warning';
    case 'informativa':
    default:
      return 'info';
  }
};

const NotificationCenter: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);
  
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    // Move focus back to the trigger button before closing to avoid aria-hidden issues
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.lida) {
      dispatch(markAsRead(notification.id));
    }
    if (notification.link) {
      navigate(notification.link);
      handleClose();
    }
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleRemove = (id: string) => {
    dispatch(removeNotification(id));
  };

  const handleClearAll = () => {
    dispatch(clearNotifications());
  };

  const handleSettingsClick = () => {
    navigate('/configuracoes/notificacoes');
    handleClose();
  };

  // Filter notifications by tab
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 0) return true; // Todas
    if (activeTab === 1) return !n.lida; // Não lidas
    if (activeTab === 2) return n.tipo === 'critica'; // Críticas
    return true;
  });

  // Group by date
  const groupedNotifications = filteredNotifications.reduce(
    (acc, notification) => {
      const notifDate = parseISO(notification.dataEnvio);

      if (isToday(notifDate)) {
        acc.today.push(notification);
      } else if (isYesterday(notifDate)) {
        acc.yesterday.push(notification);
      } else {
        acc.older.push(notification);
      }
      return acc;
    },
    { today: [] as Notification[], yesterday: [] as Notification[], older: [] as Notification[] }
  );

  const renderNotificationItem = (notification: Notification) => (
    <ListItem
      key={notification.id}
      alignItems="flex-start"
      sx={{
        py: 1.5,
        px: 2,
        cursor: 'pointer',
        bgcolor: notification.lida ? 'transparent' : alpha(theme.palette.primary.main, 0.04),
        borderLeft: notification.lida ? 'none' : `3px solid ${theme.palette[getNotificationColor(notification.tipo)].main}`,
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
        },
        transition: 'background-color 0.2s',
      }}
      onClick={() => handleNotificationClick(notification)}
      secondaryAction={
        <IconButton
          edge="end"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleRemove(notification.id);
          }}
          sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
        >
          <Close fontSize="small" />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette[getNotificationColor(notification.tipo)].main, 0.1),
            width: 40,
            height: 40,
          }}
        >
          {getNotificationIcon(notification.tipo)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primaryTypographyProps={{ component: 'div' }}
        secondaryTypographyProps={{ component: 'div' }}
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 4 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: notification.lida ? 400 : 600,
                color: 'text.primary',
              }}
            >
              {notification.titulo}
            </Typography>
            {!notification.lida && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  flexShrink: 0,
                }}
              />
            )}
          </Box>
        }
        secondary={
          <Box sx={{ mt: 0.5 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {notification.mensagem}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(parseISO(notification.dataEnvio), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </Typography>
            </Box>
          </Box>
        }
      />
    </ListItem>
  );

  const renderDateGroup = (title: string, items: Notification[]) => {
    if (items.length === 0) return null;
    return (
      <Box key={title}>
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: 'block',
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: '0.65rem',
            letterSpacing: 0.5,
            bgcolor: 'grey.50',
          }}
        >
          {title}
        </Typography>
        <List disablePadding>
          {items.map(renderNotificationItem)}
        </List>
      </Box>
    );
  };

  return (
    <>
      <Tooltip title="Notificações">
        <IconButton
          ref={buttonRef}
          aria-describedby={id}
          onClick={handleClick}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.65rem',
                height: 18,
                minWidth: 18,
              },
            }}
          >
            <Notifications sx={{ fontSize: 22 }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableRestoreFocus
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 400,
            maxHeight: 520,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notificações
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                color="error"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Marcar todas como lidas">
              <span>
                <IconButton size="small" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                  <DoneAll fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Configurações">
              <IconButton size="small" onClick={handleSettingsClick}>
                <Settings fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            minHeight: 40,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 40,
              fontSize: '0.8rem',
              textTransform: 'none',
            },
          }}
        >
          <Tab label="Todas" />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                Não lidas
                {unreadCount > 0 && (
                  <Chip
                    label={unreadCount}
                    size="small"
                    sx={{ height: 16, fontSize: '0.6rem', bgcolor: 'error.light', color: 'white' }}
                  />
                )}
              </Box>
            }
          />
          <Tab label="Críticas" />
        </Tabs>

        {/* Notification List */}
        <Box sx={{ maxHeight: 340, overflow: 'auto' }}>
          {filteredNotifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <NotificationsOff sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                {activeTab === 1 ? 'Nenhuma notificação não lida' : 
                 activeTab === 2 ? 'Nenhuma notificação crítica' :
                 'Nenhuma notificação'}
              </Typography>
            </Box>
          ) : (
            <>
              {renderDateGroup('Hoje', groupedNotifications.today)}
              {renderDateGroup('Ontem', groupedNotifications.yesterday)}
              {renderDateGroup('Anteriores', groupedNotifications.older)}
            </>
          )}
        </Box>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                size="small"
                color="inherit"
                onClick={handleClearAll}
                sx={{ fontSize: '0.75rem' }}
              >
                Limpar todas
              </Button>
              <Button
                size="small"
                onClick={() => {
                  navigate('/notificacoes');
                  handleClose();
                }}
                sx={{ fontSize: '0.75rem' }}
              >
                Ver histórico completo
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};

export default NotificationCenter;
