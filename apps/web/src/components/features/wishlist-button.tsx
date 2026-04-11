'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

interface WishlistButtonProps {
  productId: string;
  isInWishlist?: boolean;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
}

export function WishlistButton({
  productId,
  isInWishlist = false,
  className,
  size = 'icon',
  variant = 'ghost',
}: WishlistButtonProps) {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const [isWishlisted, setIsWishlisted] = React.useState(isInWishlist);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsWishlisted(isInWishlist);
  }, [isInWishlist]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !token) {
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);

    try {
      if (isWishlisted) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/wishlist/${productId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setIsWishlisted(false);
        }
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/wishlist`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId }),
          }
        );

        if (response.ok) {
          setIsWishlisted(true);
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        'transition-all duration-200',
        isWishlisted && 'text-red-500 hover:text-red-600',
        !isWishlisted && 'text-gray-400 hover:text-red-500',
        className
      )}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={cn('h-5 w-5', size === 'sm' && 'h-4 w-4', size === 'lg' && 'h-6 w-6')}
        fill={isWishlisted ? 'currentColor' : 'none'}
      />
    </Button>
  );
}
