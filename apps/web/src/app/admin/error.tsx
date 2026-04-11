'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RefreshCw, LayoutDashboard } from 'lucide-react';

export default function AdminErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-4xl">!</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Error</h1>
        <p className="text-gray-500 mb-6">
          Something went wrong in the admin panel. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => reset()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
