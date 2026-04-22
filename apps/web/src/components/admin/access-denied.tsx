'use client';

import Link from 'next/link';
import { Lock, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccessDeniedProps {
  message?: string;
  assignedPage?: string;
}

export function AccessDenied({ 
  message = 'You can only access your assigned pages',
  assignedPage 
}: AccessDeniedProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          {assignedPage && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 mb-2">
                Your assigned page:
              </p>
              <Link href={assignedPage}>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Go to Your Page
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-4">
              Contact your Super Admin for access to additional pages.
            </p>
            <Link href="/admin/login">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessDenied;