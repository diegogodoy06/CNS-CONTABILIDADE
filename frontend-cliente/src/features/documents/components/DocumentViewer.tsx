import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Tooltip,
  Paper,
  Divider,
} from '@mui/material';
import {
  Close,
  Download,
  Print,
  ZoomIn,
  ZoomOut,
  RotateRight,
  Fullscreen,
  Share,
  PictureAsPdf,
  TableChart,
  Image as ImageIcon,
  InsertDriveFile,
  ChevronLeft,
  ChevronRight,
  Description,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Document as DocType, DocumentCategory } from '../../../types';

interface DocumentViewerProps {
  document: DocType | null;
  open: boolean;
  onClose: () => void;
  onDownload?: (doc: DocType) => void;
  onPrint?: (doc: DocType) => void;
  onShare?: (doc: DocType) => void;
  documents?: DocType[]; // For navigation between documents
}

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

const getFileIcon = (formato: string, size: number = 24) => {
  const style = { fontSize: size };
  switch (formato.toLowerCase()) {
    case 'pdf':
      return <PictureAsPdf sx={{ ...style, color: '#ef4444' }} />;
    case 'xlsx':
    case 'xls':
      return <TableChart sx={{ ...style, color: '#10b981' }} />;
    case 'doc':
    case 'docx':
      return <Description sx={{ ...style, color: '#2563eb' }} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
    case 'gif':
      return <ImageIcon sx={{ ...style, color: '#3b82f6' }} />;
    default:
      return <InsertDriveFile sx={{ ...style, color: '#64748b' }} />;
  }
};

const isPreviewable = (formato: string): boolean => {
  const previewableFormats = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'gif'];
  return previewableFormats.includes(formato.toLowerCase());
};

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  open,
  onClose,
  onDownload,
  onPrint,
  onShare,
  documents = [],
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const currentIndex = documents.findIndex(d => d.id === document?.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < documents.length - 1;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleResetView = () => {
    setZoom(100);
    setRotation(0);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setLoadError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < documents.length) {
      // Reset view state
      setZoom(100);
      setRotation(0);
      setIsLoading(true);
      setLoadError(false);
    }
  };

  const handleFullscreen = () => {
    const element = window.document.getElementById('document-preview-container');
    if (element?.requestFullscreen) {
      element.requestFullscreen();
    }
  };

  if (!document) return null;

  const canPreview = isPreviewable(document.formato);
  const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(document.formato.toLowerCase());

  // Generate mock preview URL (in production, this would be a real URL)
  const previewUrl = document.formato.toLowerCase() === 'pdf' 
    ? '/sample.pdf' // Mock PDF URL
    : `https://via.placeholder.com/800x1000?text=${encodeURIComponent(document.nome)}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden' }}>
          {getFileIcon(document.formato, 32)}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
              {document.nome}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={categoryConfig[document.categoria]?.label || document.categoria}
                size="small"
                sx={{
                  bgcolor: `${categoryConfig[document.categoria]?.color}15`,
                  color: categoryConfig[document.categoria]?.color,
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(document.tamanho)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                •
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {format(parseISO(document.dataUpload), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {canPreview && (
            <>
              <Tooltip title="Diminuir zoom">
                <IconButton size="small" onClick={handleZoomOut} disabled={zoom <= 50}>
                  <ZoomOut />
                </IconButton>
              </Tooltip>
              <Typography variant="body2" sx={{ minWidth: 50, textAlign: 'center' }}>
                {zoom}%
              </Typography>
              <Tooltip title="Aumentar zoom">
                <IconButton size="small" onClick={handleZoomIn} disabled={zoom >= 200}>
                  <ZoomIn />
                </IconButton>
              </Tooltip>
              {isImage && (
                <Tooltip title="Rotacionar">
                  <IconButton size="small" onClick={handleRotate}>
                    <RotateRight />
                  </IconButton>
                </Tooltip>
              )}
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <Tooltip title="Tela cheia">
                <IconButton size="small" onClick={handleFullscreen}>
                  <Fullscreen />
                </IconButton>
              </Tooltip>
            </>
          )}
          
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          
          {onShare && (
            <Tooltip title="Compartilhar">
              <IconButton size="small" onClick={() => onShare(document)}>
                <Share />
              </IconButton>
            </Tooltip>
          )}
          {onPrint && canPreview && (
            <Tooltip title="Imprimir">
              <IconButton size="small" onClick={() => onPrint(document)}>
                <Print />
              </IconButton>
            </Tooltip>
          )}
          {onDownload && (
            <Tooltip title="Download">
              <IconButton size="small" onClick={() => onDownload(document)}>
                <Download />
              </IconButton>
            </Tooltip>
          )}
          
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        id="document-preview-container"
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: 'grey.100',
          position: 'relative',
        }}
      >
        {/* Navigation Arrows */}
        {documents.length > 1 && (
          <>
            {hasPrevious && (
              <IconButton
                onClick={() => handleNavigate('prev')}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                <ChevronLeft />
              </IconButton>
            )}
            {hasNext && (
              <IconButton
                onClick={() => handleNavigate('next')}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                <ChevronRight />
              </IconButton>
            )}
          </>
        )}

        {/* Preview Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto',
            p: 2,
          }}
        >
          {isLoading && canPreview && (
            <Box
              sx={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <CircularProgress size={32} />
              <Typography color="text.secondary">Carregando visualização...</Typography>
            </Box>
          )}

          {loadError && (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              {getFileIcon(document.formato, 64)}
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Não foi possível carregar a visualização
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                O arquivo pode estar corrompido ou o formato não é suportado.
              </Typography>
              {onDownload && (
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={() => onDownload(document)}
                >
                  Fazer Download
                </Button>
              )}
            </Paper>
          )}

          {!canPreview && !loadError && (
            <Paper sx={{ p: 6, textAlign: 'center', maxWidth: 400 }}>
              {getFileIcon(document.formato, 80)}
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Visualização não disponível
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Arquivos do tipo <strong>.{document.formato.toUpperCase()}</strong> não podem ser
                visualizados diretamente no navegador.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Faça o download para abrir o arquivo.
              </Typography>
              {onDownload && (
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={() => onDownload(document)}
                  size="large"
                >
                  Download ({formatFileSize(document.tamanho)})
                </Button>
              )}
            </Paper>
          )}

          {canPreview && !loadError && (
            <>
              {isImage ? (
                <Box
                  component="img"
                  src={previewUrl}
                  alt={document.nome}
                  onLoad={handleLoad}
                  onError={handleError}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transition: 'transform 0.2s ease',
                    display: isLoading ? 'none' : 'block',
                    boxShadow: 3,
                    borderRadius: 1,
                    bgcolor: 'white',
                  }}
                />
              ) : (
                // PDF Viewer
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <Box
                    component="iframe"
                    src={`${previewUrl}#toolbar=0&navpanes=0`}
                    onLoad={handleLoad}
                    onError={handleError}
                    sx={{
                      width: '100%',
                      maxWidth: 900,
                      height: '100%',
                      border: 'none',
                      boxShadow: 3,
                      bgcolor: 'white',
                      display: isLoading ? 'none' : 'block',
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Footer with document info */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Enviado por
              </Typography>
              <Typography variant="body2">{document.uploadedBy}</Typography>
            </Box>
            {document.competencia && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Competência
                </Typography>
                <Typography variant="body2">{document.competencia}</Typography>
              </Box>
            )}
            <Box>
              <Typography variant="caption" color="text.secondary">
                Versão
              </Typography>
              <Typography variant="body2">v{document.versao}</Typography>
            </Box>
          </Box>

          {canPreview && (
            <Button size="small" onClick={handleResetView}>
              Resetar visualização
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
