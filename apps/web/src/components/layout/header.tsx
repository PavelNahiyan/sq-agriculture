'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const categoryLinks = [
  { href: '/products/seeds', label: 'Seeds', description: 'Premium quality seeds' },
  { href: '/products/fertilizers-micronutrients', label: 'Fertilizers & Micronutrients', description: 'Plant nutrition' },
  { href: '/products/pesticide', label: 'Pesticides', description: 'Crop protection' },
  { href: '/products/field-machinery', label: 'Field Machinery', description: 'Tractors & equipment' },
  { href: '/products/pre-owned-machines', label: 'Pre-Owned Machines', description: 'Certified used tractors & harvesters' },
  { href: '/products', label: 'All Products', description: 'View all products' },
];

interface HeaderProps {
  locale?: string;
  onLocaleChange?: (locale: string) => void;
}

export function Header({ locale = 'en', onLocaleChange }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products', hasDropdown: true },
    { href: '/promotional-offers', label: 'Promotional Offers' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/store-locator', label: 'Where to Buy' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-gradient-to-r from-[#2D5A27] via-[#2D5A27] to-[#2D5A27] shadow-md'
          : 'bg-gradient-to-r from-[#2D5A27] via-[#2D5A27] to-[#2D5A27]'
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/uploads/logo/Bended & Non-Bended SQ Agriculture Logo For Plate Design.png" 
              alt="SQ Agriculture" 
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              item.hasDropdown ? (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        'text-sm font-medium transition-colors hover:text-white flex items-center gap-1 text-white',
                        pathname?.startsWith('/products')
                          ? 'text-white'
                          : 'text-white/80'
                      )}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {categoryLinks.map((cat) => (
                      <DropdownMenuItem key={cat.href} asChild>
                        <Link href={cat.href} className="flex flex-col items-start py-2 cursor-pointer">
                          <span className="font-medium">{cat.label}</span>
                          <span className="text-xs text-gray-500">{cat.description}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-white',
                    pathname === item.href
                      ? 'text-white'
                      : 'text-white/80'
                  )}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-gray-600'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pl-4 flex flex-col gap-2 border-l-2 border-primary/20">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</span>
                {categoryLinks.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}