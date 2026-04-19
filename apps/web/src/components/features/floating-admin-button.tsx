'use client';

import * as React from 'react';
import { Settings } from 'lucide-react';
import Link from 'next/link';

export function FloatingAdminButton() {
  return (
    <div className="fixed bottom-6 left-6 z-40">
      <Link
        href="/admin"
        className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center shadow-lg hover:bg-gray-700 transition-all hover:scale-110 opacity-60 hover:opacity-100"
        title="Admin Panel"
      >
        <Settings className="w-5 h-5" />
      </Link>
    </div>
  );
}