import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Chip,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Checkbox,
  Tooltip,
  Menu,
  Paper,
  Pagination,
} from '@mui/material';
import {
  ErrorOutline,
  WarningAmber,
  InfoOutlined,
  CheckCircle,
  Delete,
  MarkEmailRead,
  Search,
  MoreVert,
  DeleteSweep,
  SelectAll,
  DateRange,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import {
  markAsRead,
  removeNotification,
  markAllAsRead,
  clearAllNotifications,
} from '../../../store/slices/notificationsSlice';
import type { Notification } from '../../../types';
import { format, isToday, isYesterday, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

type FilterType = 'all' | 'unread' | 'critica' | 'importante' | 'informativa';
type SortType = 'newest' | 'oldest';

const NotificationHistoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state) => state.notifications);
  
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortOrder, setSortOrder] = useState<SortType>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  
  const itemsPerPage = 10;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critica':
        return <ErrorOutline sx={{ color: 'white' }} />;
      case 'importante':
        return <WarningAmber sx={{ color: 'white' }} />;
      default:
        return <InfoOutlined sx={{ color: 'white' }} />;
    }
  };

  const getNotificationColor = (type: string): 'error' | 'warning' | 'info' | 'success' => {
    switch (type) {
      case 'critica':
        return 'error';
      case 'importante':
        return 'warning';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return `Hoje às ${format(date, 'HH:mm', { locale: ptBR })}`;
    }
    if (isYesterday(date)) {
      return `Ontem às ${format(date, 'HH:mm', { locale: ptBR })}`;
    }
    const daysDiff = differenceInDays(new Date(), date);
    if (daysDiff < 7) {
      return format(date, "EEEE 'às' HH:mm", { locale: ptBR });
    }
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  // Filtrar notificações
  const filteredNotifications = notifications
    .filter((n) => {
      // Filtro por tipo/status
      if (filterType === 'unread' && n.lida) return false;
      if (['critica', 'importante', 'informativa'].includes(filterType) && n.tipo !== filterType) return false;
      
      // Filtro por busca
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          n.titulo.toLowerCase().includes(query) ||
          n.mensagem.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      const dateA = parseISO(a.dataEnvio).getTime();
      const dateB = parseISO(b.dataEnvio).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Paginação
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Agrupar por data
  const groupedNotifications: { [key: string]: Notification[] } = {};
  paginatedNotifications.forEach((notification) => {
    const date = parseISO(notification.dataEnvio);
    let groupKey: string;
    
    if (isToday(date)) {
      groupKey = 'Hoje';
    } else if (isYesterday(date)) {
      groupKey = 'Ontem';
    } else {
      groupKey = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    }
    
    if (!groupedNotifications[groupKey]) {
      groupedNotifications[groupKey] = [];
    }
    groupedNotifications[groupKey].push(notification);
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleMarkSelectedAsRead = () => {
    selectedIds.forEach((id) => {
      dispatch(markAsRead(id));
    });
    setSelectedIds([]);
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach((id) => {
      dispatch(removeNotification(id));
    });
    setSelectedIds([]);
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
    setSelectedIds([]);
    handleCloseMenu();
  };

  const handleCloseMenu = () => {
    if (menuButtonRef.current) {
      menuButtonRef.current.focus();
    }
    setAnchorEl(null);
  };

  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.lida).length,
    critica: notifications.filter((n) => n.tipo === 'critica').length,
    importante: notifications.filter((n) => n.tipo === 'importante').length,
    informativa: notifications.filter((n) => n.tipo === 'informativa').length,
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Histórico de Notificações
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visualize e gerencie todas as suas notificações
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(5, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper
          variant="outlined"
          sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }}
          onClick={() => setFilterType('all')}
        >
          <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
            {stats.total}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total
          </Typography>
        </Paper>
        <Paper
          variant="outlined"
          sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }}
          onClick={() => setFilterType('unread')}
        >
          <Typography variant="h4" color="secondary" sx={{ fontWeight: 700 }}>
            {stats.unread}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Não lidas
          </Typography>
        </Paper>
        <Paper
          variant="outlined"
          sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }}
          onClick={() => setFilterType('critica')}
        >
          <Typography variant="h4" color="error" sx={{ fontWeight: 700 }}>
            {stats.critica}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Críticas
          </Typography>
        </Paper>
        <Paper
          variant="outlined"
          sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }}
          onClick={() => setFilterType('importante')}
        >
          <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
            {stats.importante}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Importantes
          </Typography>
        </Paper>
        <Paper
          variant="outlined"
          sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }}
          onClick={() => setFilterType('informativa')}
        >
          <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
            {stats.informativa}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Informativas
          </Typography>
        </Paper>
      </Box>

      {/* Filters & Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', md: 'center' },
              justifyContent: 'space-between',
            }}
          >
            {/* Search & Filters */}
            <Box sx={{ display: 'flex', gap: 2, flex: 1, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Buscar notificações..."
                size="small"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                sx={{ minWidth: 250 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Filtrar por</InputLabel>
                <Select
                  value={filterType}
                  label="Filtrar por"
                  onChange={(e) => {
                    setFilterType(e.target.value as FilterType);
                    setPage(1);
                  }}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  <MenuItem value="unread">Não lidas</MenuItem>
                  <MenuItem value="critica">Críticas</MenuItem>
                  <MenuItem value="importante">Importantes</MenuItem>
                  <MenuItem value="informativa">Informativas</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={sortOrder}
                  label="Ordenar por"
                  onChange={(e) => setSortOrder(e.target.value as SortType)}
                >
                  <MenuItem value="newest">Mais recentes</MenuItem>
                  <MenuItem value="oldest">Mais antigas</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Bulk Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {selectedIds.length > 0 ? (
                <>
                  <Chip
                    label={`${selectedIds.length} selecionada(s)`}
                    color="primary"
                    size="small"
                  />
                  <Button
                    size="small"
                    startIcon={<MarkEmailRead />}
                    onClick={handleMarkSelectedAsRead}
                  >
                    Marcar como lida
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleDeleteSelected}
                  >
                    Excluir
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="small"
                    startIcon={<SelectAll />}
                    onClick={handleSelectAll}
                  >
                    Selecionar todas
                  </Button>
                  <IconButton 
                    ref={menuButtonRef}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    disableRestoreFocus
                    MenuListProps={{
                      autoFocusItem: false,
                    }}
                  >
                    <MenuItem onClick={() => { dispatch(markAllAsRead()); handleCloseMenu(); }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <MarkEmailRead fontSize="small" />
                      </ListItemAvatar>
                      Marcar todas como lidas
                    </MenuItem>
                    <MenuItem onClick={handleClearAll} sx={{ color: 'error.main' }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <DeleteSweep fontSize="small" color="error" />
                      </ListItemAvatar>
                      Limpar histórico
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {filteredNotifications.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 64, color: 'success.light', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Nenhuma notificação encontrada
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchQuery
                  ? 'Tente ajustar os filtros de busca'
                  : 'Você está com tudo em dia!'}
              </Typography>
            </Box>
          ) : (
            <>
              {Object.entries(groupedNotifications).map(([date, notifs]) => (
                <Box key={date}>
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: 'grey.50',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <DateRange fontSize="small" />
                      {date}
                    </Typography>
                  </Box>
                  <List disablePadding>
                    {notifs.map((notification, index) => (
                      <React.Fragment key={notification.id}>
                        <ListItem
                          sx={{
                            bgcolor: notification.lida ? 'transparent' : 'action.hover',
                            '&:hover': { bgcolor: 'action.selected' },
                          }}
                        >
                          <Checkbox
                            checked={selectedIds.includes(notification.id)}
                            onChange={() => handleSelect(notification.id)}
                            sx={{ mr: 1 }}
                          />
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor: `${getNotificationColor(notification.tipo)}.main`,
                              }}
                            >
                              {getNotificationIcon(notification.tipo)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primaryTypographyProps={{ component: 'div' }}
                            secondaryTypographyProps={{ component: 'div' }}
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: notification.lida ? 400 : 600,
                                  }}
                                >
                                  {notification.titulo}
                                </Typography>
                                {!notification.lida && (
                                  <Chip
                                    label="Nova"
                                    size="small"
                                    color="primary"
                                    sx={{ height: 20 }}
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 0.5 }}
                                >
                                  {notification.mensagem}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(notification.dataEnvio)}
                                </Typography>
                              </>
                            }
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {!notification.lida && (
                              <Tooltip title="Marcar como lida">
                                <IconButton
                                  size="small"
                                  onClick={() => dispatch(markAsRead(notification.id))}
                                >
                                  <MarkEmailRead fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Excluir">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => dispatch(removeNotification(notification.id))}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </ListItem>
                        {index < notifs.length - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotificationHistoryPage;
