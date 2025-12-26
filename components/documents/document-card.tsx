'use client';

import { FileText, Loader2, CheckCircle, XCircle, Clock, Trash2, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Document, DocumentStatus } from '@/types';

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
  onChat: (id: string) => void;
  isDeleting?: boolean;
}

const statusConfig: Record<DocumentStatus, { icon: React.ReactNode; label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: {
    icon: <Clock className="h-3 w-3" />,
    label: 'Pending',
    variant: 'outline',
  },
  PROCESSING: {
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    label: 'Processing',
    variant: 'secondary',
  },
  COMPLETED: {
    icon: <CheckCircle className="h-3 w-3" />,
    label: 'Ready',
    variant: 'default',
  },
  FAILED: {
    icon: <XCircle className="h-3 w-3" />,
    label: 'Failed',
    variant: 'destructive',
  },
};

export function DocumentCard({ document, onDelete, onChat, isDeleting }: DocumentCardProps) {
  const status = statusConfig[document.status];

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start gap-3 space-y-0">
        <div className="rounded-lg bg-muted p-2">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-medium leading-tight line-clamp-2">
            {document.filename}
          </h3>
          <Badge variant={status.variant} className="gap-1">
            {status.icon}
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {document.summary ? (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {document.summary}
          </p>
        ) : document.status === 'FAILED' ? (
          <p className="text-sm text-destructive">
            {document.error_message || 'Processing failed'}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            {document.status === 'PROCESSING'
              ? 'Processing document...'
              : 'Waiting to be processed'}
          </p>
        )}

        {document.classification && (
          <Badge variant="outline" className="mt-2">
            {document.classification}
          </Badge>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          disabled={document.status !== 'COMPLETED'}
          onClick={() => onChat(document.id)}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(document.id)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
