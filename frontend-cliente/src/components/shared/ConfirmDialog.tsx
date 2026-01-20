import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import {
  Warning,
  Delete,
  Info,
  CheckCircle,
  Error,
} from '@mui/icons-material';

export type ConfirmDialogType = 'warning' | 'danger' | 'info' | 'success';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmDialogType;
  loading?: boolean;
}

const iconMap = {
  warning: <Warning sx={{ fontSize: 48, color: 'warning.main' }} />,
  danger: <Delete sx={{ fontSize: 48, color: 'error.main' }} />,
  info: <Info sx={{ fontSize: 48, color: 'info.main' }} />,
  success: <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />,
};

const buttonColorMap: Record<ConfirmDialogType, 'warning' | 'error' | 'info' | 'success'> = {
  warning: 'warning',
  danger: 'error',
  info: 'info',
  success: 'success',
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {iconMap[type]}
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mt: 1 }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          color="inherit"
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={buttonColorMap[type]}
          disabled={loading}
          autoFocus
        >
          {loading ? 'Aguarde...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
