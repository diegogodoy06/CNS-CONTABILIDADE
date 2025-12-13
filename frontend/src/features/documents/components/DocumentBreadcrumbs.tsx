import React from 'react';
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Chip,
} from '@mui/material';
import {
  NavigateNext,
  Home,
  Folder,
} from '@mui/icons-material';
import type { DocumentCategory } from '../../../types';

interface BreadcrumbItem {
  label: string;
  id?: string;
  onClick?: () => void;
}

interface DocumentBreadcrumbsProps {
  category: DocumentCategory | string | null;
  subcategory: string | null;
  onNavigate: (category: DocumentCategory | string | null, subcategory: string | null) => void;
  resultCount?: number;
}

const categoryLabels: Record<string, string> = {
  fiscal: 'Fiscal',
  contabil: 'Contábil',
  trabalhista: 'Trabalhista',
  juridico: 'Jurídico',
  operacional: 'Operacional',
  certificados: 'Certificados',
  modelos: 'Modelos',
};

const subcategoryLabels: Record<string, Record<string, string>> = {
  fiscal: {
    das: 'DAS - Simples Nacional',
    nf: 'Notas Fiscais',
    darf: 'DARF',
    iss: 'ISS',
    declaracoes: 'Declarações',
  },
  contabil: {
    balanco: 'Balanço Patrimonial',
    dre: 'DRE',
    razao: 'Livro Razão',
    diario: 'Livro Diário',
    lalur: 'LALUR',
  },
  trabalhista: {
    folha: 'Folha de Pagamento',
    fgts: 'FGTS',
    inss: 'INSS',
    ferias: 'Férias',
    rescisao: 'Rescisões',
    admissao: 'Admissões',
  },
  juridico: {
    'contrato-social': 'Contrato Social',
    alteracoes: 'Alterações Contratuais',
    procuracoes: 'Procurações',
    atas: 'Atas',
  },
  operacional: {
    certidoes: 'Certidões',
    alvara: 'Alvará',
    inscricoes: 'Inscrições',
    contratos: 'Contratos de Serviço',
  },
  certificados: {
    digital: 'Certificado Digital',
    regularidade: 'Regularidade Fiscal',
  },
  modelos: {
    planilhas: 'Planilhas',
    relatorios: 'Relatórios',
  },
};

const DocumentBreadcrumbs: React.FC<DocumentBreadcrumbsProps> = ({
  category,
  subcategory,
  onNavigate,
  resultCount,
}) => {
  const items: BreadcrumbItem[] = [
    {
      label: 'Documentos',
      onClick: () => onNavigate(null, null),
    },
  ];

  if (category) {
    items.push({
      label: categoryLabels[category] || category,
      id: category,
      onClick: () => onNavigate(category as DocumentCategory, null),
    });

    if (subcategory) {
      items.push({
        label: subcategoryLabels[category]?.[subcategory] || subcategory,
        id: subcategory,
      });
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
        py: 1,
        px: 2,
        bgcolor: 'grey.50',
        borderRadius: 1,
      }}
    >
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          if (isLast) {
            return (
              <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {index === 0 ? (
                  <Home fontSize="small" color="action" />
                ) : (
                  <Folder fontSize="small" color="primary" />
                )}
                <Typography
                  color="text.primary"
                  sx={{ fontWeight: 600 }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          }

          return (
            <Link
              key={item.label}
              component="button"
              variant="body2"
              onClick={item.onClick}
              underline="hover"
              color="inherit"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {index === 0 && <Home fontSize="small" />}
              {index > 0 && <Folder fontSize="small" />}
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>

      {resultCount !== undefined && (
        <Chip
          label={`${resultCount} ${resultCount === 1 ? 'documento' : 'documentos'}`}
          size="small"
          variant="outlined"
          sx={{ ml: 2 }}
        />
      )}
    </Box>
  );
};

export default DocumentBreadcrumbs;
