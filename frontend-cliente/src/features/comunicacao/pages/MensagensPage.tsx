import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Badge,
  Chip,
  Paper,
  InputAdornment,
  useTheme,
  alpha,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import {
  Send,
  AttachFile,
  Search,
  MoreVert,
  Image,
  Description,
  InsertDriveFile,
  EmojiEmotions,
  Done,
  DoneAll,
  Circle,
} from '@mui/icons-material';

// Tipos
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'contador';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  attachment?: {
    name: string;
    type: 'image' | 'document' | 'file';
    url: string;
  };
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  role: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  online: boolean;
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Maria Santos',
    avatar: 'MS',
    role: 'Contadora Responsável',
    lastMessage: 'Olá! Recebi seu documento. Vou analisar e retorno em breve.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    online: true,
  },
  {
    id: '2',
    name: 'João Oliveira',
    avatar: 'JO',
    role: 'Assistente Fiscal',
    lastMessage: 'A guia de ISS já foi gerada.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    online: false,
  },
  {
    id: '3',
    name: 'Suporte CNS',
    avatar: 'SC',
    role: 'Atendimento Geral',
    lastMessage: 'Seu ticket #1234 foi resolvido. Precisa de mais alguma coisa?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
    online: true,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Olá Maria! Preciso de ajuda com a emissão de uma nota fiscal.',
    sender: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: 'read',
  },
  {
    id: '2',
    text: 'Olá! Claro, posso ajudar. Qual é a dúvida?',
    sender: 'contador',
    timestamp: new Date(Date.now() - 1000 * 60 * 28),
    status: 'read',
  },
  {
    id: '3',
    text: 'Não sei qual código de serviço usar para consultoria em TI.',
    sender: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    status: 'read',
  },
  {
    id: '4',
    text: 'Para consultoria em TI, você deve usar o código 1.05 - Licenciamento ou cessão de direito de uso de programas de computação.',
    sender: 'contador',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    status: 'read',
  },
  {
    id: '5',
    text: 'Vou enviar um documento com a tabela completa de códigos para você consultar sempre que precisar.',
    sender: 'contador',
    timestamp: new Date(Date.now() - 1000 * 60 * 19),
    status: 'read',
    attachment: {
      name: 'tabela_codigos_servico.pdf',
      type: 'document',
      url: '#',
    },
  },
  {
    id: '6',
    text: 'Muito obrigado! Isso vai ajudar bastante.',
    sender: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    status: 'read',
  },
  {
    id: '7',
    text: 'Olá! Recebi seu documento. Vou analisar e retorno em breve.',
    sender: 'contador',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: 'delivered',
  },
];

const MensagensPage: React.FC = () => {
  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Done sx={{ fontSize: 14, color: 'text.secondary' }} />;
      case 'delivered':
        return <DoneAll sx={{ fontSize: 14, color: 'text.secondary' }} />;
      case 'read':
        return <DoneAll sx={{ fontSize: 14, color: 'primary.main' }} />;
      default:
        return null;
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image />;
      case 'document':
        return <Description />;
      default:
        return <InsertDriveFile />;
    }
  };

  const filteredConversations = mockConversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 100px)' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
          Mensagens
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Converse diretamente com sua equipe contábil.
        </Typography>
      </Box>

      {/* Chat Container */}
      <Card sx={{ height: 'calc(100% - 80px)', display: 'flex' }}>
        {/* Sidebar - Lista de Conversas */}
        <Box
          sx={{
            width: 320,
            borderRight: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Busca */}
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar conversa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Divider />

          {/* Lista de Conversas */}
          <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
            {filteredConversations.map((conversation) => (
              <ListItem
                key={conversation.id}
                component="div"
                onClick={() => setSelectedConversation(conversation)}
                sx={{
                  cursor: 'pointer',
                  bgcolor:
                    selectedConversation?.id === conversation.id
                      ? alpha(theme.palette.primary.main, 0.08)
                      : 'transparent',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                  py: 1.5,
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      conversation.online ? (
                        <Circle sx={{ fontSize: 12, color: 'success.main' }} />
                      ) : null
                    }
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        fontWeight: 600,
                      }}
                    >
                      {conversation.avatar}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {conversation.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(conversation.lastMessageTime)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{ maxWidth: 180 }}
                      >
                        {conversation.lastMessage}
                      </Typography>
                      {conversation.unreadCount > 0 && (
                        <Chip
                          label={conversation.unreadCount}
                          size="small"
                          color="primary"
                          sx={{ height: 20, minWidth: 20 }}
                        />
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Área de Chat */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedConversation ? (
            <>
              {/* Header do Chat */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      selectedConversation.online ? (
                        <Circle sx={{ fontSize: 12, color: 'success.main' }} />
                      ) : null
                    }
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        fontWeight: 600,
                      }}
                    >
                      {selectedConversation.avatar}
                    </Avatar>
                  </Badge>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {selectedConversation.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedConversation.role}
                      {selectedConversation.online && (
                        <Chip
                          label="Online"
                          size="small"
                          color="success"
                          sx={{ ml: 1, height: 18, fontSize: 10 }}
                        />
                      )}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <MoreVert />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={() => setAnchorEl(null)}>
                    <ListItemIcon>
                      <Search fontSize="small" />
                    </ListItemIcon>
                    Buscar na conversa
                  </MenuItem>
                  <MenuItem onClick={() => setAnchorEl(null)}>
                    <ListItemIcon>
                      <AttachFile fontSize="small" />
                    </ListItemIcon>
                    Ver arquivos
                  </MenuItem>
                </Menu>
              </Box>

              {/* Mensagens */}
              <Box
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  p: 2,
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                }}
              >
                {messages.map((message, index) => {
                  const isUser = message.sender === 'user';
                  const showDate =
                    index === 0 ||
                    new Date(messages[index - 1].timestamp).toDateString() !==
                      new Date(message.timestamp).toDateString();

                  return (
                    <React.Fragment key={message.id}>
                      {showDate && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                          <Chip
                            label={new Date(message.timestamp).toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                            })}
                            size="small"
                            sx={{ bgcolor: 'background.paper' }}
                          />
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: isUser ? 'flex-end' : 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            maxWidth: '70%',
                            bgcolor: isUser
                              ? 'primary.main'
                              : 'background.paper',
                            color: isUser ? 'primary.contrastText' : 'text.primary',
                            borderRadius: 2,
                            borderTopRightRadius: isUser ? 0 : 2,
                            borderTopLeftRadius: isUser ? 2 : 0,
                          }}
                        >
                          <Typography variant="body2">{message.text}</Typography>
                          
                          {message.attachment && (
                            <Paper
                              sx={{
                                mt: 1,
                                p: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: isUser
                                  ? alpha('#fff', 0.1)
                                  : alpha(theme.palette.primary.main, 0.05),
                                cursor: 'pointer',
                              }}
                            >
                              {getAttachmentIcon(message.attachment.type)}
                              <Typography variant="caption" noWrap>
                                {message.attachment.name}
                              </Typography>
                            </Paper>
                          )}

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                opacity: 0.7,
                                color: isUser ? 'inherit' : 'text.secondary',
                              }}
                            >
                              {message.timestamp.toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Typography>
                            {isUser && getStatusIcon(message.status)}
                          </Box>
                        </Paper>
                      </Box>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </Box>

              {/* Input de Mensagem */}
              <Box
                sx={{
                  p: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <Tooltip title="Anexar arquivo">
                    <IconButton color="primary">
                      <AttachFile />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Emoji">
                    <IconButton color="primary">
                      <EmojiEmotions />
                    </IconButton>
                  </Tooltip>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Tooltip title="Enviar">
                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                        '&.Mui-disabled': {
                          bgcolor: alpha(theme.palette.primary.main, 0.3),
                          color: 'primary.contrastText',
                        },
                      }}
                    >
                      <Send />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Selecione uma conversa
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Escolha um contato para iniciar uma conversa
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default MensagensPage;
