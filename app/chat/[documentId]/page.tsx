'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LayoutGrid, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatSimple } from '@/components/chat/chat-simple';
import { ChatSplit } from '@/components/chat/chat-split';
import { documentsApi, chatApi } from '@/lib/api';
import type { Document, ChatMessage } from '@/types';

type ViewMode = 'simple' | 'split';

export default function ChatPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = use(params);
  const router = useRouter();
  
  const [document, setDocument] = useState<Document | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  const [error, setError] = useState<string | null>(null);

  // Load document and chat history
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch document and chat history in parallel
        const [docResponse, historyResponse] = await Promise.all([
          documentsApi.get(documentId),
          chatApi.getHistory(documentId),
        ]);
        
        setDocument(docResponse.data);
        setMessages(historyResponse.data.messages);
        
        if (docResponse.data.status !== 'COMPLETED') {
          setError('Document is not ready for chat');
        }
      } catch (err) {
        setError('Failed to load document');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [documentId]);

  const handleClearHistory = async () => {
    try {
      await chatApi.clearHistory(documentId);
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const handleSendMessage = async (content: string) => {
    // Optimistic update for user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);
    setStreamingContent('');

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            document_id: documentId,
            message: content,
            // No need to send conversation_history - backend loads from DB
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('event: token')) {
              continue;
            }
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  fullContent += data.content;
                  setStreamingContent(fullContent);
                }
              } catch {
                // Ignore parse errors
              }
            }
            if (line.startsWith('event: done')) {
              // Stream complete
            }
          }
        }
      }

      // Add final assistant message
      if (fullContent) {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: fullContent,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      // Remove the optimistic user message and show error
      setMessages((prev) => prev.slice(0, -1));
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsSending(false);
      setStreamingContent('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error || 'Document not found'}</p>
        <Button onClick={() => router.push('/documents')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/documents')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-medium">{document.filename}</h1>
            <p className="text-sm text-muted-foreground">Chat with document</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Clear History Button */}
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
          <Button
            variant={viewMode === 'simple' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('simple')}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Simple
          </Button>
          <Button
            variant={viewMode === 'split' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('split')}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Split
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden p-4">
        {viewMode === 'simple' ? (
          <ChatSimple
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isSending}
            streamingContent={streamingContent}
          />
        ) : (
          <ChatSplit
            document={document}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isSending}
            streamingContent={streamingContent}
          />
        )}
      </main>
    </div>
  );
}
