import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import documentsReducer from './slices/documentsSlice';
import notasReducer from './slices/notasSlice';
import guiasReducer from './slices/guiasSlice';
import tomadoresReducer from './slices/tomadoresSlice';
import notificationsReducer from './slices/notificationsSlice';
import uiReducer from './slices/uiSlice';
import widgetsReducer from './slices/widgetsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    documents: documentsReducer,
    notas: notasReducer,
    guias: guiasReducer,
    tomadores: tomadoresReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
    widgets: widgetsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setUser'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
