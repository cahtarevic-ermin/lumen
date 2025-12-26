import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export function Message({ role, content, isStreaming }: MessageProps) {
  const isUser = role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 p-4',
        isUser ? 'bg-transparent' : 'bg-muted/50'
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium">
          {isUser ? 'You' : 'Assistant'}
        </p>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">
            {content}
            {isStreaming && (
              <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-foreground" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
