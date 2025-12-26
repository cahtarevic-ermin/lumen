'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Message } from './message';
import type { ChatMessage, Document } from '@/types';

interface ChatSplitProps {
  document: Document;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  streamingContent: string;
}

export function ChatSplit({
  document,
  messages,
  onSendMessage,
  isLoading,
  streamingContent,
}: ChatSplitProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-full gap-4">
      {/* Document Panel */}
      <Card className="w-1/2 flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">
                {document.filename}
              </CardTitle>
              <div className="flex gap-2 mt-1">
                {document.classification && (
                  <Badge variant="outline">{document.classification}</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 overflow-auto p-4">
          {document.summary ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Summary</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {document.summary}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No summary available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Chat Panel */}
      <div className="w-1/2 flex flex-col border rounded-lg">
        <div className="border-b p-4">
          <h3 className="font-medium">Chat</h3>
          <p className="text-sm text-muted-foreground">
            Ask questions about this document
          </p>
        </div>

        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="flex flex-col">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Start by asking a question about the document
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <Message
                  key={message.id}
                  role={message.role}
                  content={message.content}
                />
              ))
            )}
            {streamingContent && (
              <Message
                role="assistant"
                content={streamingContent}
                isStreaming
              />
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about this document..."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button type="submit" disabled={!input.trim() || isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
