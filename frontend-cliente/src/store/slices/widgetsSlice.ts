import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface WidgetConfig {
  id: string;
  type: 'faturamento' | 'impostos' | 'notas' | 'guias' | 'documentos' | 'calendario' | 'notificacoes';
  title: string;
  visible: boolean;
  order: number;
  size: 'small' | 'medium' | 'large';
}

interface WidgetsState {
  widgets: WidgetConfig[];
  isCustomizing: boolean;
}

const defaultWidgets: WidgetConfig[] = [
  { id: 'kpi-notas', type: 'notas', title: 'Notas Emitidas', visible: true, order: 0, size: 'small' },
  { id: 'kpi-faturamento', type: 'faturamento', title: 'Faturamento', visible: true, order: 1, size: 'small' },
  { id: 'kpi-impostos', type: 'impostos', title: 'Impostos', visible: true, order: 2, size: 'small' },
  { id: 'kpi-guias', type: 'guias', title: 'Guias Pendentes', visible: true, order: 3, size: 'small' },
  { id: 'chart-faturamento', type: 'faturamento', title: 'Gráfico de Faturamento', visible: true, order: 4, size: 'large' },
  { id: 'chart-impostos', type: 'impostos', title: 'Gráfico de Impostos', visible: true, order: 5, size: 'medium' },
  { id: 'widget-calendario', type: 'calendario', title: 'Calendário de Obrigações', visible: true, order: 6, size: 'medium' },
  { id: 'widget-documentos', type: 'documentos', title: 'Documentos Recentes', visible: true, order: 7, size: 'medium' },
];

// Carregar do localStorage
const loadWidgetsFromStorage = (): WidgetConfig[] => {
  try {
    const saved = localStorage.getItem('cns_dashboard_widgets');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Erro ao carregar widgets:', e);
  }
  return defaultWidgets;
};

const initialState: WidgetsState = {
  widgets: loadWidgetsFromStorage(),
  isCustomizing: false,
};

const widgetsSlice = createSlice({
  name: 'widgets',
  initialState,
  reducers: {
    toggleWidgetVisibility: (state, action: PayloadAction<string>) => {
      const widget = state.widgets.find(w => w.id === action.payload);
      if (widget) {
        widget.visible = !widget.visible;
        localStorage.setItem('cns_dashboard_widgets', JSON.stringify(state.widgets));
      }
    },
    
    reorderWidgets: (state, action: PayloadAction<{ dragIndex: number; hoverIndex: number }>) => {
      const { dragIndex, hoverIndex } = action.payload;
      const dragWidget = state.widgets[dragIndex];
      
      // Remove o widget da posição original
      state.widgets.splice(dragIndex, 1);
      // Insere na nova posição
      state.widgets.splice(hoverIndex, 0, dragWidget);
      
      // Atualiza a ordem
      state.widgets.forEach((w, index) => {
        w.order = index;
      });
      
      localStorage.setItem('cns_dashboard_widgets', JSON.stringify(state.widgets));
    },
    
    setWidgetSize: (state, action: PayloadAction<{ id: string; size: WidgetConfig['size'] }>) => {
      const widget = state.widgets.find(w => w.id === action.payload.id);
      if (widget) {
        widget.size = action.payload.size;
        localStorage.setItem('cns_dashboard_widgets', JSON.stringify(state.widgets));
      }
    },
    
    setIsCustomizing: (state, action: PayloadAction<boolean>) => {
      state.isCustomizing = action.payload;
    },
    
    resetWidgets: (state) => {
      state.widgets = defaultWidgets;
      localStorage.setItem('cns_dashboard_widgets', JSON.stringify(defaultWidgets));
    },
    
    moveWidgetUp: (state, action: PayloadAction<string>) => {
      const index = state.widgets.findIndex(w => w.id === action.payload);
      if (index > 0) {
        const temp = state.widgets[index];
        state.widgets[index] = state.widgets[index - 1];
        state.widgets[index - 1] = temp;
        state.widgets.forEach((w, i) => { w.order = i; });
        localStorage.setItem('cns_dashboard_widgets', JSON.stringify(state.widgets));
      }
    },
    
    moveWidgetDown: (state, action: PayloadAction<string>) => {
      const index = state.widgets.findIndex(w => w.id === action.payload);
      if (index < state.widgets.length - 1) {
        const temp = state.widgets[index];
        state.widgets[index] = state.widgets[index + 1];
        state.widgets[index + 1] = temp;
        state.widgets.forEach((w, i) => { w.order = i; });
        localStorage.setItem('cns_dashboard_widgets', JSON.stringify(state.widgets));
      }
    },
  },
});

export const {
  toggleWidgetVisibility,
  reorderWidgets,
  setWidgetSize,
  setIsCustomizing,
  resetWidgets,
  moveWidgetUp,
  moveWidgetDown,
} = widgetsSlice.actions;

export default widgetsSlice.reducer;
