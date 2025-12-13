import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import {
  FolderZip,
  Close,
  CheckCircle,
  Error as ErrorIcon,
  PictureAsPdf,
  TableChart,
  Description,
  Image as ImageIcon,
  InsertDriveFile,
  Download,
  Pending,
} from '@mui/icons-material';
import type { Document as DocType } from '../../../types';

interface BatchDownloadDialogProps {
  open: boolean;
  onClose: () => void;
  documents: DocType[];
}

interface DownloadProgress {
  id: string;
  name: string;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  progress: number;
  errorMessage?: string;
}

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

const BatchDownloadDialog: React.FC<BatchDownloadDialogProps> = ({
  open,
  onClose,
  documents,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [fileProgress, setFileProgress] = useState<DownloadProgress[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Calculate total size
  const totalSize = documents.reduce((sum, doc) => sum + doc.tamanho, 0);

  // Initialize progress tracking when dialog opens
  useEffect(() => {
    if (open && documents.length > 0) {
      setFileProgress(
        documents.map(doc => ({
          id: doc.id,
          name: doc.nome,
          status: 'pending',
          progress: 0,
        }))
      );
      setIsDownloading(false);
      setOverallProgress(0);
      setIsComplete(false);
      setHasError(false);
    }
  }, [open, documents]);

  // Simulate downloading files (in production, this would be actual API calls)
  const simulateDownload = useCallback(async () => {
    setIsDownloading(true);
    setHasError(false);

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      
      // Update status to downloading
      setFileProgress(prev =>
        prev.map(f =>
          f.id === doc.id ? { ...f, status: 'downloading' } : f
        )
      );

      // Simulate download progress for each file
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
        
        setFileProgress(prev =>
          prev.map(f =>
            f.id === doc.id ? { ...f, progress } : f
          )
        );
      }

      // Simulate occasional errors (5% chance)
      const hasFileError = Math.random() < 0.05;
      
      // Mark as completed or error
      setFileProgress(prev =>
        prev.map(f =>
          f.id === doc.id
            ? {
                ...f,
                status: hasFileError ? 'error' : 'completed',
                progress: 100,
                errorMessage: hasFileError ? 'Falha na conexão' : undefined,
              }
            : f
        )
      );

      if (hasFileError) {
        setHasError(true);
      }

      // Update overall progress
      setOverallProgress(Math.round(((i + 1) / documents.length) * 100));
    }

    setIsDownloading(false);
    setIsComplete(true);
  }, [documents]);

  const handleStartDownload = () => {
    simulateDownload();
  };

  const handleRetryFailed = () => {
    // Get failed files and retry them
    const failedFiles = fileProgress.filter(f => f.status === 'error');
    if (failedFiles.length > 0) {
      setFileProgress(prev =>
        prev.map(f =>
          f.status === 'error' ? { ...f, status: 'pending', progress: 0, errorMessage: undefined } : f
        )
      );
      setIsComplete(false);
      setHasError(false);
      simulateDownload();
    }
  };

  const getStatusIcon = (status: DownloadProgress['status']) => {
    switch (status) {
      case 'pending':
        return <Pending sx={{ color: 'grey.400' }} />;
      case 'downloading':
        return null; // Will show progress
      case 'completed':
        return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
    }
  };

  const completedCount = fileProgress.filter(f => f.status === 'completed').length;
  const errorCount = fileProgress.filter(f => f.status === 'error').length;

  return (
    <Dialog
      open={open}
      onClose={isDownloading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FolderZip sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Download em Lote
            </Typography>
          </Box>
          {!isDownloading && (
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Summary */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {documents.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              arquivos selecionados
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {formatFileSize(totalSize)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              tamanho total
            </Typography>
          </Box>
        </Box>

        {/* Overall Progress */}
        {(isDownloading || isComplete) && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {isDownloading ? 'Preparando arquivos...' : 'Download concluído'}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {overallProgress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={overallProgress}
              sx={{ height: 8, borderRadius: 4 }}
              color={hasError ? 'warning' : 'primary'}
            />
            {isComplete && (
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip
                  label={`${completedCount} sucesso`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
                {errorCount > 0 && (
                  <Chip
                    label={`${errorCount} falha(s)`}
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
          </Box>
        )}

        {/* File List */}
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Arquivos para download:
        </Typography>
        <List
          dense
          sx={{
            maxHeight: 300,
            overflow: 'auto',
            bgcolor: 'grey.50',
            borderRadius: 1,
          }}
        >
          {fileProgress.map((file) => {
            const doc = documents.find(d => d.id === file.id);
            return (
              <ListItem
                key={file.id}
                sx={{
                  bgcolor: file.status === 'error' ? 'error.50' : 'transparent',
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {file.status === 'downloading' ? (
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <Download sx={{ color: 'primary.main' }} />
                    </Box>
                  ) : file.status === 'completed' || file.status === 'error' ? (
                    getStatusIcon(file.status)
                  ) : (
                    getFileIcon(doc?.formato || 'file')
                  )}
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ maxWidth: 250 }}
                      title={file.name}
                    >
                      {file.name}
                    </Typography>
                  }
                  secondary={
                    file.status === 'downloading' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <LinearProgress
                          variant="determinate"
                          value={file.progress}
                          sx={{ flex: 1, height: 4, borderRadius: 2 }}
                        />
                        <Typography variant="caption">{file.progress}%</Typography>
                      </Box>
                    ) : file.status === 'error' ? (
                      <Typography variant="caption" color="error">
                        {file.errorMessage}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        {doc ? formatFileSize(doc.tamanho) : ''}
                      </Typography>
                    )
                  }
                />
              </ListItem>
            );
          })}
        </List>

        {/* Error Alert */}
        {isComplete && hasError && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Alguns arquivos falharam no download. Você pode tentar novamente.
          </Alert>
        )}

        {/* Success Alert */}
        {isComplete && !hasError && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Todos os arquivos foram preparados com sucesso! O arquivo ZIP será baixado automaticamente.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {!isDownloading && !isComplete && (
          <>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleStartDownload}
            >
              Iniciar Download
            </Button>
          </>
        )}

        {isComplete && (
          <>
            {hasError && (
              <Button onClick={handleRetryFailed} color="warning">
                Tentar Novamente
              </Button>
            )}
            <Button variant="contained" onClick={onClose}>
              Fechar
            </Button>
          </>
        )}

        {isDownloading && (
          <Typography variant="body2" color="text.secondary">
            Aguarde enquanto os arquivos são preparados...
          </Typography>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BatchDownloadDialog;
