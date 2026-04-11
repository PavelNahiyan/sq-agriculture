'use client';

import * as React from 'react';
import { Send, Check, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewsletterFormProps {
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterForm({ className, variant = 'default' }: NewsletterFormProps) {
  const [email, setEmail] = React.useState('');
  const [formState, setFormState] = React.useState<FormState>('idle');
  const [message, setMessage] = React.useState('');

  const isCompact = variant === 'compact';
  const isInline = variant === 'inline';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setFormState('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setFormState('loading');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/newsletter/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFormState('success');
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        setFormState('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setFormState('error');
      setMessage('Unable to connect. Please try again later.');
    }
  };

  const renderContent = () => {
    switch (formState) {
      case 'success':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="h-5 w-5" />
            <span>{message}</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span>{message}</span>
          </div>
        );
      default:
        return (
          <form onSubmit={handleSubmit} className={cn('flex gap-2', isInline && 'flex-row')}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                'bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:bg-white/20',
                isCompact && 'h-9 text-sm',
                !isCompact && !isInline && 'h-10'
              )}
              disabled={formState === 'loading'}
              aria-label="Email address"
            />
            <Button
              type="submit"
              disabled={formState === 'loading'}
              className={cn(
                'bg-accent hover:bg-accent/90 text-gray-900 font-medium',
                isCompact && 'h-9 px-3 text-sm',
                !isCompact && !isInline && 'h-10 px-4',
                isInline && 'h-10'
              )}
            >
              {formState === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Subscribe
                  {!isCompact && <Send className="ml-2 h-4 w-4" />}
                </>
              )}
            </Button>
          </form>
        );
    }
  };

  if (isInline) {
    return renderContent();
  }

  return (
    <div className={cn('space-y-3', className)}>
      {!isCompact && (
        <div>
          <h3 className="font-semibold text-lg text-white">Newsletter</h3>
          <p className="text-gray-300 text-sm mt-1">
            Subscribe to get the latest updates on agricultural products and news.
          </p>
        </div>
      )}
      {renderContent()}
    </div>
  );
}
