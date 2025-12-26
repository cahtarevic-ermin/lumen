'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { UploadZone } from '@/components/documents/upload-zone';
import { DocumentCard } from '@/components/documents/document-card';
import { Button } from '@/components/ui/button';
import { documentsApi } from '@/lib/api';
import type { Document } from '@/types';

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await documentsApi.list();
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load documents');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Poll for status updates on pending/processing documents
  useEffect(() => {
    const pendingDocs = documents.length > 0 && Array.isArray(documents) && documents.filter(
      (d) => d.status === 'PENDING' || d.status === 'PROCESSING'
    );

    if (pendingDocs && pendingDocs.length === 0) return;

    const interval = setInterval(() => {
      fetchDocuments();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [documents, fetchDocuments]);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await documentsApi.upload(file);
      await fetchDocuments();
    } catch (err) {
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await documentsApi.delete(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error('Failed to delete document:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleChat = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Upload and manage your documents
          </p>
        </div>

        {/* Upload Zone */}
        <div className="mb-8">
          <UploadZone onUpload={handleUpload} isUploading={isUploading} />
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Documents</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDocuments}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">
                No documents yet. Upload your first document above!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {documents.length > 0 && Array.isArray(documents) && documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onDelete={handleDelete}
                  onChat={handleChat}
                  isDeleting={deletingId === doc.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
