import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-5xl font-bold text-primary">404</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/" className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products" className="gap-2">
              <Search className="w-4 h-4" />
              Browse Products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
