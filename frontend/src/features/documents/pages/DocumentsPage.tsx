import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
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
  Drawer,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
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
  Close,
  GridView,
  ViewList,
  FolderZip,
  Description,
  Edit,
  ContentCopy,
  History,
  MenuOpen,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Document as DocType, DocumentCategory, DocumentFilters } from '../../../types';
import {
  FileUploadZone,
  DocumentViewer,
  DocumentFilters as DocumentFiltersComponent,
  CategoryTree,
  DocumentBreadcrumbs,
} from '../components';

// Extended mock data
const mockDocuments: DocType[] = [
  {
    id: '1',
    nome: 'Contrato_Social_Consolidado.pdf',
    categoria: 'juridico',
    subcategoria: 'contrato-social',
    dataUpload: '2024-12-10T10:30:00',
    dataReferencia: '2024-01-15',
    tamanho: 2457600,
    formato: 'pdf',
    url: '/documents/1',
    uploadedBy: 'João Silva',
    visualizado: true,
    compartilhadoContador: true,
    privado: false,
    versao: 2,
    tags: ['Importante'],
  },
  {
    id: '2',
    nome: 'Balanço_Patrimonial_2024.xlsx',
    categoria: 'contabil',
    subcategoria: 'balanco',
    dataUpload: '2024-12-08T14:20:00',
    competencia: '2024',
    tamanho: 1126400,
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
    subcategoria: 'das',
    dataUpload: '2024-12-05T09:15:00',
    competencia: '11/2024',
    tamanho: 512000,
    formato: 'pdf',
    url: '/documents/3',
    uploadedBy: 'Contador',
    visualizado: false,
    compartilhadoContador: true,
    privado: false,
    versao: 1,
    tags: ['Mensal'],
  },
  {
    id: '4',
    nome: 'Folha_Pagamento_Nov2024.pdf',
    categoria: 'trabalhista',
    subcategoria: 'folha',
    dataUpload: '2024-12-03T16:45:00',
    competencia: '11/2024',
    tamanho: 3276800,
    formato: 'pdf',
    url: '/documents/4',
    uploadedBy: 'Contador',
    visualizado: true,
    compartilhadoContador: true,
    privado: false,
    versao: 1,
    tags: ['Mensal'],
  },
  {
    id: '5',
    nome: 'Certidão_Negativa_Federal.pdf',
    categoria: 'operacional',
    subcategoria: 'certidoes',
    dataUpload: '2024-12-01T11:30:00',
    tamanho: 256000,
    formato: 'pdf',
    url: '/documents/5',
    uploadedBy: 'João Silva',
    visualizado: true,
    compartilhadoContador: false,
    privado: false,
    versao: 1,
  },
  {
    id: '6',
    nome: 'DARF_IR_Outubro2024.pdf',
    categoria: 'fiscal',
    subcategoria: 'darf',
    dataUpload: '2024-11-28T09:00:00',
    competencia: '10/2024',
    tamanho: 384000,
    formato: 'pdf',
    url: '/documents/6',
    uploadedBy: 'Contador',
    visualizado: true,
    compartilhadoContador: true,
    privado: false,
    versao: 1,
  },
  {
    id: '7',
    nome: 'Recibos_FGTS_Nov2024.pdf',
    categoria: 'trabalhista',
    subcategoria: 'fgts',
    dataUpload: '2024-11-25T14:00:00',
    competencia: '11/2024',
    tamanho: 445000,
    formato: 'pdf',
    url: '/documents/7',
    uploadedBy: 'Contador',
    visualizado: false,
    compartilhadoContador: true,
    privado: false,
    versao: 1,
  },
  {
    id: '8',
    nome: 'Certificado_Digital_A1.pfx',
    categoria: 'certificados',
    subcategoria: 'digital',
    dataUpload: '2024-11-20T10:00:00',
    tamanho: 8200,
    formato: 'pfx',
    url: '/documents/8',
    uploadedBy: 'João Silva',
    visualizado: true,
    compartilhadoContador: false,
    privado: true,
    versao: 1,
    tags: ['Importante'],
  },
  {
    id: '9',
    nome: 'Comprovante_Pagamento_Aluguel.jpg',
    categoria: 'operacional',
    subcategoria: 'contratos',
    dataUpload: '2024-11-18T16:30:00',
    competencia: '11/2024',
    tamanho: 1856000,
    formato: 'jpg',
    url: '/documents/9',
    uploadedBy: 'João Silva',
    visualizado: true,
    compartilhadoContador: false,
    privado: false,
    versao: 1,
  },
  {
    id: '10',
    nome: 'DRE_Terceiro_Trimestre_2024.xlsx',
    categoria: 'contabil',
    subcategoria: 'dre',
    dataUpload: '2024-11-15T11:00:00',
    competencia: '3T/2024',
    tamanho: 856000,
    formato: 'xlsx',
    url: '/documents/10',
    uploadedBy: 'Contador',
    visualizado: true,
    compartilhadoContador: true,
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
    case 'doc':
    case 'docx':
      return <Description sx={{ color: '#2563eb' }} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
      return <ImageIcon sx={{ color: '#3b82f6' }} />;
    default:
      return <InsertDriveFile sx={{ color: '#64748b' }} />;
  }
};

const SIDEBAR_WIDTH = 280;

const DocumentsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [documents] = useState<DocType[]>(mockDocuments);
  const [filters, setFilters] = useState<DocumentFilters>({});
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // Dialog states
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerDocument, setViewerDocument] = useState<DocType | null>(null);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuDocument, setMenuDocument] = useState<DocType | null>(null);
  
  // Snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    documents.forEach((doc) => {
      counts[doc.categoria] = (counts[doc.categoria] || 0) + 1;
      if (doc.subcategoria) {
        counts[`${doc.categoria}:${doc.subcategoria}`] = (counts[`${doc.categoria}:${doc.subcategoria}`] || 0) + 1;
      }
    });
    return counts;
  }, [documents]);

  // Filter documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      // Category filter
      if (selectedCategory && doc.categoria !== selectedCategory) return false;
      
      // Subcategory filter
      if (selectedSubcategory && doc.subcategoria !== selectedSubcategory) return false;
      
      // Search filter
      if (filters.busca) {
        const search = filters.busca.toLowerCase();
        const matchesName = doc.nome.toLowerCase().includes(search);
        const matchesCompetencia = doc.competencia?.toLowerCase().includes(search);
        const matchesTags = doc.tags?.some((t) => t.toLowerCase().includes(search));
        if (!matchesName && !matchesCompetencia && !matchesTags) return false;
      }
      
      // Date filter
      if (filters.dataInicio) {
        const docDate = new Date(doc.dataUpload);
        const startDate = new Date(filters.dataInicio);
        if (docDate < startDate) return false;
      }
      
      if (filters.dataFim) {
        const docDate = new Date(doc.dataUpload);
        const endDate = new Date(filters.dataFim);
        endDate.setHours(23, 59, 59);
        if (docDate > endDate) return false;
      }
      
      // Competência filter
      if (filters.competencia && doc.competencia !== filters.competencia) return false;
      
      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasTag = filters.tags.some((t) => doc.tags?.includes(t));
        if (!hasTag) return false;
      }
      
      return true;
    });
  }, [documents, selectedCategory, selectedSubcategory, filters]);

  // Handlers
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedDocs(filteredDocs.map((d) => d.id));
    } else {
      setSelectedDocs([]);
    }
  };

  const handleSelectDoc = (id: string) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, doc: DocType) => {
    setAnchorEl(event.currentTarget);
    setMenuDocument(doc);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuDocument(null);
  };

  const handleViewDocument = (doc: DocType) => {
    setViewerDocument(doc);
    setViewerOpen(true);
    handleMenuClose();
  };

  const handleDownload = useCallback((doc: DocType) => {
    setSnackbar({
      open: true,
      message: `Download iniciado: ${doc.nome}`,
      severity: 'info',
    });
    handleMenuClose();
  }, []);

  const handleDownloadSelected = () => {
    setSnackbar({
      open: true,
      message: `Preparando download de ${selectedDocs.length} arquivos...`,
      severity: 'info',
    });
  };

  const handleDeleteSelected = () => {
    setSnackbar({
      open: true,
      message: `${selectedDocs.length} documento(s) excluído(s)`,
      severity: 'success',
    });
    setSelectedDocs([]);
  };

  const handleUploadComplete = (files: File[]) => {
    setSnackbar({
      open: true,
      message: `${files.length} arquivo(s) enviado(s) com sucesso!`,
      severity: 'success',
    });
    setUploadDialogOpen(false);
  };

  const handleNavigate = (category: DocumentCategory | string | null, subcategory: string | null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedCategory(value as DocumentCategory || null);
    setSelectedSubcategory(null);
  };

  // Render document grid item
  const renderGridItem = (doc: DocType) => (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={doc.id}>
      <Paper
        sx={{
          p: 2,
          cursor: 'pointer',
          transition: 'all 0.2s',
          border: selectedDocs.includes(doc.id) ? 2 : 1,
          borderColor: selectedDocs.includes(doc.id) ? 'primary.main' : 'divider',
          '&:hover': {
            boxShadow: 3,
            borderColor: 'primary.light',
          },
        }}
        onClick={() => handleViewDocument(doc)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Checkbox
            checked={selectedDocs.includes(doc.id)}
            onChange={(e) => {
              e.stopPropagation();
              handleSelectDoc(doc.id);
            }}
            onClick={(e) => e.stopPropagation()}
            size="small"
          />
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuOpen(e, doc);
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          {React.cloneElement(getFileIcon(doc.formato) as React.ReactElement, {
            sx: { fontSize: 48 },
          })}
        </Box>

        <Typography
          variant="body2"
          sx={{
            fontWeight: doc.visualizado ? 400 : 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 1,
          }}
          title={doc.nome}
        >
          {doc.nome}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={categoryConfig[doc.categoria]?.label}
            size="small"
            sx={{
              bgcolor: `${categoryConfig[doc.categoria]?.color}15`,
              color: categoryConfig[doc.categoria]?.color,
              fontSize: '0.65rem',
              height: 20,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {formatFileSize(doc.tamanho)}
          </Typography>
        </Box>

        {!doc.visualizado && (
          <Chip
            label="Novo"
            size="small"
            color="primary"
            sx={{ mt: 1, height: 18, fontSize: '0.6rem' }}
          />
        )}
      </Paper>
    </Grid>
  );

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Sidebar - Category Tree */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          width: sidebarOpen ? SIDEBAR_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            position: 'relative',
            height: '100%',
            border: 'none',
            borderRight: 1,
            borderColor: 'divider',
          },
        }}
      >
        <CategoryTree
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onSelectCategory={setSelectedCategory}
          onSelectSubcategory={setSelectedSubcategory}
          categoryCounts={categoryCounts}
        />
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {/* Page Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <MenuOpen /> : <MenuIcon />}
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Documentos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestão Eletrônica de Documentos (GED)
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload
          </Button>
        </Box>

        {/* Breadcrumbs */}
        <DocumentBreadcrumbs
          category={selectedCategory}
          subcategory={selectedSubcategory}
          onNavigate={handleNavigate}
          resultCount={filteredDocs.length}
        />

        {/* Filters */}
        <DocumentFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
          resultCount={filteredDocs.length}
        />

        {/* Main Card */}
        <Card>
          <CardContent>
            {/* Actions Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Category Quick Filter (Mobile) */}
                {isMobile && (
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Categoria</InputLabel>
                    <Select
                      value={selectedCategory || ''}
                      onChange={handleCategoryChange}
                      label="Categoria"
                    >
                      <MenuItem value="">Todas</MenuItem>
                      {Object.entries(categoryConfig).map(([key, value]) => (
                        <MenuItem key={key} value={key}>{value.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {selectedDocs.length > 0 && (
                  <>
                    <Chip
                      label={`${selectedDocs.length} selecionado(s)`}
                      onDelete={() => setSelectedDocs([])}
                      color="primary"
                      size="small"
                    />
                    <Divider orientation="vertical" flexItem />
                    <Tooltip title="Download selecionados">
                      <Button
                        size="small"
                        startIcon={<FolderZip />}
                        onClick={handleDownloadSelected}
                      >
                        Download ZIP
                      </Button>
                    </Tooltip>
                    <Tooltip title="Excluir selecionados">
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleDeleteSelected}
                      >
                        Excluir
                      </Button>
                    </Tooltip>
                  </>
                )}
              </Box>

              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, value) => value && setViewMode(value)}
                size="small"
              >
                <ToggleButton value="list">
                  <Tooltip title="Visualização em lista">
                    <ViewList />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="grid">
                  <Tooltip title="Visualização em grade">
                    <GridView />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Empty State */}
            {filteredDocs.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <InsertDriveFile sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Nenhum documento encontrado
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Tente ajustar os filtros ou faça upload de novos documentos.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Upload />}
                  onClick={() => setUploadDialogOpen(true)}
                >
                  Fazer Upload
                </Button>
              </Box>
            ) : viewMode === 'list' ? (
              /* Table View */
              <>
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
                            onClick={() => handleViewDocument(doc)}
                          >
                            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
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
                            <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                              <Tooltip title="Visualizar">
                                <IconButton size="small" onClick={() => handleViewDocument(doc)}>
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download">
                                <IconButton size="small" onClick={() => handleDownload(doc)}>
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
              </>
            ) : (
              /* Grid View */
              <>
                <Grid container spacing={2}>
                  {filteredDocs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(renderGridItem)}
                </Grid>

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
                  sx={{ mt: 2 }}
                />
              </>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => menuDocument && handleViewDocument(menuDocument)}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          Visualizar
        </MenuItem>
        <MenuItem onClick={() => menuDocument && handleDownload(menuDocument)}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          Download
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Renomear
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          Duplicar
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Share fontSize="small" />
          </ListItemIcon>
          Compartilhar
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <History fontSize="small" />
          </ListItemIcon>
          Ver versões
        </MenuItem>
        <Divider />
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
            Upload de Documentos
            <IconButton onClick={() => setUploadDialogOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCategory && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Os arquivos serão adicionados à categoria:{' '}
              <strong>{categoryConfig[selectedCategory as DocumentCategory]?.label || selectedCategory}</strong>
            </Alert>
          )}
          <FileUploadZone
            onUpload={handleUploadComplete}
            maxFileSize={25}
            multiple
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Document Viewer */}
      <DocumentViewer
        document={viewerDocument}
        open={viewerOpen}
        onClose={() => {
          setViewerOpen(false);
          setViewerDocument(null);
        }}
        onDownload={handleDownload}
        onShare={(doc) => {
          setSnackbar({
            open: true,
            message: `Link de compartilhamento copiado: ${doc.nome}`,
            severity: 'success',
          });
        }}
        documents={filteredDocs}
      />

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

export default DocumentsPage;
