import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-5xl font-bold text-primary">404</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">
          This admin page doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/admin" className="gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
