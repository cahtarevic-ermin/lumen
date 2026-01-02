import axios from 'axios';
import type { Document, StatusResponse, ChatHistoryResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('access_token') 
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - could implement refresh logic here
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Optionally redirect to login
      }
    }
    return Promise.reject(error);
  }
);

// Document API
export const documentsApi = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post<{ id: string; logos_id: string; message: string }>(
      '/documents/upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },

  list: async () => {
    return api.get<Document[]>('/documents');
  },

  get: async (id: string) => {
    return api.get<Document>(`/documents/${id}`);
  },

  getStatus: async (id: string) => {
    return api.get<StatusResponse>(`/documents/${id}/status`);
  },

	sync: async (id: string) => {
    return api.post(`/documents/${id}/sync`);
  },

  delete: async (id: string) => {
    return api.delete(`/documents/${id}`);
  },
};

// Chat API (returns EventSource URL for SSE)
export const chatApi = {
  getStreamUrl: (documentId: string) => {
    return `${API_BASE_URL}/chat`;
  },

  sendMessage: async (
    documentId: string,
    message: string,
  ) => {
    return api.post(
      '/chat',
      {
        document_id: documentId,
        message,
        // No longer need conversation_history - backend loads from DB
      },
      {
        responseType: 'stream',
      }
    );
  },

  // New: Get chat history
  getHistory: async (documentId: string) => {
    return api.get<ChatHistoryResponse>(`/chat/history/${documentId}`);
  },

  // New: Clear chat history
  clearHistory: async (documentId: string) => {
    return api.delete(`/chat/history/${documentId}`);
  },
};
