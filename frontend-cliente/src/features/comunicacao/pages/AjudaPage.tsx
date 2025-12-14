import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Paper,
  Button,
  useTheme,
  alpha,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  ExpandMore,
  HelpOutline,
  Description,
  Receipt,
  AccountBalance,
  Calculate,
  Upload,
  Settings,
  PlayCircleOutline,
  MenuBook,
  QuestionAnswer,
  ContactSupport,
  Article,
  ArrowForward,
  Lightbulb,
  VideoLibrary,
} from '@mui/icons-material';

// Tipos
interface FAQItem {
  id: string;
  pergunta: string;
  resposta: string;
  categoria: string;
  tags: string[];
}

interface Tutorial {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  tipo: 'video' | 'artigo';
  duracao?: string;
  url: string;
}

// FAQ Mock Data
const faqItems: FAQItem[] = [
  {
    id: '1',
    pergunta: 'Como emitir uma nota fiscal de serviço?',
    resposta: 'Para emitir uma nota fiscal, acesse o menu "Notas Fiscais" > "Emitir Nota". Preencha os dados do tomador, serviço prestado e valores. Revise as informações e clique em "Emitir Nota". A nota será processada e você receberá a confirmação em instantes.',
    categoria: 'notas',
    tags: ['nota fiscal', 'emissão', 'NFS-e'],
  },
  {
    id: '2',
    pergunta: 'Qual o prazo para pagamento de impostos?',
    resposta: 'Os prazos variam conforme o imposto: ISS geralmente vence até o dia 10 do mês seguinte. O DAS do MEI vence no dia 20. Impostos federais como IRPJ e CSLL têm vencimentos específicos conforme o regime tributário. Consulte nosso calendário de obrigações para ver todas as datas.',
    categoria: 'impostos',
    tags: ['impostos', 'prazo', 'vencimento', 'ISS', 'DAS'],
  },
  {
    id: '3',
    pergunta: 'Como faço upload de documentos?',
    resposta: 'Acesse a área "Documentos" no menu lateral. Clique em "Upload" ou arraste os arquivos para a área indicada. Aceitos: PDF, JPG, PNG até 10MB. Organize por categorias para facilitar a localização. Documentos importantes como contratos e comprovantes ficam armazenados com segurança.',
    categoria: 'documentos',
    tags: ['upload', 'documentos', 'arquivos', 'enviar'],
  },
  {
    id: '4',
    pergunta: 'Como cancelar uma nota fiscal?',
    resposta: 'Para cancelar uma nota: 1) Acesse "Notas Fiscais"; 2) Localize a nota desejada; 3) Clique nos três pontos e selecione "Cancelar"; 4) Informe o motivo do cancelamento. Atenção: notas só podem ser canceladas dentro do prazo legal (geralmente até 6 meses) e antes do fechamento do período fiscal.',
    categoria: 'notas',
    tags: ['nota fiscal', 'cancelar', 'cancelamento'],
  },
  {
    id: '5',
    pergunta: 'Onde vejo minhas guias de pagamento?',
    resposta: 'Todas as guias geradas estão disponíveis em "Guias" no menu principal. Lá você pode filtrar por tipo (ISS, IRPJ, DAS, etc.), status (pendente, pago, vencido) e período. Clique na guia para visualizar detalhes ou fazer o download do boleto/código de barras.',
    categoria: 'guias',
    tags: ['guias', 'boleto', 'pagamento'],
  },
  {
    id: '6',
    pergunta: 'Como atualizar meus dados cadastrais?',
    resposta: 'Acesse "Configurações" > "Dados da Empresa". Você pode editar informações como endereço, telefone e e-mail. Alterações em dados fiscais (CNPJ, Razão Social) devem ser solicitadas diretamente ao escritório através de um ticket.',
    categoria: 'configuracoes',
    tags: ['cadastro', 'dados', 'atualizar', 'configurações'],
  },
  {
    id: '7',
    pergunta: 'O que fazer se esqueci minha senha?',
    resposta: 'Na tela de login, clique em "Esqueceu sua senha?". Digite seu e-mail cadastrado e você receberá um link para redefinir a senha. O link é válido por 24 horas. Se não receber o e-mail, verifique a caixa de spam ou entre em contato com o suporte.',
    categoria: 'acesso',
    tags: ['senha', 'recuperar', 'login', 'acesso'],
  },
  {
    id: '8',
    pergunta: 'Como consultar o histórico de faturamento?',
    resposta: 'Acesse "Relatórios" e selecione "Faturamento". Você pode filtrar por período, cliente ou tipo de serviço. O relatório mostra valores emitidos, recebidos e em aberto. Exporte para Excel ou PDF para análises mais detalhadas.',
    categoria: 'relatorios',
    tags: ['faturamento', 'relatório', 'histórico'],
  },
  {
    id: '9',
    pergunta: 'O certificado digital está vencendo. O que fazer?',
    resposta: 'Renove seu certificado digital com antecedência junto a uma Autoridade Certificadora. Após renovação, acesse "Configurações" > "Certificado Digital" para fazer upload do novo arquivo e atualizar a senha. Sem certificado válido, não é possível emitir notas fiscais.',
    categoria: 'certificado',
    tags: ['certificado digital', 'vencimento', 'renovar'],
  },
  {
    id: '10',
    pergunta: 'Como falar com meu contador?',
    resposta: 'Use a "Central de Mensagens" para conversar diretamente com nossa equipe. Para assuntos mais complexos, abra um "Ticket de Suporte" com todos os detalhes. Você também pode ligar para nosso escritório em horário comercial.',
    categoria: 'suporte',
    tags: ['contador', 'contato', 'mensagem', 'suporte'],
  },
];

// Tutoriais Mock Data
const tutoriais: Tutorial[] = [
  {
    id: '1',
    titulo: 'Primeiros Passos no Sistema',
    descricao: 'Aprenda a navegar pelo sistema e conhecer as principais funcionalidades.',
    categoria: 'inicio',
    tipo: 'video',
    duracao: '5 min',
    url: '#',
  },
  {
    id: '2',
    titulo: 'Emitindo sua Primeira Nota Fiscal',
    descricao: 'Tutorial completo sobre emissão de NFS-e passo a passo.',
    categoria: 'notas',
    tipo: 'video',
    duracao: '8 min',
    url: '#',
  },
  {
    id: '3',
    titulo: 'Gerenciando Documentos',
    descricao: 'Como fazer upload, organizar e localizar seus documentos.',
    categoria: 'documentos',
    tipo: 'artigo',
    url: '#',
  },
  {
    id: '4',
    titulo: 'Entendendo suas Guias de Impostos',
    descricao: 'Saiba interpretar e pagar suas guias corretamente.',
    categoria: 'guias',
    tipo: 'artigo',
    url: '#',
  },
  {
    id: '5',
    titulo: 'Configurando o Certificado Digital',
    descricao: 'Como cadastrar e renovar seu certificado digital A1.',
    categoria: 'certificado',
    tipo: 'video',
    duracao: '6 min',
    url: '#',
  },
  {
    id: '6',
    titulo: 'Gerando Relatórios Personalizados',
    descricao: 'Crie relatórios específicos para análise do seu negócio.',
    categoria: 'relatorios',
    tipo: 'artigo',
    url: '#',
  },
];

const categorias = [
  { id: 'todos', label: 'Todas', icon: <HelpOutline /> },
  { id: 'notas', label: 'Notas Fiscais', icon: <Receipt /> },
  { id: 'impostos', label: 'Impostos', icon: <Calculate /> },
  { id: 'guias', label: 'Guias', icon: <AccountBalance /> },
  { id: 'documentos', label: 'Documentos', icon: <Description /> },
  { id: 'configuracoes', label: 'Configurações', icon: <Settings /> },
  { id: 'certificado', label: 'Certificado Digital', icon: <Upload /> },
];

const AjudaPage: React.FC = () => {
  const theme = useTheme();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todos');
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);

  const filteredFaq = faqItems.filter((item) => {
    const matchesSearch = 
      item.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.resposta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategoria = selectedCategoria === 'todos' || item.categoria === selectedCategoria;
    return matchesSearch && matchesCategoria;
  });

  const filteredTutoriais = tutoriais.filter((item) => {
    const matchesSearch = 
      item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = selectedCategoria === 'todos' || item.categoria === selectedCategoria;
    return matchesSearch && matchesCategoria;
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
          Central de Ajuda
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Encontre respostas para suas dúvidas, tutoriais e guias de uso do sistema.
        </Typography>
      </Box>

      {/* Busca */}
      <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
        <TextField
          fullWidth
          placeholder="O que você está procurando?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'background.paper',
            },
          }}
        />
      </Box>

      {/* Quick Links */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Paper
            sx={{
              p: 2,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
            }}
            onClick={() => {
              setActiveTab(0);
              setSelectedCategoria('notas');
            }}
          >
            <Receipt sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="subtitle2">Notas Fiscais</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper
            sx={{
              p: 2,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
            }}
            onClick={() => {
              setActiveTab(0);
              setSelectedCategoria('impostos');
            }}
          >
            <Calculate sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="subtitle2">Impostos</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper
            sx={{
              p: 2,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
            }}
            onClick={() => {
              setActiveTab(0);
              setSelectedCategoria('guias');
            }}
          >
            <AccountBalance sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="subtitle2">Guias</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper
            sx={{
              p: 2,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
            }}
            onClick={() => {
              setActiveTab(1);
              setSelectedCategoria('todos');
            }}
          >
            <VideoLibrary sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="subtitle2">Tutoriais</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Sidebar Categorias */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Categorias
              </Typography>
              <List dense disablePadding>
                {categorias.map((cat) => (
                  <ListItemButton
                    key={cat.id}
                    selected={selectedCategoria === cat.id}
                    onClick={() => setSelectedCategoria(cat.id)}
                    sx={{ borderRadius: 1, mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {cat.icon}
                    </ListItemIcon>
                    <ListItemText primary={cat.label} />
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Precisa de mais ajuda?
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ContactSupport />}
                sx={{ mb: 1 }}
                href="/tickets"
              >
                Abrir Ticket
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<QuestionAnswer />}
                href="/mensagens"
              >
                Chat com Suporte
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Conteúdo */}
        <Grid item xs={12} md={9}>
          <Card>
            <CardContent>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                sx={{ mb: 3 }}
              >
                <Tab 
                  icon={<QuestionAnswer />} 
                  iconPosition="start" 
                  label="Perguntas Frequentes" 
                />
                <Tab 
                  icon={<MenuBook />} 
                  iconPosition="start" 
                  label="Tutoriais" 
                />
              </Tabs>

              {/* FAQ */}
              {activeTab === 0 && (
                <Box>
                  {filteredFaq.length > 0 ? (
                    filteredFaq.map((item) => (
                      <Accordion
                        key={item.id}
                        expanded={expandedFaq === item.id}
                        onChange={(_, expanded) => setExpandedFaq(expanded ? item.id : false)}
                        sx={{
                          '&:before': { display: 'none' },
                          mb: 1,
                          boxShadow: 'none',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: '8px !important',
                          overflow: 'hidden',
                        }}
                      >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Lightbulb sx={{ color: 'warning.main', fontSize: 20 }} />
                            <Typography fontWeight={500}>{item.pergunta}</Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {item.resposta}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {item.tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: 11 }}
                              />
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <HelpOutline sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography color="text.secondary">
                        Nenhuma pergunta encontrada para sua busca.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Tutoriais */}
              {activeTab === 1 && (
                <Grid container spacing={2}>
                  {filteredTutoriais.length > 0 ? (
                    filteredTutoriais.map((tutorial) => (
                      <Grid item xs={12} sm={6} key={tutorial.id}>
                        <Paper
                          sx={{
                            p: 2,
                            height: '100%',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': {
                              borderColor: 'primary.main',
                              boxShadow: 2,
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: tutorial.tipo === 'video' 
                                  ? alpha(theme.palette.error.main, 0.1)
                                  : alpha(theme.palette.info.main, 0.1),
                              }}
                            >
                              {tutorial.tipo === 'video' ? (
                                <PlayCircleOutline sx={{ color: 'error.main' }} />
                              ) : (
                                <Article sx={{ color: 'info.main' }} />
                              )}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {tutorial.titulo}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {tutorial.descricao}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  label={tutorial.tipo === 'video' ? 'Vídeo' : 'Artigo'}
                                  size="small"
                                  color={tutorial.tipo === 'video' ? 'error' : 'info'}
                                  variant="outlined"
                                />
                                {tutorial.duracao && (
                                  <Typography variant="caption" color="text.secondary">
                                    {tutorial.duracao}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                            <ArrowForward color="action" />
                          </Box>
                        </Paper>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <MenuBook sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                        <Typography color="text.secondary">
                          Nenhum tutorial encontrado para sua busca.
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AjudaPage;
