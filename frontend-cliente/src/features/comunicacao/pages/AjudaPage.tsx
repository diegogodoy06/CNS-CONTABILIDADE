import React, { useState, useMemo } from 'react';
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
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Breadcrumbs,
  Link,
  Drawer,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  ExpandMore,
  HelpOutline,
  Description,
  Receipt,
  AccountBalance,
  Calculate,

  Settings,
  PlayCircleOutline,
  MenuBook,
  QuestionAnswer,
  ContactSupport,
  Article,
  ArrowForward,
  Lightbulb,
  VideoLibrary,
  Close,
  ThumbUp,
  ThumbDown,
  AccessTime,
  Bookmark,
  BookmarkBorder,
  Home,
  ChevronRight,
  Menu as MenuIcon,
  Security,
  Person,
  Email,
  Phone,
  NewReleases,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// ============================================
// TIPOS
// ============================================

interface FAQItem {
  id: string;
  pergunta: string;
  resposta: string;
  categoria: string;
  tags: string[];
  visualizacoes: number;
  util: number;
  naoUtil: number;
  atualizado: string;
}

interface Tutorial {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  tipo: 'video' | 'artigo';
  duracao?: string;
  url: string;
  thumbnail?: string;
  visualizacoes: number;
  dataPublicacao: string;
  conteudo?: string;
}

interface Artigo {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  autor: string;
  dataPublicacao: string;
  dataAtualizacao: string;
  tempoLeitura: string;
  visualizacoes: number;
  tags: string[];
  relacionados: string[];
}

interface Categoria {
  id: string;
  label: string;
  icon: React.ReactElement;
  count: number;
  descricao: string;
}

// ============================================
// MOCK DATA
// ============================================

const faqItems: FAQItem[] = [
  {
    id: '1',
    pergunta: 'Como emitir uma nota fiscal de serviço?',
    resposta: `Para emitir uma nota fiscal de serviço (NFS-e), siga os passos abaixo:

**1. Acesse o módulo de Notas Fiscais**
- No menu lateral, clique em "Notas Fiscais"
- Clique no botão "Emitir Nota" no canto superior direito

**2. Selecione o Tomador**
- Busque pelo CNPJ ou nome do cliente
- Se o tomador não existir, você pode cadastrá-lo rapidamente

**3. Preencha os dados do serviço**
- Descrição do serviço prestado
- Valor total
- Código CNAE e tributação municipal

**4. Revise e emita**
- Confira todos os dados no preview
- Clique em "Emitir Nota"

A nota será transmitida automaticamente para a prefeitura e o PDF estará disponível em instantes.`,
    categoria: 'notas',
    tags: ['nota fiscal', 'emissão', 'NFS-e', 'serviço'],
    visualizacoes: 1250,
    util: 342,
    naoUtil: 12,
    atualizado: '2024-12-01',
  },
  {
    id: '2',
    pergunta: 'Qual o prazo para pagamento de impostos?',
    resposta: `Os prazos de pagamento variam conforme o tipo de imposto e regime tributário:

**MEI (Microempreendedor Individual)**
- DAS: dia 20 de cada mês

**Simples Nacional**
- DAS: último dia útil da primeira quinzena do mês seguinte

**Lucro Presumido/Real**
- PIS/COFINS: dia 25 do mês seguinte
- IRPJ/CSLL: último dia útil do mês seguinte ao trimestre

**ISS**
- Varia por município, geralmente entre dia 5 e 15 do mês seguinte

💡 **Dica:** Utilize nosso Calendário de Obrigações para não perder nenhum prazo!`,
    categoria: 'impostos',
    tags: ['impostos', 'prazo', 'vencimento', 'ISS', 'DAS', 'MEI'],
    visualizacoes: 2100,
    util: 567,
    naoUtil: 23,
    atualizado: '2024-11-28',
  },
  {
    id: '3',
    pergunta: 'Como faço upload de documentos?',
    resposta: `Enviar documentos é simples e seguro:

**Passo a passo:**
1. Acesse "Documentos" no menu lateral
2. Clique em "Upload" ou arraste arquivos para a área indicada
3. Selecione a categoria apropriada
4. Clique em "Enviar"

**Formatos aceitos:**
- PDF (até 25MB)
- Imagens: JPG, PNG, WEBP (até 10MB)
- Planilhas: XLS, XLSX (até 15MB)
- Documentos: DOC, DOCX (até 15MB)
- Compactados: ZIP, RAR (até 50MB)

**Recursos automáticos:**
- ✅ Verificação de vírus
- ✅ OCR para busca no conteúdo
- ✅ Compressão automática de imagens`,
    categoria: 'documentos',
    tags: ['upload', 'documentos', 'arquivos', 'enviar', 'PDF'],
    visualizacoes: 890,
    util: 234,
    naoUtil: 8,
    atualizado: '2024-12-05',
  },
  {
    id: '4',
    pergunta: 'Como cancelar uma nota fiscal?',
    resposta: `Para cancelar uma nota fiscal emitida:

**Requisitos:**
- A nota deve estar dentro do prazo legal de cancelamento
- Você precisa ter perfil de Administrador
- A nota não pode ter sido utilizada em declarações já entregues

**Passo a passo:**
1. Acesse "Notas Fiscais"
2. Localize a nota na listagem
3. Clique no menu (⋮) e selecione "Cancelar"
4. Informe o motivo do cancelamento
5. Confirme a operação

**⚠️ Atenção:**
- Cancelamentos são irreversíveis
- O prazo geralmente é de até 6 meses da emissão
- Consulte a legislação municipal para prazos específicos

Após o cancelamento, a nota aparecerá com status "Cancelada" e não terá mais validade fiscal.`,
    categoria: 'notas',
    tags: ['nota fiscal', 'cancelar', 'cancelamento', 'estorno'],
    visualizacoes: 670,
    util: 189,
    naoUtil: 15,
    atualizado: '2024-12-02',
  },
  {
    id: '5',
    pergunta: 'Onde vejo minhas guias de pagamento?',
    resposta: `Todas as suas guias estão centralizadas em um único lugar:

**Acessando as guias:**
1. Clique em "Guias" no menu lateral
2. Use os filtros para localizar guias específicas

**Filtros disponíveis:**
- Por tipo: DAS, ISS, IRPJ, PIS/COFINS, etc.
- Por status: Pendente, Pago, Vencido
- Por período de competência

**Ações disponíveis:**
- 📄 Visualizar detalhes
- ⬇️ Download do PDF/boleto
- 📋 Copiar código de barras
- ✅ Marcar como paga (com upload de comprovante)

💡 **Dica:** Ative as notificações para receber alertas de vencimento!`,
    categoria: 'guias',
    tags: ['guias', 'boleto', 'pagamento', 'DAS', 'ISS'],
    visualizacoes: 1450,
    util: 412,
    naoUtil: 9,
    atualizado: '2024-11-30',
  },
  {
    id: '6',
    pergunta: 'Como atualizar meus dados cadastrais?',
    resposta: `Você pode atualizar seus dados diretamente no sistema:

**Dados que você pode alterar:**
- Endereço comercial
- Telefone e e-mail de contato
- Logo da empresa
- Preferências do sistema

**Como fazer:**
1. Acesse "Configurações" no menu
2. Selecione a aba "Empresa"
3. Edite os campos desejados
4. Clique em "Salvar"

**⚠️ Dados que requerem solicitação:**
- Razão Social
- CNPJ
- Inscrição Municipal/Estadual
- Regime Tributário

Para alterações cadastrais junto aos órgãos governamentais, abra um ticket de suporte com os documentos necessários.`,
    categoria: 'configuracoes',
    tags: ['cadastro', 'dados', 'atualizar', 'configurações', 'empresa'],
    visualizacoes: 520,
    util: 145,
    naoUtil: 7,
    atualizado: '2024-12-03',
  },
  {
    id: '7',
    pergunta: 'O que fazer se esqueci minha senha?',
    resposta: `Recuperar sua senha é rápido e seguro:

**Passo a passo:**
1. Na tela de login, clique em "Esqueceu sua senha?"
2. Digite seu e-mail cadastrado
3. Clique em "Enviar link de recuperação"
4. Acesse seu e-mail e clique no link recebido
5. Defina uma nova senha

**Requisitos da nova senha:**
- Mínimo 8 caracteres
- Ao menos uma letra maiúscula
- Ao menos uma letra minúscula
- Ao menos um número
- Ao menos um caractere especial

**Não recebeu o e-mail?**
- Verifique a caixa de spam/lixo eletrônico
- Aguarde até 5 minutos
- Tente solicitar novamente
- Se persistir, entre em contato com o suporte`,
    categoria: 'acesso',
    tags: ['senha', 'recuperar', 'login', 'acesso', 'esqueci'],
    visualizacoes: 980,
    util: 289,
    naoUtil: 11,
    atualizado: '2024-12-01',
  },
  {
    id: '8',
    pergunta: 'Como consultar o histórico de faturamento?',
    resposta: `Acesse relatórios detalhados do seu faturamento:

**Onde encontrar:**
1. Acesse "Relatórios" no menu lateral
2. Selecione "Relatórios Fiscais" ou "Relatórios Gerenciais"

**Tipos de relatórios disponíveis:**
- **Livro de Serviços:** Todas as notas emitidas
- **Faturamento por período:** Totais mensais/anuais
- **Por tomador:** Ranking de clientes
- **Por serviço:** Tipos de serviço mais prestados

**Exportação:**
- 📊 Excel (.xlsx)
- 📄 PDF
- 📁 CSV

**Gráficos interativos:**
O dashboard apresenta visualizações gráficas com comparativos de períodos anteriores.`,
    categoria: 'relatorios',
    tags: ['faturamento', 'relatório', 'histórico', 'exportar'],
    visualizacoes: 720,
    util: 198,
    naoUtil: 6,
    atualizado: '2024-11-25',
  },
  {
    id: '9',
    pergunta: 'O certificado digital está vencendo. O que fazer?',
    resposta: `Siga estes passos para renovar seu certificado:

**Antes do vencimento:**
1. Procure uma Autoridade Certificadora (AC)
2. Solicite a renovação do certificado A1
3. Realize a validação presencial ou por videoconferência
4. Baixe o novo arquivo .pfx

**Após receber o novo certificado:**
1. Acesse "Configurações" > "Certificado Digital"
2. Clique em "Atualizar Certificado"
3. Selecione o arquivo .pfx
4. Digite a senha do certificado
5. Clique em "Salvar"

**⚠️ Importante:**
- Renove com antecedência (30 dias antes)
- Sem certificado válido, não é possível emitir notas
- O sistema envia alertas automáticos de vencimento

📅 Alertas são enviados: 30, 15, 7 e 1 dia antes do vencimento.`,
    categoria: 'certificado',
    tags: ['certificado digital', 'vencimento', 'renovar', 'A1', 'e-CNPJ'],
    visualizacoes: 650,
    util: 187,
    naoUtil: 4,
    atualizado: '2024-12-04',
  },
  {
    id: '10',
    pergunta: 'Como falar com meu contador?',
    resposta: `Você tem várias formas de contato:

**1. Central de Mensagens (recomendado)**
- Acesse "Mensagens" no menu
- Converse em tempo real com nossa equipe
- Histórico de todas as conversas

**2. Tickets de Suporte**
- Para assuntos que precisam de acompanhamento
- Defina prioridade e categoria
- Acompanhe o status da solicitação

**3. Telefone**
- (11) 3333-4444
- Segunda a Sexta, 9h às 18h

**4. E-mail**
- suporte@cnscontabil.com.br
- Resposta em até 24 horas úteis

**5. WhatsApp (em breve)**
- Atendimento rápido para dúvidas simples

💡 **Dica:** Antes de entrar em contato, verifique se sua dúvida não está respondida aqui no FAQ!`,
    categoria: 'suporte',
    tags: ['contador', 'contato', 'mensagem', 'suporte', 'telefone'],
    visualizacoes: 890,
    util: 256,
    naoUtil: 10,
    atualizado: '2024-12-06',
  },
];

const tutoriais: Tutorial[] = [
  {
    id: '1',
    titulo: 'Primeiros Passos no Sistema',
    descricao: 'Aprenda a navegar pelo sistema e conhecer as principais funcionalidades disponíveis para sua empresa.',
    categoria: 'inicio',
    tipo: 'video',
    duracao: '5:32',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    visualizacoes: 3420,
    dataPublicacao: '2024-10-15',
  },
  {
    id: '2',
    titulo: 'Emitindo sua Primeira Nota Fiscal',
    descricao: 'Tutorial completo sobre emissão de NFS-e. Aprenda cada etapa do processo de forma detalhada.',
    categoria: 'notas',
    tipo: 'video',
    duracao: '8:15',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    visualizacoes: 2890,
    dataPublicacao: '2024-10-20',
  },
  {
    id: '3',
    titulo: 'Gerenciando Documentos',
    descricao: 'Saiba como fazer upload, organizar por categorias e localizar seus documentos de forma eficiente.',
    categoria: 'documentos',
    tipo: 'artigo',
    url: '#',
    visualizacoes: 1560,
    dataPublicacao: '2024-11-01',
  },
  {
    id: '4',
    titulo: 'Entendendo suas Guias de Impostos',
    descricao: 'Aprenda a interpretar cada tipo de guia e a realizar pagamentos corretamente.',
    categoria: 'guias',
    tipo: 'artigo',
    url: '#',
    visualizacoes: 1890,
    dataPublicacao: '2024-11-05',
  },
  {
    id: '5',
    titulo: 'Configurando o Certificado Digital',
    descricao: 'Passo a passo para cadastrar e renovar seu certificado digital A1 no sistema.',
    categoria: 'certificado',
    tipo: 'video',
    duracao: '6:45',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    visualizacoes: 1120,
    dataPublicacao: '2024-11-10',
  },
  {
    id: '6',
    titulo: 'Gerando Relatórios Personalizados',
    descricao: 'Crie relatórios específicos para análise do seu negócio com filtros avançados.',
    categoria: 'relatorios',
    tipo: 'video',
    duracao: '7:20',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    visualizacoes: 980,
    dataPublicacao: '2024-11-15',
  },
  {
    id: '7',
    titulo: 'Cadastrando Tomadores de Serviço',
    descricao: 'Como cadastrar clientes (PJ e PF) e importar dados automaticamente da Receita Federal.',
    categoria: 'tomadores',
    tipo: 'video',
    duracao: '4:50',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    visualizacoes: 756,
    dataPublicacao: '2024-11-20',
  },
  {
    id: '8',
    titulo: 'Simulando Notas Fiscais',
    descricao: 'Aprenda a usar o simulador para calcular impostos antes de emitir a nota oficial.',
    categoria: 'notas',
    tipo: 'artigo',
    url: '#',
    visualizacoes: 890,
    dataPublicacao: '2024-11-25',
  },
];

const artigos: Artigo[] = [
  {
    id: '1',
    titulo: 'Novidades da Versão 2.5',
    resumo: 'Confira todas as melhorias e novas funcionalidades implementadas nesta atualização.',
    conteudo: 'Conteúdo detalhado...',
    categoria: 'atualizacoes',
    autor: 'Equipe CNS',
    dataPublicacao: '2024-12-01',
    dataAtualizacao: '2024-12-01',
    tempoLeitura: '3 min',
    visualizacoes: 1250,
    tags: ['atualização', 'versão', 'novidades'],
    relacionados: ['2', '3'],
  },
  {
    id: '2',
    titulo: 'Guia Completo: Simples Nacional',
    resumo: 'Tudo o que você precisa saber sobre o Simples Nacional para MEI, ME e EPP.',
    conteudo: 'Conteúdo detalhado sobre Simples Nacional...',
    categoria: 'fiscal',
    autor: 'Dra. Ana Costa',
    dataPublicacao: '2024-11-15',
    dataAtualizacao: '2024-11-20',
    tempoLeitura: '10 min',
    visualizacoes: 3420,
    tags: ['simples nacional', 'mei', 'impostos'],
    relacionados: ['3'],
  },
  {
    id: '3',
    titulo: 'Calendário Fiscal 2025',
    resumo: 'Datas importantes e prazos de entrega de obrigações acessórias para o próximo ano.',
    conteudo: 'Conteúdo do calendário fiscal...',
    categoria: 'fiscal',
    autor: 'Equipe CNS',
    dataPublicacao: '2024-12-10',
    dataAtualizacao: '2024-12-10',
    tempoLeitura: '5 min',
    visualizacoes: 2100,
    tags: ['calendário', 'obrigações', '2025'],
    relacionados: ['2'],
  },
];

const categorias: Categoria[] = [
  { id: 'todos', label: 'Todas as categorias', icon: <HelpOutline />, count: faqItems.length, descricao: 'Todas as perguntas e tutoriais' },
  { id: 'notas', label: 'Notas Fiscais', icon: <Receipt />, count: faqItems.filter(f => f.categoria === 'notas').length, descricao: 'Emissão, cancelamento e consulta' },
  { id: 'impostos', label: 'Impostos e Tributos', icon: <Calculate />, count: faqItems.filter(f => f.categoria === 'impostos').length, descricao: 'Prazos, cálculos e regimes' },
  { id: 'guias', label: 'Guias de Pagamento', icon: <AccountBalance />, count: faqItems.filter(f => f.categoria === 'guias').length, descricao: 'DAS, ISS, IRPJ e outros' },
  { id: 'documentos', label: 'Documentos', icon: <Description />, count: faqItems.filter(f => f.categoria === 'documentos').length, descricao: 'Upload, organização e busca' },
  { id: 'configuracoes', label: 'Configurações', icon: <Settings />, count: faqItems.filter(f => f.categoria === 'configuracoes').length, descricao: 'Dados cadastrais e preferências' },
  { id: 'certificado', label: 'Certificado Digital', icon: <Security />, count: faqItems.filter(f => f.categoria === 'certificado').length, descricao: 'Instalação e renovação' },
  { id: 'acesso', label: 'Acesso e Segurança', icon: <Person />, count: faqItems.filter(f => f.categoria === 'acesso').length, descricao: 'Login, senha e dispositivos' },
];

// ============================================
// COMPONENTES AUXILIARES
// ============================================

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ paddingTop: 16 }}>
    {value === index && children}
  </div>
);

// Dialog de Vídeo
interface VideoDialogProps {
  open: boolean;
  onClose: () => void;
  tutorial: Tutorial | null;
}

const VideoDialog: React.FC<VideoDialogProps> = ({ open, onClose, tutorial }) => {
  if (!tutorial) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="span">
          {tutorial.titulo}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%',
            bgcolor: 'black',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            src={tutorial.url}
            title={tutorial.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {tutorial.descricao}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Chip icon={<AccessTime />} label={tutorial.duracao} size="small" />
          <Chip label={`${tutorial.visualizacoes.toLocaleString()} visualizações`} size="small" variant="outlined" />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const AjudaPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todos');
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);
  const [videoDialog, setVideoDialog] = useState<Tutorial | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<string[]>([]);

  // Busca inteligente
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return { faq: [], tutoriais: [], artigos: [] };

    const term = searchTerm.toLowerCase();

    const faq = faqItems.filter(
      item =>
        item.pergunta.toLowerCase().includes(term) ||
        item.resposta.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term))
    );

    const tuts = tutoriais.filter(
      item =>
        item.titulo.toLowerCase().includes(term) ||
        item.descricao.toLowerCase().includes(term)
    );

    const arts = artigos.filter(
      item =>
        item.titulo.toLowerCase().includes(term) ||
        item.resumo.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term))
    );

    return { faq, tutoriais: tuts, artigos: arts };
  }, [searchTerm]);

  const hasSearchResults = searchTerm.trim() && (
    searchResults.faq.length > 0 ||
    searchResults.tutoriais.length > 0 ||
    searchResults.artigos.length > 0
  );

  // Filtrar por categoria
  const filteredFaq = useMemo(() => {
    return faqItems.filter(item => {
      const matchesCategoria = selectedCategoria === 'todos' || item.categoria === selectedCategoria;
      return matchesCategoria;
    });
  }, [selectedCategoria]);

  const filteredTutoriais = useMemo(() => {
    return tutoriais.filter(item => {
      const matchesCategoria = selectedCategoria === 'todos' || item.categoria === selectedCategoria;
      return matchesCategoria;
    });
  }, [selectedCategoria]);

  // Handlers
  const toggleSaved = (id: string) => {
    setSavedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Sidebar content
  const sidebarContent = (
    <Box sx={{ width: 280, p: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, px: 1 }}>
        CATEGORIAS
      </Typography>
      <List disablePadding>
        {categorias.map((cat) => (
          <ListItemButton
            key={cat.id}
            selected={selectedCategoria === cat.id}
            onClick={() => {
              setSelectedCategoria(cat.id);
              setSidebarOpen(false);
            }}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {cat.icon}
            </ListItemIcon>
            <ListItemText
              primary={cat.label}
              secondary={cat.descricao}
              primaryTypographyProps={{ variant: 'body2', fontWeight: selectedCategoria === cat.id ? 600 : 400 }}
              secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
            />
            <Chip label={cat.count} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, px: 1 }}>
        CONTATO RÁPIDO
      </Typography>
      <List disablePadding>
        <ListItemButton onClick={() => navigate('/mensagens')} sx={{ borderRadius: 2, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Email color="primary" />
          </ListItemIcon>
          <ListItemText primary="Mensagens" primaryTypographyProps={{ variant: 'body2' }} />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/tickets')} sx={{ borderRadius: 2, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <ContactSupport color="primary" />
          </ListItemIcon>
          <ListItemText primary="Abrir Ticket" primaryTypographyProps={{ variant: 'body2' }} />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 2, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Phone color="primary" />
          </ListItemIcon>
          <ListItemText primary="(11) 3333-4444" primaryTypographyProps={{ variant: 'body2' }} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100%' }}>
      {/* Sidebar Desktop */}
      {!isMobile && (
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            position: 'sticky',
            top: 0,
            height: 'calc(100vh - 64px)',
            overflowY: 'auto',
          }}
        >
          {sidebarContent}
        </Box>
      )}

      {/* Sidebar Mobile */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          {isMobile && (
            <IconButton onClick={() => setSidebarOpen(true)} sx={{ mr: 1, mb: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          
          <Breadcrumbs separator={<ChevronRight fontSize="small" />} sx={{ mb: 2 }}>
            <Link
              color="inherit"
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Home fontSize="small" sx={{ mr: 0.5 }} />
              Início
            </Link>
            <Typography color="text.primary">Central de Ajuda</Typography>
          </Breadcrumbs>

          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            Central de Ajuda
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Encontre respostas, tutoriais e guias para usar o sistema
          </Typography>
        </Box>

        {/* Busca Global */}
        <Paper
          elevation={0}
          sx={{
            p: 0.5,
            mb: 4,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            borderRadius: 3,
          }}
        >
          <TextField
            fullWidth
            placeholder="Pesquisar em FAQ, tutoriais e artigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <Close fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
                borderRadius: 2.5,
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'primary.light' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
          />
        </Paper>

        {/* Resultados da Busca */}
        {hasSearchResults && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Resultados para "{searchTerm}"
            </Typography>
            
            {searchResults.faq.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  FAQ ({searchResults.faq.length})
                </Typography>
                {searchResults.faq.slice(0, 3).map((item) => (
                  <Accordion
                    key={item.id}
                    expanded={expandedFaq === item.id}
                    onChange={(_, expanded) => setExpandedFaq(expanded ? item.id : false)}
                    sx={{ mb: 1 }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography fontWeight={500}>{item.pergunta}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ whiteSpace: 'pre-line' }}
                      >
                        {item.resposta}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}

            {searchResults.tutoriais.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Tutoriais ({searchResults.tutoriais.length})
                </Typography>
                <Grid container spacing={2}>
                  {searchResults.tutoriais.slice(0, 2).map((tutorial) => (
                    <Grid item xs={12} sm={6} key={tutorial.id}>
                      <Card
                        sx={{ cursor: 'pointer' }}
                        onClick={() => tutorial.tipo === 'video' && setVideoDialog(tutorial)}
                      >
                        <CardContent sx={{ display: 'flex', gap: 2 }}>
                          <Avatar sx={{ bgcolor: tutorial.tipo === 'video' ? 'error.main' : 'primary.main' }}>
                            {tutorial.tipo === 'video' ? <PlayCircleOutline /> : <Article />}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{tutorial.titulo}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {tutorial.tipo === 'video' ? tutorial.duracao : 'Artigo'}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />
          </Box>
        )}

        {/* Quick Links - Apenas quando não está buscando */}
        {!searchTerm && (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6} sm={3}>
              <Paper
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                }}
                onClick={() => { setActiveTab(0); setSelectedCategoria('notas'); }}
              >
                <Receipt sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="subtitle2">Notas Fiscais</Typography>
                <Typography variant="caption" color="text.secondary">
                  Emissão e cancelamento
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                }}
                onClick={() => { setActiveTab(0); setSelectedCategoria('guias'); }}
              >
                <AccountBalance sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="subtitle2">Guias e Impostos</Typography>
                <Typography variant="caption" color="text.secondary">
                  Pagamentos e prazos
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                }}
                onClick={() => setActiveTab(1)}
              >
                <VideoLibrary sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                <Typography variant="subtitle2">Tutoriais em Vídeo</Typography>
                <Typography variant="caption" color="text.secondary">
                  Aprenda assistindo
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                }}
                onClick={() => navigate('/tickets')}
              >
                <ContactSupport sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="subtitle2">Falar com Suporte</Typography>
                <Typography variant="caption" color="text.secondary">
                  Abra um ticket
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Tabs de Conteúdo */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
              <Tab
                label="Perguntas Frequentes"
                icon={<QuestionAnswer />}
                iconPosition="start"
              />
              <Tab
                label="Tutoriais"
                icon={<VideoLibrary />}
                iconPosition="start"
              />
              <Tab
                label="Artigos"
                icon={<Article />}
                iconPosition="start"
              />
            </Tabs>

            {/* Tab: FAQ */}
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`${filteredFaq.length} perguntas`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                {selectedCategoria !== 'todos' && (
                  <Chip
                    label={categorias.find(c => c.id === selectedCategoria)?.label}
                    size="small"
                    onDelete={() => setSelectedCategoria('todos')}
                  />
                )}
              </Box>

              {filteredFaq.map((item) => (
                <Accordion
                  key={item.id}
                  expanded={expandedFaq === item.id}
                  onChange={(_, expanded) => setExpandedFaq(expanded ? item.id : false)}
                  sx={{
                    mb: 1,
                    '&:before': { display: 'none' },
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '8px !important',
                    '&.Mui-expanded': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      '&.Mui-expanded': {
                        minHeight: 56,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 2 }}>
                      <HelpOutline color="primary" sx={{ flexShrink: 0 }} />
                      <Typography fontWeight={500} sx={{ flex: 1 }}>
                        {item.pergunta}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaved(`faq-${item.id}`);
                        }}
                      >
                        {savedItems.includes(`faq-${item.id}`) ? (
                          <Bookmark color="primary" fontSize="small" />
                        ) : (
                          <BookmarkBorder fontSize="small" />
                        )}
                      </IconButton>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        whiteSpace: 'pre-line',
                        '& strong': { color: 'text.primary' },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: item.resposta.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {item.tags.slice(0, 3).map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ height: 24 }} />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Esta resposta foi útil?
                        </Typography>
                        <IconButton size="small" color="success">
                          <ThumbUp fontSize="small" />
                        </IconButton>
                        <Typography variant="caption" color="text.secondary">
                          {item.util}
                        </Typography>
                        <IconButton size="small" color="error">
                          <ThumbDown fontSize="small" />
                        </IconButton>
                        <Typography variant="caption" color="text.secondary">
                          {item.naoUtil}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </TabPanel>

            {/* Tab: Tutoriais */}
            <TabPanel value={activeTab} index={1}>
              <Grid container spacing={3}>
                {filteredTutoriais.map((tutorial) => (
                  <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
                    <Card
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => tutorial.tipo === 'video' && setVideoDialog(tutorial)}
                    >
                      {/* Thumbnail */}
                      <Box
                        sx={{
                          position: 'relative',
                          height: 160,
                          bgcolor: tutorial.tipo === 'video' ? 'grey.900' : alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {tutorial.tipo === 'video' ? (
                          <>
                            <PlayCircleOutline sx={{ fontSize: 64, color: 'white' }} />
                            {tutorial.duracao && (
                              <Chip
                                label={tutorial.duracao}
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  bottom: 8,
                                  right: 8,
                                  bgcolor: 'rgba(0,0,0,0.7)',
                                  color: 'white',
                                }}
                              />
                            )}
                          </>
                        ) : (
                          <Article sx={{ fontSize: 64, color: 'primary.main' }} />
                        )}
                      </Box>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            label={tutorial.tipo === 'video' ? 'Vídeo' : 'Artigo'}
                            size="small"
                            color={tutorial.tipo === 'video' ? 'error' : 'primary'}
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {tutorial.visualizacoes.toLocaleString()} visualizações
                          </Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          {tutorial.titulo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tutorial.descricao}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Tab: Artigos */}
            <TabPanel value={activeTab} index={2}>
              <Grid container spacing={3}>
                {artigos.map((artigo) => (
                  <Grid item xs={12} key={artigo.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { boxShadow: 3 },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              bgcolor:
                                artigo.categoria === 'atualizacoes'
                                  ? 'success.main'
                                  : 'primary.main',
                            }}
                          >
                            {artigo.categoria === 'atualizacoes' ? <NewReleases /> : <MenuBook />}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              {artigo.categoria === 'atualizacoes' && (
                                <Chip label="Novidade" size="small" color="success" />
                              )}
                              <Chip
                                icon={<AccessTime />}
                                label={artigo.tempoLeitura}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {artigo.titulo}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {artigo.resumo}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                Por {artigo.autor} • {artigo.dataPublicacao}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {artigo.visualizacoes.toLocaleString()} visualizações
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton>
                            <ArrowForward />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          </CardContent>
        </Card>

        {/* CTA - Não encontrou? */}
        <Paper
          sx={{
            mt: 4,
            p: 4,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
            borderRadius: 3,
          }}
        >
          <Lightbulb sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Não encontrou o que procurava?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
            Nossa equipe está pronta para ajudar. Entre em contato através de um dos canais abaixo.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<ContactSupport />}
              onClick={() => navigate('/tickets')}
            >
              Abrir Ticket
            </Button>
            <Button
              variant="outlined"
              startIcon={<Email />}
              onClick={() => navigate('/mensagens')}
            >
              Enviar Mensagem
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Video Dialog */}
      <VideoDialog
        open={!!videoDialog}
        onClose={() => setVideoDialog(null)}
        tutorial={videoDialog}
      />
    </Box>
  );
};

export default AjudaPage;
