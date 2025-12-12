import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  Search,
  FilterList,
  Upload,
  Download,
  Delete,
  MoreVert,
  Visibility,
  Share,
  PictureAsPdf,
  TableChart,
  Image as ImageIcon,
  InsertDriveFile,
  CloudUpload,
  Close,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Document as DocType, DocumentCategory } from '../../../types';

// Mock data
const mockDocuments: DocType[] = [
  {
    id: '1',
    nome: 'Contrato_Social_Consolidado.pdf',
    categoria: 'juridico',
    dataUpload: '2024-12-10T10:30:00',
    dataReferencia: '2024-01-15',
    tamanho: 2457600, // 2.4 MB
    formato: 'pdf',
    url: '/documents/1',
    uploadedBy: 'João Silva',
    visualizado: true,
    compartilhadoContador: true,
    privado: false,
    versao: 2,
  },
  {
    id: '2',
    nome: 'Balanço_Patrimonial_2024.xlsx',
    categoria: 'contabil',
    dataUpload: '2024-12-08T14:20:00',
    competencia: '2024',
    tamanho: 1126400, // 1.1 MB
    formato: 'xlsx',
    url: '/documents/2',
    uploadedBy: 'Contador',
    visualizado: false,
    compartilhadoContador: true,
    privado: false,
    versao: 1,
  },
  {
    id: '3',
    nome: 'DAS_Novembro_2024.pdf',
    categoria: 'fiscal',
    dataUpload: '2024-12-05T09:15:00',
    competencia: '11/2024',
    tamanho: 512000, // 500 KB
    formato: 'pdf',
    url: '/documents/3',
    uploadedBy: 'Contador',
    visualizado: false,
    compartilhadoContador: true,
    privado: false,
    versao: 1,
  },
  {
    id: '4',
    nome: 'Folha_Pagamento_Nov2024.pdf',
    categoria: 'trabalhista',
    dataUpload: '2024-12-03T16:45:00',
    competencia: '11/2024',
    tamanho: 3276800, // 3.2 MB
    formato: 'pdf',
    url: '/documents/4',
    uploadedBy: 'Contador',
    visualizado: true,
    compartilhadoContador: true,
    privado: false,
    versao: 1,
  },
  {
    id: '5',
    nome: 'Certidão_Negativa_Federal.pdf',
    categoria: 'operacional',
    dataUpload: '2024-12-01T11:30:00',
    tamanho: 256000, // 250 KB
    formato: 'pdf',
    url: '/documents/5',
    uploadedBy: 'João Silva',
    visualizado: true,
    compartilhadoContador: false,
    privado: false,
    versao: 1,
  },
];

const categoryConfig: Record<DocumentCategory, { label: string; color: string }> = {
  fiscal: { label: 'Fiscal', color: '#3b82f6' },
  contabil: { label: 'Contábil', color: '#10b981' },
  trabalhista: { label: 'Trabalhista', color: '#8b5cf6' },
  juridico: { label: 'Jurídico', color: '#f59e0b' },
  operacional: { label: 'Operacional', color: '#6366f1' },
  certificados: { label: 'Certificados', color: '#ec4899' },
  modelos: { label: 'Modelos', color: '#64748b' },
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (formato: string) => {
  switch (formato.toLowerCase()) {
    case 'pdf':
      return <PictureAsPdf sx={{ color: '#ef4444' }} />;
    case 'xlsx':
    case 'xls':
      return <TableChart sx={{ color: '#10b981' }} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
      return <ImageIcon sx={{ color: '#3b82f6' }} />;
    default:
      return <InsertDriveFile sx={{ color: '#64748b' }} />;
  }
};

const DocumentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [, setSelectedDoc] = useState<DocType | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const categories: { key: string; label: string; count: number }[] = [
    { key: 'todos', label: 'Todos', count: mockDocuments.length },
    { key: 'fiscal', label: 'Fiscal', count: mockDocuments.filter(d => d.categoria === 'fiscal').length },
    { key: 'contabil', label: 'Contábil', count: mockDocuments.filter(d => d.categoria === 'contabil').length },
    { key: 'trabalhista', label: 'Trabalhista', count: mockDocuments.filter(d => d.categoria === 'trabalhista').length },
    { key: 'juridico', label: 'Jurídico', count: mockDocuments.filter(d => d.categoria === 'juridico').length },
    { key: 'operacional', label: 'Operacional', count: mockDocuments.filter(d => d.categoria === 'operacional').length },
  ];

  const filteredDocs = mockDocuments.filter(doc => {
    const matchesSearch = doc.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 0 || doc.categoria === categories[activeTab].key;
    return matchesSearch && matchesCategory;
  });

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedDocs(filteredDocs.map(d => d.id));
    } else {
      setSelectedDocs([]);
    }
  };

  const handleSelectDoc = (id: string) => {
    setSelectedDocs(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, doc: DocType) => {
    setAnchorEl(event.currentTarget);
    setSelectedDoc(doc);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDoc(null);
  };

  const handleUpload = () => {
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      setUploadDialogOpen(false);
    }, 2000);
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Documentos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestão Eletrônica de Documentos (GED)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
          >
            Filtrar
          </Button>
          <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload
          </Button>
        </Box>
      </Box>

      {/* Main Card */}
      <Card>
        {/* Category Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {categories.map((cat, index) => (
              <Tab
                key={cat.key}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {cat.label}
                    <Chip
                      label={cat.count}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: activeTab === index ? 'primary.main' : 'grey.200',
                        color: activeTab === index ? 'white' : 'text.secondary',
                      }}
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <CardContent>
          {/* Search and Actions Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <TextField
              placeholder="Buscar documentos..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 320 }}
            />
            {selectedDocs.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" startIcon={<Download />}>
                  Download ({selectedDocs.length})
                </Button>
                <Button size="small" color="error" startIcon={<Delete />}>
                  Excluir
                </Button>
              </Box>
            )}
          </Box>

          {/* Documents Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedDocs.length > 0 && selectedDocs.length < filteredDocs.length}
                      checked={filteredDocs.length > 0 && selectedDocs.length === filteredDocs.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Nome do Arquivo</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Data Upload</TableCell>
                  <TableCell>Tamanho</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDocs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((doc) => (
                    <TableRow
                      key={doc.id}
                      hover
                      selected={selectedDocs.includes(doc.id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedDocs.includes(doc.id)}
                          onChange={() => handleSelectDoc(doc.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {getFileIcon(doc.formato)}
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: doc.visualizado ? 400 : 600 }}>
                                {doc.nome}
                              </Typography>
                              {!doc.visualizado && (
                                <Chip
                                  label="Novo"
                                  size="small"
                                  color="primary"
                                  sx={{ height: 18, fontSize: '0.6rem' }}
                                />
                              )}
                            </Box>
                            {doc.competencia && (
                              <Typography variant="caption" color="text.secondary">
                                Ref: {doc.competencia}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={categoryConfig[doc.categoria]?.label || doc.categoria}
                          size="small"
                          sx={{
                            bgcolor: `${categoryConfig[doc.categoria]?.color}15`,
                            color: categoryConfig[doc.categoria]?.color,
                            fontWeight: 500,
                            fontSize: '0.7rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(parseISO(doc.dataUpload), "dd/MM/yyyy", { locale: ptBR })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(parseISO(doc.dataUpload), "HH:mm", { locale: ptBR })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {formatFileSize(doc.tamanho)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Visualizar">
                          <IconButton size="small">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton size="small">
                            <Download fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, doc)}>
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredDocs.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Itens por página"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          Visualizar
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          Download
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Share fontSize="small" />
          </ListItemIcon>
          Compartilhar
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          Excluir
        </MenuItem>
      </Menu>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Upload de Documento
            <IconButton onClick={() => setUploadDialogOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Paper
            sx={{
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 2,
              p: 6,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.light',
                '& .upload-icon': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <CloudUpload
              className="upload-icon"
              sx={{ fontSize: 64, color: 'grey.400', mb: 2 }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Arraste arquivos aqui
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              ou clique para selecionar
            </Typography>
            <Typography variant="caption" color="text.secondary">
              PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (máx. 25MB)
            </Typography>
          </Paper>

          {uploading && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">documento.pdf</Typography>
                <Typography variant="body2" color="text.secondary">75%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={75} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentsPage;
