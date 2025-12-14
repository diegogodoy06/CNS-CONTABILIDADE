import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Notification } from '../../types';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

// Data de hoje e datas anteriores para mock
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

// Notificações de exemplo para demonstração
const mockNotifications: Notification[] = [
  {
    id: '1',
    tipo: 'critica',
    titulo: 'Guia DAS vencendo hoje!',
    mensagem: 'A guia DAS de competência 04/2025 vence hoje. Valor: R$ 1.250,00',
    dataEnvio: today.toISOString(),
    lida: false,
    link: '/guias',
  },
  {
    id: '2',
    tipo: 'importante',
    titulo: 'Novo documento disponível',
    mensagem: 'Seu contador enviou um novo balancete referente a março/2025.',
    dataEnvio: today.toISOString(),
    lida: false,
    link: '/documentos',
  },
  {
    id: '3',
    tipo: 'informativa',
    titulo: 'Nota fiscal emitida com sucesso',
    mensagem: 'NF-e nº 1234 foi autorizada pela SEFAZ. Tomador: ABC Ltda.',
    dataEnvio: today.toISOString(),
    lida: false,
    link: '/notas',
  },
  {
    id: '4',
    tipo: 'importante',
    titulo: 'Guia INSS próxima do vencimento',
    mensagem: 'A guia INSS vence em 3 dias. Valor: R$ 2.150,00',
    dataEnvio: yesterday.toISOString(),
    lida: false,
    link: '/guias',
  },
  {
    id: '5',
    tipo: 'informativa',
    titulo: 'Atualização de cadastro',
    mensagem: 'Seus dados cadastrais foram atualizados pelo escritório contábil.',
    dataEnvio: yesterday.toISOString(),
    lida: true,
    link: '/perfil',
  },
  {
    id: '6',
    tipo: 'critica',
    titulo: 'Guia FGTS vencida',
    mensagem: 'A guia FGTS de competência 03/2025 venceu há 5 dias. Regularize para evitar multas.',
    dataEnvio: twoDaysAgo.toISOString(),
    lida: true,
    link: '/guias',
  },
  {
    id: '7',
    tipo: 'informativa',
    titulo: 'Comunicado do contador',
    mensagem: 'Lembramos que o prazo para entrega da documentação mensal é até o dia 10.',
    dataEnvio: threeDaysAgo.toISOString(),
    lida: true,
  },
];

const initialState: NotificationsState = {
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.lida).length,
  isLoading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    fetchNotificationsStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchNotificationsSuccess(state, action: PayloadAction<Notification[]>) {
      state.isLoading = false;
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.lida).length;
      state.error = null;
    },
    fetchNotificationsFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
      if (!action.payload.lida) {
        state.unreadCount += 1;
      }
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.lida) {
        notification.lida = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead(state) {
      state.notifications.forEach((n) => {
        n.lida = true;
      });
      state.unreadCount = 0;
    },
    removeNotification(state, action: PayloadAction<string>) {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.lida) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
    clearAllNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  clearAllNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
