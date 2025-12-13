import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Tabs,
  Tab,
  InputAdornment,
  Switch,
  FormControlLabel,
  Alert,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Close,
  ContentCopy,
  Link as LinkIcon,
  Email,
  Person,
  Lock,
  Public,
  AccessTime,
  Check,
  PersonAdd,
  Share,
  Visibility,
  Edit as EditIcon,
} from '@mui/icons-material';
import type { Document as DocType } from '../../../types';

interface ShareDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  document: DocType | null;
  onShare?: (shareData: ShareData) => void;
}

interface ShareData {
  documentId: string;
  type: 'link' | 'email';
  recipients?: string[];
  permission: 'view' | 'download' | 'edit';
  expiresDays?: number;
  notifyOnAccess?: boolean;
}

interface SharedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  permission: 'view' | 'download' | 'edit';
  sharedAt: string;
}

// Mock de usuários com quem já foi compartilhado
const mockSharedUsers: SharedUser[] = [
  {
    id: '1',
    name: 'Maria Santos',
    email: 'maria.santos@contador.com',
    permission: 'download',
    sharedAt: '2024-11-20T10:30:00',
  },
  {
    id: '2',
    name: 'João Pereira',
    email: 'joao@empresa.com',
    permission: 'view',
    sharedAt: '2024-11-18T14:00:00',
  },
];

const ShareDocumentDialog: React.FC<ShareDocumentDialogProps> = ({
  open,
  onClose,
  document,
  onShare,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [permission, setPermission] = useState<'view' | 'download' | 'edit'>('view');
  const [expiresDays, setExpiresDays] = useState<number | null>(7);
  const [notifyOnAccess, setNotifyOnAccess] = useState(true);
  const [sharedUsers] = useState<SharedUser[]>(mockSharedUsers);

  // Generate mock share link
  const shareLink = document
    ? `https://app.cnscontabil.com.br/share/${document.id}?token=abc123xyz`
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      console.error('Falha ao copiar');
    }
  };

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (email && !selectedEmails.includes(email) && isValidEmail(email)) {
      setSelectedEmails([...selectedEmails, email]);
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    setSelectedEmails(selectedEmails.filter(e => e !== email));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleShare = () => {
    if (document && onShare) {
      onShare({
        documentId: document.id,
        type: activeTab === 0 ? 'link' : 'email',
        recipients: selectedEmails,
        permission,
        expiresDays: expiresDays || undefined,
        notifyOnAccess,
      });
    }
    onClose();
  };

  const getPermissionIcon = (perm: string) => {
    switch (perm) {
      case 'view':
        return <Visibility fontSize="small" />;
      case 'download':
        return <ContentCopy fontSize="small" />;
      case 'edit':
        return <EditIcon fontSize="small" />;
      default:
        return <Visibility fontSize="small" />;
    }
  };

  const getPermissionLabel = (perm: string) => {
    switch (perm) {
      case 'view':
        return 'Visualizar';
      case 'download':
        return 'Download';
      case 'edit':
        return 'Editar';
      default:
        return 'Visualizar';
    }
  };

  if (!document) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Share sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Compartilhar Documento
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 250, display: 'block' }}>
                {document.nome}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<LinkIcon fontSize="small" />}
            label="Link"
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab
            icon={<Email fontSize="small" />}
            label="E-mail"
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Tab 1: Link Sharing */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Gerar link de compartilhamento
              </Typography>

              <TextField
                fullWidth
                size="small"
                value={shareLink}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={linkCopied ? 'Copiado!' : 'Copiar link'}>
                        <IconButton onClick={handleCopyLink} size="small">
                          {linkCopied ? <Check color="success" /> : <ContentCopy />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              {/* Permission Selection */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Permissão
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {(['view', 'download', 'edit'] as const).map(perm => (
                  <Chip
                    key={perm}
                    icon={getPermissionIcon(perm)}
                    label={getPermissionLabel(perm)}
                    onClick={() => setPermission(perm)}
                    variant={permission === perm ? 'filled' : 'outlined'}
                    color={permission === perm ? 'primary' : 'default'}
                    sx={{ flex: 1 }}
                  />
                ))}
              </Box>

              {/* Expiration */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Expiração
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {[1, 7, 30, null].map((days, idx) => (
                  <Chip
                    key={idx}
                    icon={days ? <AccessTime fontSize="small" /> : <Public fontSize="small" />}
                    label={days ? `${days} dia${days > 1 ? 's' : ''}` : 'Nunca'}
                    onClick={() => setExpiresDays(days)}
                    variant={expiresDays === days ? 'filled' : 'outlined'}
                    color={expiresDays === days ? 'primary' : 'default'}
                  />
                ))}
              </Box>

              {/* Options */}
              <FormControlLabel
                control={
                  <Switch
                    checked={notifyOnAccess}
                    onChange={(e) => setNotifyOnAccess(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    Notificar quando alguém acessar
                  </Typography>
                }
              />
            </Box>
          )}

          {/* Tab 2: Email Sharing */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Convidar pessoas por e-mail
              </Typography>

              <TextField
                fullWidth
                size="small"
                placeholder="Digite um e-mail e pressione Enter"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonAdd fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              {/* Selected Emails */}
              {selectedEmails.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  {selectedEmails.map(email => (
                    <Chip
                      key={email}
                      label={email}
                      onDelete={() => handleRemoveEmail(email)}
                      size="small"
                    />
                  ))}
                </Box>
              )}

              {/* Permission for Email */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Permissão
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {(['view', 'download', 'edit'] as const).map(perm => (
                  <Chip
                    key={perm}
                    icon={getPermissionIcon(perm)}
                    label={getPermissionLabel(perm)}
                    onClick={() => setPermission(perm)}
                    variant={permission === perm ? 'filled' : 'outlined'}
                    color={permission === perm ? 'primary' : 'default'}
                    sx={{ flex: 1 }}
                  />
                ))}
              </Box>

              {selectedEmails.length === 0 && (
                <Alert severity="info" icon={<Email />}>
                  Adicione endereços de e-mail para compartilhar o documento
                </Alert>
              )}
            </Box>
          )}

          {/* Currently Shared With */}
          {sharedUsers.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Lock fontSize="small" />
                Compartilhado com
              </Typography>

              <List dense>
                {sharedUsers.map(user => (
                  <ListItem
                    key={user.id}
                    secondaryAction={
                      <Chip
                        icon={getPermissionIcon(user.permission)}
                        label={getPermissionLabel(user.permission)}
                        size="small"
                        variant="outlined"
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        <Person fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={user.email}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        {activeTab === 0 ? (
          <Button
            variant="contained"
            startIcon={<ContentCopy />}
            onClick={handleCopyLink}
          >
            {linkCopied ? 'Link Copiado!' : 'Copiar Link'}
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<Email />}
            onClick={handleShare}
            disabled={selectedEmails.length === 0}
          >
            Enviar Convite
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ShareDocumentDialog;
