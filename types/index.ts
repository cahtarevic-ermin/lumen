export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Document {
  id: string;
  filename: string;
  content_type: string;
  status: DocumentStatus;
  summary: string | null;
  classification: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface UploadResponse {
  id: string;
  logos_id: string;
  message: string;
}

export interface StatusResponse {
  id: string;
  status: DocumentStatus;
  summary: string | null;
  classification: string | null;
  error_message: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}
