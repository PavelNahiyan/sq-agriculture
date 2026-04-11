'use client';

import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-500">Loading admin...</p>
      </div>
    </div>
  );
}
