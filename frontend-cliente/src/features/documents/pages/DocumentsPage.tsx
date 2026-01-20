import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  CircularProgress,
  TextField,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  Upload,
  Download,
  Delete,
  MoreVert,
  Visibility,
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
  MenuOpen,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Document as DocType, DocumentCategory, DocumentFilters } from '../../../types';
import documentosService from '../../../services/documentosService';
import { useAppSelector } from '../../../store/hooks';
import type { RootState } from '../../../store';
import {
  FileUploadZone,
  DocumentViewer,
  DocumentFilters as DocumentFiltersComponent,
  CategoryTree,
  DocumentBreadcrumbs,
  BatchDownloadDialog,
} from '../components';

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
  const { company } = useAppSelector((state: RootState) => state.auth);
  
  // State para dados da API
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State
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
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('operacional');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerDocument, setViewerDocument] = useState<DocType | null>(null);
  const [batchDownloadOpen, setBatchDownloadOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameDocument, setRenameDocument] = useState<DocType | null>(null);
  const [newName, setNewName] = useState('');
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuDocument, setMenuDocument] = useState<DocType | null>(null);
  
  // Snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Buscar documentos da API
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await documentosService.findAll({
        empresaId: company?.id,
        categoria: selectedCategory as DocumentCategory || undefined,
        busca: filters.busca,
        dataInicio: filters.dataInicio,
        dataFim: filters.dataFim,
        competencia: filters.competencia,
        page: page + 1,
        limit: rowsPerPage,
      });
      setDocuments(response.items || []);
      setTotalCount(response.meta?.total || 0);
    } catch (err: any) {
      console.error('Erro ao carregar documentos:', err);
      setError(err.response?.data?.message || 'Erro ao carregar documentos');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id, selectedCategory, filters, page, rowsPerPage]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

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

  // Filter documents (filtros já aplicados pela API, este é para filtros locais adicionais)
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      // Subcategory filter (local)
      if (selectedSubcategory && doc.subcategoria !== selectedSubcategory) return false;
      
      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasTag = filters.tags.some((t) => doc.tags?.includes(t));
        if (!hasTag) return false;
      }
      
      return true;
    });
  }, [documents, selectedSubcategory, filters.tags]);

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

  const handleDownload = useCallback(async (doc: DocType) => {
    try {
      setSnackbar({
        open: true,
        message: `Iniciando download: ${doc.nome}`,
        severity: 'info',
      });
      
      // Obtém informações de download do backend
      const downloadInfo = await documentosService.download(doc.id);
      
      // Se tiver URL, faz o download
      if (downloadInfo.url) {
        const link = document.createElement('a');
        link.href = downloadInfo.url;
        link.download = downloadInfo.nomeArquivo || doc.nome;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setSnackbar({
        open: true,
        message: `Download concluído: ${doc.nome}`,
        severity: 'success',
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao baixar documento',
        severity: 'error',
      });
    }
  }, []);

  const handleDownloadSelected = () => {
    setBatchDownloadOpen(true);
  };

  const handleRenameDocument = (doc: DocType) => {
    setRenameDocument(doc);
    setNewName(doc.nome); // Usa o nome completo do documento
    setRenameDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmRename = async () => {
    if (!renameDocument || !newName.trim()) return;
    try {
      // Usa apenas o novo nome digitado pelo usuário
      await documentosService.update(renameDocument.id, { titulo: newName.trim() });
      setSnackbar({
        open: true,
        message: 'Documento renomeado com sucesso!',
        severity: 'success',
      });
      fetchDocuments();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao renomear documento',
        severity: 'error',
      });
    } finally {
      setRenameDialogOpen(false);
      setRenameDocument(null);
      setNewName('');
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir ${selectedDocs.length} documento(s)?`)) {
      return;
    }
    try {
      await Promise.all(selectedDocs.map(id => documentosService.remove(id)));
      setSnackbar({
        open: true,
        message: `${selectedDocs.length} documento(s) excluído(s)`,
        severity: 'success',
      });
      setSelectedDocs([]);
      fetchDocuments(); // Recarregar lista
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao excluir documento(s)',
        severity: 'error',
      });
    }
  };

  const handleDeleteDocument = async (doc: DocType) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${doc.nome}"?`)) {
      handleMenuClose();
      return;
    }
    try {
      await documentosService.remove(doc.id);
      setSnackbar({
        open: true,
        message: `Documento "${doc.nome}" excluído`,
        severity: 'success',
      });
      fetchDocuments();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao excluir documento',
        severity: 'error',
      });
    }
    handleMenuClose();
  };

  const handleUploadComplete = (files: File[]) => {
    setSnackbar({
      open: true,
      message: `${files.length} arquivo(s) enviado(s) com sucesso!`,
      severity: 'success',
    });
    setUploadDialogOpen(false);
    fetchDocuments(); // Recarregar lista após upload
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
    <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
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
          zIndex: (theme) => theme.zIndex.drawer - 1,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            position: 'relative',
            height: '100%',
            border: 'none',
            borderRight: 1,
            borderColor: 'divider',
            zIndex: 'auto',
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Upload />}
              onClick={() => setUploadDialogOpen(true)}
            >
              Upload
            </Button>
          </Box>
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
        <MenuItem onClick={() => menuDocument && handleRenameDocument(menuDocument)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Renomear
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => menuDocument && handleDeleteDocument(menuDocument)} sx={{ color: 'error.main' }}>
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
          {/* Seleção de Categoria */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Categoria do Documento *</InputLabel>
            <Select
              value={uploadCategory}
              label="Categoria do Documento *"
              onChange={(e) => setUploadCategory(e.target.value as DocumentCategory)}
            >
              {Object.entries(categoryConfig).map(([key, config]) => (
                <MenuItem key={key} value={key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: config.color,
                      }}
                    />
                    {config.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            Os arquivos serão adicionados à categoria:{' '}
            <strong>{categoryConfig[uploadCategory]?.label || uploadCategory}</strong>
          </Alert>
          
          <FileUploadZone
            onUpload={handleUploadComplete}
            maxFileSize={25}
            multiple
            empresaId={company?.id}
            categoria={uploadCategory}
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
        documents={filteredDocs}
      />

      {/* Batch Download Dialog */}
      <BatchDownloadDialog
        open={batchDownloadOpen}
        onClose={() => {
          setBatchDownloadOpen(false);
          setSelectedDocs([]);
        }}
        documents={documents.filter(doc => selectedDocs.includes(doc.id))}
      />

      {/* Rename Document Dialog */}
      <Dialog
        open={renameDialogOpen}
        onClose={() => {
          setRenameDialogOpen(false);
          setRenameDocument(null);
          setNewName('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Renomear Documento</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Novo nome"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleConfirmRename();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setRenameDialogOpen(false);
            setRenameDocument(null);
            setNewName('');
          }}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmRename} 
            variant="contained"
            disabled={!newName.trim()}
          >
            Renomear
          </Button>
        </DialogActions>
      </Dialog>

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
