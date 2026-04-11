'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Leaf,
  Bell,
  Menu,
  X,
} from 'lucide-react';

interface AdminNavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const adminNavItems: AdminNavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/leads', label: 'Leads', icon: MessageSquare },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token && !pathname.includes('/login')) {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  const isLoginPage = pathname === '/admin/login';
  if (isLoginPage) {
    return <>{children}</>;
  }

  const renderNavItem = (item: AdminNavItem) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-100',
          !isSidebarOpen && 'justify-center px-2'
        )}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {isSidebarOpen && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left - Logo & Toggle */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <Link href="/admin" className="flex items-center gap-2">
              <img 
                src="/uploads/products/SQ Fertilizer AI Logo Final.png" 
                alt="SQ Agriculture" 
                className="h-8 w-auto object-contain"
              />
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
                <span className="text-sm font-semibold text-primary">A</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            'hidden lg:block bg-white border-r fixed left-0 top-16 bottom-0 overflow-y-auto transition-all duration-300',
            isSidebarOpen ? 'w-64' : 'w-20'
          )}
        >
          <nav className="p-4 space-y-1">
            {adminNavItems.map((item) => renderNavItem(item))}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
            <aside
              className="absolute left-0 top-0 bottom-0 w-72 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <Link href="/admin" className="flex items-center gap-2">
                  <img 
                    src="/uploads/products/SQ Fertilizer AI Logo Final.png" 
                    alt="SQ Agriculture" 
                    className="h-8 w-auto object-contain"
                  />
                  <span className="font-bold text-primary">SQ Agriculture</span>
                </Link>
              </div>
              <nav className="p-4 space-y-1">
                {adminNavItems.map((item) => renderNavItem(item))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 p-6 transition-all duration-300',
            isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
