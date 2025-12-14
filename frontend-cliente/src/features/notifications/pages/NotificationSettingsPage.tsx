import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  FormGroup,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Slider,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Notifications,
  Email,
  Sms,
  ErrorOutline,
  WarningAmber,
  InfoOutlined,
  Save,
  RestartAlt,
  NotificationsActive,
  Schedule,
  HelpOutline,
} from '@mui/icons-material';

interface NotificationSettings {
  // Tipos de notificação
  guiasVencimento: boolean;
  guiasVencidas: boolean;
  documentosNovos: boolean;
  notasFiscais: boolean;
  comunicadosContador: boolean;
  atualizacoesSistema: boolean;
  
  // Canais
  notificacaoPush: boolean;
  notificacaoEmail: boolean;
  notificacaoSMS: boolean;
  
  // Frequência
  frequenciaEmail: 'imediato' | 'diario' | 'semanal';
  
  // Horários
  horarioInicio: number;
  horarioFim: number;
  
  // Outras preferências
  somNotificacao: boolean;
  agruparNotificacoes: boolean;
  manterHistoricoDias: number;
}

const defaultSettings: NotificationSettings = {
  guiasVencimento: true,
  guiasVencidas: true,
  documentosNovos: true,
  notasFiscais: true,
  comunicadosContador: true,
  atualizacoesSistema: false,
  
  notificacaoPush: true,
  notificacaoEmail: true,
  notificacaoSMS: false,
  
  frequenciaEmail: 'diario',
  
  horarioInicio: 8,
  horarioFim: 18,
  
  somNotificacao: true,
  agruparNotificacoes: true,
  manterHistoricoDias: 30,
};

const NotificationSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (key: keyof NotificationSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    // Simular salvamento
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    setSnackbar({
      open: true,
      message: 'Configurações salvas com sucesso!',
      severity: 'success',
    });
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setSnackbar({
      open: true,
      message: 'Configurações restauradas para o padrão',
      severity: 'success',
    });
  };

  const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Configurações de Notificações
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gerencie como e quando você recebe notificações
        </Typography>
      </Box>

      {/* Tipos de Notificação */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <NotificationsActive color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Tipos de Notificação
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Escolha quais eventos devem gerar notificações
          </Typography>

          <List disablePadding>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <ErrorOutline color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Guias próximas do vencimento"
                secondary="Notificar 5 dias antes do vencimento"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.guiasVencimento}
                  onChange={() => handleToggle('guiasVencimento')}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />

            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <WarningAmber color="warning" />
              </ListItemIcon>
              <ListItemText
                primary="Guias vencidas"
                secondary="Alertar quando uma guia vencer sem pagamento"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.guiasVencidas}
                  onChange={() => handleToggle('guiasVencidas')}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />

            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <InfoOutlined color="info" />
              </ListItemIcon>
              <ListItemText
                primary="Novos documentos"
                secondary="Quando o contador enviar um novo documento"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.documentosNovos}
                  onChange={() => handleToggle('documentosNovos')}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />

            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <InfoOutlined color="info" />
              </ListItemIcon>
              <ListItemText
                primary="Notas fiscais"
                secondary="Status de emissão e cancelamento de NF-e"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.notasFiscais}
                  onChange={() => handleToggle('notasFiscais')}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />

            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <InfoOutlined color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Comunicados do contador"
                secondary="Mensagens e avisos importantes do escritório"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.comunicadosContador}
                  onChange={() => handleToggle('comunicadosContador')}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />

            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <InfoOutlined color="action" />
              </ListItemIcon>
              <ListItemText
                primary="Atualizações do sistema"
                secondary="Novidades e melhorias na plataforma"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.atualizacoesSistema}
                  onChange={() => handleToggle('atualizacoesSistema')}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Canais de Notificação */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Notifications color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Canais de Notificação
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Escolha como deseja receber as notificações
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                textAlign: 'center',
                borderColor: settings.notificacaoPush ? 'primary.main' : 'divider',
                bgcolor: settings.notificacaoPush ? 'primary.50' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => handleToggle('notificacaoPush')}
            >
              <Notifications
                sx={{
                  fontSize: 40,
                  color: settings.notificacaoPush ? 'primary.main' : 'grey.400',
                  mb: 1,
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Push no Navegador
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Notificações em tempo real
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={settings.notificacaoPush ? 'Ativo' : 'Inativo'}
                  size="small"
                  color={settings.notificacaoPush ? 'primary' : 'default'}
                />
              </Box>
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                textAlign: 'center',
                borderColor: settings.notificacaoEmail ? 'primary.main' : 'divider',
                bgcolor: settings.notificacaoEmail ? 'primary.50' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => handleToggle('notificacaoEmail')}
            >
              <Email
                sx={{
                  fontSize: 40,
                  color: settings.notificacaoEmail ? 'primary.main' : 'grey.400',
                  mb: 1,
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                E-mail
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Resumos e alertas importantes
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={settings.notificacaoEmail ? 'Ativo' : 'Inativo'}
                  size="small"
                  color={settings.notificacaoEmail ? 'primary' : 'default'}
                />
              </Box>
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                textAlign: 'center',
                borderColor: settings.notificacaoSMS ? 'primary.main' : 'divider',
                bgcolor: settings.notificacaoSMS ? 'primary.50' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => handleToggle('notificacaoSMS')}
            >
              <Sms
                sx={{
                  fontSize: 40,
                  color: settings.notificacaoSMS ? 'primary.main' : 'grey.400',
                  mb: 1,
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                SMS
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Apenas alertas críticos
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={settings.notificacaoSMS ? 'Ativo' : 'Inativo'}
                  size="small"
                  color={settings.notificacaoSMS ? 'primary' : 'default'}
                />
              </Box>
            </Paper>
          </Box>

          {settings.notificacaoEmail && (
            <Box sx={{ mt: 3 }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Frequência de e-mail</InputLabel>
                <Select
                  value={settings.frequenciaEmail}
                  label="Frequência de e-mail"
                  onChange={(e) => handleChange('frequenciaEmail', e.target.value)}
                >
                  <MenuItem value="imediato">Imediato (cada notificação)</MenuItem>
                  <MenuItem value="diario">Resumo diário</MenuItem>
                  <MenuItem value="semanal">Resumo semanal</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Horários Permitidos */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Schedule color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Horários Permitidos
            </Typography>
            <Tooltip title="Defina em quais horários você deseja receber notificações push">
              <IconButton size="small">
                <HelpOutline fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Notificações push serão enviadas apenas neste período
          </Typography>

          <Box sx={{ px: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                Das <strong>{formatHour(settings.horarioInicio)}</strong>
              </Typography>
              <Typography variant="body2">
                Até <strong>{formatHour(settings.horarioFim)}</strong>
              </Typography>
            </Box>
            <Slider
              value={[settings.horarioInicio, settings.horarioFim]}
              onChange={(_, value) => {
                const [start, end] = value as number[];
                handleChange('horarioInicio', start);
                handleChange('horarioFim', end);
              }}
              valueLabelDisplay="auto"
              valueLabelFormat={formatHour}
              min={0}
              max={24}
              step={1}
              marks={[
                { value: 0, label: '00:00' },
                { value: 6, label: '06:00' },
                { value: 12, label: '12:00' },
                { value: 18, label: '18:00' },
                { value: 24, label: '24:00' },
              ]}
            />
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            Notificações críticas (guias vencidas) serão enviadas a qualquer momento.
          </Alert>
        </CardContent>
      </Card>

      {/* Outras Preferências */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Outras Preferências
          </Typography>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.somNotificacao}
                  onChange={() => handleToggle('somNotificacao')}
                />
              }
              label="Som de notificação"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.agruparNotificacoes}
                  onChange={() => handleToggle('agruparNotificacoes')}
                />
              }
              label="Agrupar notificações semelhantes"
            />
          </FormGroup>

          <Box sx={{ mt: 3 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Manter histórico por</InputLabel>
              <Select
                value={settings.manterHistoricoDias}
                label="Manter histórico por"
                onChange={(e) => handleChange('manterHistoricoDias', e.target.value)}
              >
                <MenuItem value={7}>7 dias</MenuItem>
                <MenuItem value={15}>15 dias</MenuItem>
                <MenuItem value={30}>30 dias</MenuItem>
                <MenuItem value={60}>60 dias</MenuItem>
                <MenuItem value={90}>90 dias</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RestartAlt />}
          onClick={handleReset}
        >
          Restaurar Padrões
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
        >
          Salvar Configurações
        </Button>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NotificationSettingsPage;
