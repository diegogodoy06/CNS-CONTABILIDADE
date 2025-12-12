import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Document, DocumentFilters, DocumentCategory } from '../../types';

interface DocumentsState {
  documents: Document[];
  selectedDocument: Document | null;
  filters: DocumentFilters;
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  totalCount: number;
  page: number;
  limit: number;
  categories: { id: DocumentCategory; nome: string; count: number }[];
}

const initialState: DocumentsState = {
  documents: [],
  selectedDocument: null,
  filters: {},
  isLoading: false,
  isUploading: false,
  uploadProgress: 0,
  error: null,
  totalCount: 0,
  page: 1,
  limit: 20,
  categories: [
    { id: 'fiscal', nome: 'Fiscal', count: 0 },
    { id: 'contabil', nome: 'Contábil', count: 0 },
    { id: 'trabalhista', nome: 'Trabalhista', count: 0 },
    { id: 'juridico', nome: 'Jurídico', count: 0 },
    { id: 'operacional', nome: 'Operacional', count: 0 },
    { id: 'certificados', nome: 'Certificados', count: 0 },
    { id: 'modelos', nome: 'Modelos', count: 0 },
  ],
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    fetchDocumentsStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchDocumentsSuccess(
      state,
      action: PayloadAction<{ documents: Document[]; total: number }>
    ) {
      state.isLoading = false;
      state.documents = action.payload.documents;
      state.totalCount = action.payload.total;
      state.error = null;
    },
    fetchDocumentsFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedDocument(state, action: PayloadAction<Document | null>) {
      state.selectedDocument = action.payload;
    },
    setFilters(state, action: PayloadAction<DocumentFilters>) {
      state.filters = action.payload;
      state.page = 1; // Reset page when filters change
    },
    clearFilters(state) {
      state.filters = {};
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    uploadStart(state) {
      state.isUploading = true;
      state.uploadProgress = 0;
      state.error = null;
    },
    uploadProgress(state, action: PayloadAction<number>) {
      state.uploadProgress = action.payload;
    },
    uploadSuccess(state, action: PayloadAction<Document>) {
      state.isUploading = false;
      state.uploadProgress = 100;
      state.documents.unshift(action.payload);
      state.totalCount += 1;
    },
    uploadFailure(state, action: PayloadAction<string>) {
      state.isUploading = false;
      state.uploadProgress = 0;
      state.error = action.payload;
    },
    deleteDocument(state, action: PayloadAction<string>) {
      state.documents = state.documents.filter((doc) => doc.id !== action.payload);
      state.totalCount -= 1;
    },
    updateDocument(state, action: PayloadAction<Document>) {
      const index = state.documents.findIndex((doc) => doc.id === action.payload.id);
      if (index !== -1) {
        state.documents[index] = action.payload;
      }
    },
    updateCategoryCounts(
      state,
      action: PayloadAction<{ id: DocumentCategory; count: number }[]>
    ) {
      action.payload.forEach((update) => {
        const category = state.categories.find((c) => c.id === update.id);
        if (category) {
          category.count = update.count;
        }
      });
    },
    markAsViewed(state, action: PayloadAction<string>) {
      const doc = state.documents.find((d) => d.id === action.payload);
      if (doc) {
        doc.visualizado = true;
      }
    },
    clearDocuments(state) {
      state.documents = [];
      state.selectedDocument = null;
      state.totalCount = 0;
      state.page = 1;
    },
  },
});

export const {
  fetchDocumentsStart,
  fetchDocumentsSuccess,
  fetchDocumentsFailure,
  setSelectedDocument,
  setFilters,
  clearFilters,
  setPage,
  uploadStart,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
  deleteDocument,
  updateDocument,
  updateCategoryCounts,
  markAsViewed,
  clearDocuments,
} = documentsSlice.actions;

export default documentsSlice.reducer;
