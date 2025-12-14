import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Chip,
  alpha,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Description,
  PictureAsPdf,
  TableChart,
  Image,
  InsertDriveFile,
  Download,
  Visibility,
  CloudUpload,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface DocumentoRecente {
  id: string;
  nome: string;
  tipo: 'pdf' | 'xlsx' | 'image' | 'xml' | 'outros';
  categoria: 'fiscal' | 'contabil' | 'trabalhista' | 'outros';
  tamanho: string;
  dataUpload: string;
  status: 'disponivel' | 'processando' | 'pendente';
}

interface DocumentosRecentesWidgetProps {
  documentos?: DocumentoRecente[];
  onDownload?: (id: string) => void;
  onVisualizar?: (id: string) => void;
  limite?: number;
}

const documentosMock: DocumentoRecente[] = [
  {
    id: '1',
    nome: 'Balanço Patrimonial - Nov/2024',
    tipo: 'pdf',
    categoria: 'contabil',
    tamanho: '245 KB',
    dataUpload: '2024-12-10T10:30:00',
    status: 'disponivel',
  },
  {
    id: '2',
    nome: 'DRE - Nov/2024',
    tipo: 'xlsx',
    categoria: 'contabil',
    tamanho: '128 KB',
    dataUpload: '2024-12-10T10:25:00',
    status: 'disponivel',
  },
  {
    id: '3',
    nome: 'Folha de Pagamento - Nov/2024',
    tipo: 'pdf',
    categoria: 'trabalhista',
    tamanho: '512 KB',
    dataUpload: '2024-12-09T15:00:00',
    status: 'disponivel',
  },
  {
    id: '4',
    nome: 'Guias DAS - Dez/2024',
    tipo: 'pdf',
    categoria: 'fiscal',
    tamanho: '89 KB',
    dataUpload: '2024-12-08T09:00:00',
    status: 'processando',
  },
  {
    id: '5',
    nome: 'Certificado Digital',
    tipo: 'outros',
    categoria: 'outros',
    tamanho: '12 KB',
    dataUpload: '2024-12-05T14:20:00',
    status: 'disponivel',
  },
];

const DocumentosRecentesWidget: React.FC<DocumentosRecentesWidgetProps> = ({
  documentos = documentosMock,
  onDownload,
  onVisualizar,
  limite = 4,
}) => {
  const theme = useTheme();

  const getIconByTipo = (tipo: DocumentoRecente['tipo']) => {
    switch (tipo) {
      case 'pdf':
        return <PictureAsPdf />;
      case 'xlsx':
        return <TableChart />;
      case 'image':
        return <Image />;
      case 'xml':
        return <Description />;
      default:
        return <InsertDriveFile />;
    }
  };

  const getColorByTipo = (tipo: DocumentoRecente['tipo']) => {
    switch (tipo) {
      case 'pdf':
        return theme.palette.error.main;
      case 'xlsx':
        return theme.palette.success.main;
      case 'image':
        return theme.palette.info.main;
      case 'xml':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getCategoriaLabel = (categoria: DocumentoRecente['categoria']) => {
    switch (categoria) {
      case 'fiscal':
        return 'Fiscal';
      case 'contabil':
        return 'Contábil';
      case 'trabalhista':
        return 'Trabalhista';
      default:
        return 'Outros';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMM", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudUpload color="action" fontSize="small" />
          <Typography variant="subtitle2" color="text.secondary">
            Documentos Recentes
          </Typography>
        </Box>
        <Typography
          variant="caption"
          color="primary"
          sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          Ver todos →
        </Typography>
      </Box>

      <List disablePadding>
        {documentos.slice(0, limite).map((doc) => (
          <ListItem
            key={doc.id}
            sx={{
              px: 1,
              py: 0.75,
              mb: 0.5,
              borderRadius: 1,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
            secondaryAction={
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {doc.status === 'disponivel' && (
                  <>
                    <Tooltip title="Visualizar">
                      <IconButton
                        size="small"
                        onClick={() => onVisualizar?.(doc.id)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton
                        size="small"
                        onClick={() => onDownload?.(doc.id)}
                      >
                        <Download fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            }
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: getColorByTipo(doc.tipo),
              }}
            >
              {getIconByTipo(doc.tipo)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 180,
                  }}
                >
                  {doc.nome}
                </Typography>
              }
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                  <Chip
                    label={getCategoriaLabel(doc.categoria)}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  />
                  <Typography variant="caption" color="text.disabled">
                    {doc.tamanho}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    •
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {formatDate(doc.dataUpload)}
                  </Typography>
                  {doc.status === 'processando' && (
                    <Chip
                      label="Processando"
                      size="small"
                      color="warning"
                      sx={{ height: 18, fontSize: '0.6rem' }}
                    />
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DocumentosRecentesWidget;
