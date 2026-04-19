'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Package, FolderTree, MessageSquare, Users, Settings, LogOut, Leaf, Menu, X, Bell, User as UserIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const adminNavItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/categories', icon: FolderTree, label: 'Categories' },
  { href: '/admin/leads', icon: MessageSquare, label: 'Leads' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

function getStoredUser(): StoredUser | null {
  try {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
  } catch {}
  return null;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = getStoredUser();
    
    if (!token || !user) {
      router.push('/admin/login');
      return;
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      router.push('/admin/login');
      return;
    }

    setCurrentUser(user);
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await fetch(`${apiUrl}/api/v1/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        }).catch(() => {});
      }
    } catch {}

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render admin layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 h-16">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left - Logo & Toggle */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-primary hidden sm:block">SQ Agriculture</span>
            </Link>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <div className="flex items-center gap-2 pl-2 border-l">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{currentUser?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500">{currentUser?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Administrator'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <aside className={cn(
          'hidden md:block bg-white border-r fixed left-0 top-16 bottom-0 overflow-y-auto transition-all duration-300',
          isSidebarOpen ? 'w-64' : 'w-20'
        )}>
          <nav className="p-4 space-y-1">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className={cn(isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0')}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b">
                <Link href="/admin" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-primary">SQ Agriculture</span>
                </Link>
              </div>
              <nav className="p-4 space-y-1">
                {adminNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </Button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className={cn(
          'flex-1 p-6 transition-all duration-300',
          isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
