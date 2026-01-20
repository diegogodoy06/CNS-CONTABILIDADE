import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Chip,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  CloudUpload,
  Close,
  CheckCircle,
  Error as ErrorIcon,
  PictureAsPdf,
  TableChart,
  Image as ImageIcon,
  InsertDriveFile,
  Description,
} from '@mui/icons-material';
import type { DocumentCategory } from '../../../types';
import documentosService from '../../../services/documentosService';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

interface FileUploadZoneProps {
  onUpload: (files: File[]) => void;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  multiple?: boolean;
  disabled?: boolean;
  empresaId?: string;
  categoria?: DocumentCategory;
}

const DEFAULT_ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const DEFAULT_MAX_SIZE = 25; // MB

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return <PictureAsPdf sx={{ color: '#ef4444' }} />;
  if (type.includes('sheet') || type.includes('excel')) return <TableChart sx={{ color: '#10b981' }} />;
  if (type.includes('image')) return <ImageIcon sx={{ color: '#3b82f6' }} />;
  if (type.includes('word') || type.includes('document')) return <Description sx={{ color: '#2563eb' }} />;
  return <InsertDriveFile sx={{ color: '#64748b' }} />;
};

const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toUpperCase() || '';
};

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onUpload,
  maxFileSize = DEFAULT_MAX_SIZE,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  multiple = true,
  disabled = false,
  empresaId,
  categoria = 'operacional',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    const maxBytes = maxFileSize * 1024 * 1024;
    if (file.size > maxBytes) {
      return `Arquivo "${file.name}" excede o tamanho máximo de ${maxFileSize}MB`;
    }

    // Check file type
    const isAccepted = acceptedTypes.some(type => {
      if (type.includes('*')) {
        const prefix = type.split('/')[0];
        return file.type.startsWith(prefix);
      }
      return file.type === type;
    });

    if (!isAccepted) {
      return `Tipo de arquivo "${file.name}" não permitido`;
    }

    return null;
  }, [maxFileSize, acceptedTypes]);

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newErrors: string[] = [];
    const validFiles: UploadFile[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          progress: 0,
          status: 'pending',
        });
      }
    });

    setErrors(prev => [...prev, ...newErrors]);
    
    if (validFiles.length > 0) {
      setUploadFiles(prev => [...prev, ...validFiles]);
      performUpload(validFiles);
    }
  }, [validateFile]);

  const performUpload = async (files: UploadFile[]) => {
    const uploadedFiles: File[] = [];

    for (const uploadFile of files) {
      // Update status to uploading
      setUploadFiles(prev =>
        prev.map(f =>
          f.id === uploadFile.id ? { ...f, status: 'uploading' } : f
        )
      );

      try {
        // Realizar upload real se tiver empresaId
        if (empresaId) {
          await documentosService.upload(
            uploadFile.file,
            {
              empresaId,
              tipo: categoria,
              titulo: uploadFile.file.name.replace(/\.[^/.]+$/, ''), // Remove extensão para título
            },
            (progress) => {
              setUploadFiles(prev =>
                prev.map(f =>
                  f.id === uploadFile.id ? { ...f, progress } : f
                )
              );
            }
          );
        } else {
          // Simulação de progresso se não tiver empresaId
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 50));
            setUploadFiles(prev =>
              prev.map(f =>
                f.id === uploadFile.id ? { ...f, progress } : f
              )
            );
          }
        }

        // Mark as success
        setUploadFiles(prev =>
          prev.map(f =>
            f.id === uploadFile.id ? { ...f, status: 'success', progress: 100 } : f
          )
        );

        uploadedFiles.push(uploadFile.file);
      } catch (error: any) {
        // Mark as error
        setUploadFiles(prev =>
          prev.map(f =>
            f.id === uploadFile.id 
              ? { ...f, status: 'error', errorMessage: error.response?.data?.message || 'Erro ao fazer upload' } 
              : f
          )
        );
      }
    }

    // Call onUpload with all successfully uploaded files
    if (uploadedFiles.length > 0) {
      onUpload(uploadedFiles);
    }
  };
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (disabled) return;

    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      processFiles(multiple ? files : [files[0]]);
    }
  }, [disabled, multiple, processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input
    e.target.value = '';
  }, [processFiles]);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const clearCompletedFiles = () => {
    setUploadFiles(prev => prev.filter(f => f.status !== 'success'));
  };

  return (
    <Box>
      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert 
          severity="error" 
          onClose={clearErrors}
          sx={{ mb: 2 }}
        >
          <Box>
            {errors.map((error, index) => (
              <Typography key={index} variant="body2">
                {error}
              </Typography>
            ))}
          </Box>
        </Alert>
      )}

      {/* Drop Zone */}
      <Paper
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        sx={{
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 6,
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          bgcolor: isDragging ? 'primary.50' : 'background.paper',
          opacity: disabled ? 0.6 : 1,
          '&:hover': !disabled ? {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          } : {},
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={disabled}
        />

        <CloudUpload
          sx={{
            fontSize: 64,
            color: isDragging ? 'primary.main' : 'grey.400',
            mb: 2,
            transition: 'color 0.2s',
          }}
        />

        <Typography variant="h6" sx={{ mb: 1 }}>
          {isDragging ? 'Solte os arquivos aqui' : 'Arraste arquivos aqui'}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          ou clique para selecionar
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Chip label="PDF" size="small" variant="outlined" />
          <Chip label="DOC/DOCX" size="small" variant="outlined" />
          <Chip label="XLS/XLSX" size="small" variant="outlined" />
          <Chip label="JPG/PNG" size="small" variant="outlined" />
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Tamanho máximo: {maxFileSize}MB por arquivo
        </Typography>
      </Paper>

      {/* Upload Progress List */}
      {uploadFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2">
              Arquivos ({uploadFiles.length})
            </Typography>
            {uploadFiles.some(f => f.status === 'success') && (
              <Typography
                variant="caption"
                color="primary"
                sx={{ cursor: 'pointer' }}
                onClick={clearCompletedFiles}
              >
                Limpar concluídos
              </Typography>
            )}
          </Box>

          <List dense sx={{ bgcolor: 'grey.50', borderRadius: 1 }}>
            {uploadFiles.map((uploadFile) => (
              <ListItem key={uploadFile.id}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {uploadFile.status === 'success' ? (
                    <CheckCircle color="success" />
                  ) : uploadFile.status === 'error' ? (
                    <ErrorIcon color="error" />
                  ) : (
                    getFileIcon(uploadFile.file.type)
                  )}
                </ListItemIcon>

                <ListItemText
                  disableTypography
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {uploadFile.file.name}
                      </Typography>
                      <Chip
                        label={getFileExtension(uploadFile.file.name)}
                        size="small"
                        sx={{ height: 18, fontSize: '0.6rem' }}
                      />
                    </Box>
                  }
                  secondary={
                    uploadFile.status === 'uploading' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <LinearProgress
                          variant="determinate"
                          value={uploadFile.progress}
                          sx={{ flexGrow: 1, height: 4, borderRadius: 2 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {uploadFile.progress}%
                        </Typography>
                      </Box>
                    ) : uploadFile.status === 'error' ? (
                      <Typography variant="caption" color="error">
                        {uploadFile.errorMessage || 'Erro no upload'}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(uploadFile.file.size)}
                      </Typography>
                    )
                  }
                />

                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleRemoveFile(uploadFile.id)}
                    disabled={uploadFile.status === 'uploading'}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default FileUploadZone;
