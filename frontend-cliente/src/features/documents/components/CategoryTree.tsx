import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Badge,
  Tooltip,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Folder,
  FolderOpen,
  ExpandMore,
  ExpandLess,
  Description,
  Receipt,
  AccountBalance,
  Work,
  Gavel,
  Business,
  VerifiedUser,
  FileCopy,
  Add,
} from '@mui/icons-material';
import type { DocumentCategory } from '../../../types';

interface CategoryNode {
  id: DocumentCategory | string;
  label: string;
  icon: React.ReactNode;
  color: string;
  count: number;
  subcategories?: SubcategoryNode[];
}

interface SubcategoryNode {
  id: string;
  label: string;
  count: number;
}

interface CategoryTreeProps {
  selectedCategory: DocumentCategory | string | null;
  selectedSubcategory: string | null;
  onSelectCategory: (category: DocumentCategory | string | null) => void;
  onSelectSubcategory: (subcategory: string | null) => void;
  categoryCounts: Record<string, number>;
}

const defaultCategories: CategoryNode[] = [
  {
    id: 'fiscal',
    label: 'Fiscal',
    icon: <Receipt />,
    color: '#3b82f6',
    count: 0,
    subcategories: [
      { id: 'das', label: 'DAS - Simples Nacional', count: 0 },
      { id: 'nf', label: 'Notas Fiscais', count: 0 },
      { id: 'darf', label: 'DARF', count: 0 },
      { id: 'iss', label: 'ISS', count: 0 },
      { id: 'declaracoes', label: 'Declarações', count: 0 },
    ],
  },
  {
    id: 'contabil',
    label: 'Contábil',
    icon: <AccountBalance />,
    color: '#10b981',
    count: 0,
    subcategories: [
      { id: 'balanco', label: 'Balanço Patrimonial', count: 0 },
      { id: 'dre', label: 'DRE', count: 0 },
      { id: 'razao', label: 'Livro Razão', count: 0 },
      { id: 'diario', label: 'Livro Diário', count: 0 },
      { id: 'lalur', label: 'LALUR', count: 0 },
    ],
  },
  {
    id: 'trabalhista',
    label: 'Trabalhista',
    icon: <Work />,
    color: '#8b5cf6',
    count: 0,
    subcategories: [
      { id: 'folha', label: 'Folha de Pagamento', count: 0 },
      { id: 'fgts', label: 'FGTS', count: 0 },
      { id: 'inss', label: 'INSS', count: 0 },
      { id: 'ferias', label: 'Férias', count: 0 },
      { id: 'rescisao', label: 'Rescisões', count: 0 },
      { id: 'admissao', label: 'Admissões', count: 0 },
    ],
  },
  {
    id: 'juridico',
    label: 'Jurídico',
    icon: <Gavel />,
    color: '#f59e0b',
    count: 0,
    subcategories: [
      { id: 'contrato-social', label: 'Contrato Social', count: 0 },
      { id: 'alteracoes', label: 'Alterações Contratuais', count: 0 },
      { id: 'procuracoes', label: 'Procurações', count: 0 },
      { id: 'atas', label: 'Atas', count: 0 },
    ],
  },
  {
    id: 'operacional',
    label: 'Operacional',
    icon: <Business />,
    color: '#6366f1',
    count: 0,
    subcategories: [
      { id: 'certidoes', label: 'Certidões', count: 0 },
      { id: 'alvara', label: 'Alvará', count: 0 },
      { id: 'inscricoes', label: 'Inscrições', count: 0 },
      { id: 'contratos', label: 'Contratos de Serviço', count: 0 },
    ],
  },
  {
    id: 'certificados',
    label: 'Certificados',
    icon: <VerifiedUser />,
    color: '#ec4899',
    count: 0,
    subcategories: [
      { id: 'digital', label: 'Certificado Digital', count: 0 },
      { id: 'regularidade', label: 'Regularidade Fiscal', count: 0 },
    ],
  },
  {
    id: 'modelos',
    label: 'Modelos',
    icon: <FileCopy />,
    color: '#64748b',
    count: 0,
    subcategories: [
      { id: 'planilhas', label: 'Planilhas', count: 0 },
      { id: 'relatorios', label: 'Relatórios', count: 0 },
    ],
  },
];

const CategoryTree: React.FC<CategoryTreeProps> = ({
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
  onSelectSubcategory,
  categoryCounts,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Merge counts with default categories
  const categories = defaultCategories.map((cat) => ({
    ...cat,
    count: categoryCounts[cat.id] || 0,
    subcategories: cat.subcategories?.map((sub) => ({
      ...sub,
      count: categoryCounts[`${cat.id}:${sub.id}`] || 0,
    })),
  }));

  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryClick = (categoryId: DocumentCategory | string) => {
    onSelectCategory(categoryId);
    onSelectSubcategory(null);
    
    // Auto-expand if has subcategories
    const category = categories.find((c) => c.id === categoryId);
    if (category?.subcategories && !expandedCategories.includes(categoryId)) {
      setExpandedCategories((prev) => [...prev, categoryId]);
    }
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    onSelectCategory(categoryId as DocumentCategory);
    onSelectSubcategory(subcategoryId);
  };

  const handleAllClick = () => {
    onSelectCategory(null);
    onSelectSubcategory(null);
  };

  return (
    <Paper sx={{ height: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          CATEGORIAS
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{totalCount} documentos</Typography>
          <Tooltip title="Nova categoria">
            <IconButton size="small">
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <List dense disablePadding>
        {/* All Documents */}
        <ListItem disablePadding>
          <ListItemButton
            selected={selectedCategory === null}
            onClick={handleAllClick}
            sx={{
              py: 1.5,
              '&.Mui-selected': {
                bgcolor: 'primary.50',
                borderRight: 3,
                borderColor: 'primary.main',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Folder sx={{ color: 'text.secondary' }} />
            </ListItemIcon>
            <ListItemText
              primary="Todos os Documentos"
              primaryTypographyProps={{
                fontWeight: selectedCategory === null ? 600 : 400,
              }}
            />
            <Badge
              badgeContent={totalCount}
              color="default"
              max={999}
              sx={{
                '& .MuiBadge-badge': {
                  bgcolor: 'grey.200',
                  color: 'text.secondary',
                },
              }}
            />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* Category Tree */}
        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);
          const isSelected = selectedCategory === category.id && !selectedSubcategory;
          const hasChildren = category.subcategories && category.subcategories.length > 0;

          return (
            <React.Fragment key={category.id}>
              <ListItem
                disablePadding
                secondaryAction={
                  hasChildren && (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(category.id);
                      }}
                    >
                      {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                    </IconButton>
                  )
                }
              >
                <ListItemButton
                  selected={isSelected}
                  onClick={() => handleCategoryClick(category.id)}
                  sx={{
                    py: 1,
                    pr: hasChildren ? 5 : 2,
                    '&.Mui-selected': {
                      bgcolor: `${category.color}15`,
                      borderRight: 3,
                      borderColor: category.color,
                      '& .MuiListItemText-primary': {
                        color: 'text.primary',
                      },
                    },
                    '&:hover': {
                      bgcolor: 'transparent',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {isExpanded || isSelected ? (
                      <FolderOpen sx={{ color: category.color }} />
                    ) : (
                      React.cloneElement(category.icon as React.ReactElement, {
                        sx: { color: category.color },
                      })
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={category.label}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 400,
                      fontSize: '0.875rem',
                    }}
                  />
                  {category.count > 0 && (
                    <Badge
                      badgeContent={category.count}
                      color="default"
                      max={99}
                      sx={{
                        mr: hasChildren ? 2 : 0,
                        '& .MuiBadge-badge': {
                          bgcolor: isSelected ? category.color : 'grey.200',
                          color: isSelected ? 'white' : 'text.secondary',
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>

              {/* Subcategories */}
              {hasChildren && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding dense>
                    {category.subcategories?.map((sub) => {
                      const isSubSelected =
                        selectedCategory === category.id && selectedSubcategory === sub.id;

                      return (
                        <ListItemButton
                          key={sub.id}
                          sx={{
                            pl: 6,
                            py: 0.5,
                            '&.Mui-selected': {
                              bgcolor: `${category.color}15`,
                              '& .MuiListItemText-primary': {
                                color: 'text.primary',
                              },
                            },
                            '&:hover': {
                              bgcolor: 'transparent',
                            },
                          }}
                          selected={isSubSelected}
                          onClick={() => handleSubcategoryClick(category.id, sub.id)}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Description sx={{ fontSize: 18, color: 'text.secondary' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={sub.label}
                            primaryTypographyProps={{
                              fontSize: '0.8rem',
                              fontWeight: isSubSelected ? 600 : 400,
                            }}
                          />
                          {sub.count > 0 && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                bgcolor: isSubSelected ? category.color : 'grey.100',
                                color: isSubSelected ? 'white' : 'text.secondary',
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                fontSize: '0.7rem',
                              }}
                            >
                              {sub.count}
                            </Typography>
                          )}
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
};

export default CategoryTree;
