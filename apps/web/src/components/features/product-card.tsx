'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WishlistButton } from '@/components/features/wishlist-button';

export interface Product {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  description: string;
  price?: number;
  priceUnit?: string;
  images: string[];
  category?: {
    name: string;
    type: string;
  };
  featured?: boolean;
  inStock?: boolean;
  isInWishlist?: boolean;
}

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
  className?: string;
  locale?: string;
}

export function ProductCard({ product, variant = 'grid', className, locale = 'en' }: ProductCardProps) {
  const isList = variant === 'list';
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);

  const formatPrice = (price: number, unit?: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    return unit ? `${formatted}/${unit}` : formatted;
  };

  return (
    <article
      className={cn(
        'group bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20',
        isList && 'flex flex-col md:flex-row',
        className
      )}
    >
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          'relative block overflow-hidden bg-gray-100',
          isList ? 'w-full md:w-64 h-48 md:h-auto' : 'aspect-square'
        )}
      >
        <Image
          src={product.images?.[0] || '/placeholder-product.jpg'}
          alt={locale === 'bn' && product.nameBn ? product.nameBn : product.name}
          fill
          className={cn(
            'object-cover transition-transform duration-500 group-hover:scale-110',
            !isImageLoaded && 'animate-pulse'
          )}
          onLoad={() => setIsImageLoaded(true)}
          sizes={isList ? '256px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <Badge variant="secondary" className="text-xs">
              Featured
            </Badge>
          )}
          {product.category && (
            <Badge variant="outline" className="text-xs bg-white/90 backdrop-blur-sm">
              {product.category.name}
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-2 right-2">
          <WishlistButton productId={product.id} isInWishlist={product.isInWishlist} />
        </div>
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className={cn('flex flex-col', isList && 'flex-1 md:flex-row')}>
        <div className={cn('p-4 flex-1', isList && 'md:p-6')}>
          <Link href={`/products/${product.slug}`}>
            <h3 className={cn(
              'font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2',
              isList ? 'text-lg md:text-xl' : 'text-base'
            )}>
              {locale === 'bn' && product.nameBn ? product.nameBn : product.name}
            </h3>
          </Link>
          
          <p className={cn(
            'text-gray-600 mt-2 line-clamp-2',
            isList ? 'text-sm md:text-base' : 'text-sm'
          )}>
            {product.description}
          </p>

          {/* Specs preview for list view */}
          {isList && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                Category: {product.category?.name}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={cn(
          'p-4 border-t border-gray-100 flex items-center justify-between',
          isList && 'md:border-t-0 md:border-l md:w-48'
        )}>
          {product.price ? (
            <div className="flex flex-col">
              <span className={cn(
                'font-bold text-primary',
                isList ? 'text-xl' : 'text-lg'
              )}>
                {formatPrice(product.price, product.priceUnit)}
              </span>
            </div>
          ) : (
            <a 
              href="tel:+8801711111111" 
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span className="hidden sm:inline">Call for price</span>
            </a>
          )}
          
          <Link href={`/products/${product.slug}`}>
            <Button variant={isList ? 'outline' : 'default'} size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

// Loading skeleton
export function ProductCardSkeleton({ variant = 'grid' }: { variant?: 'grid' | 'list' }) {
  const isList = variant === 'list';
  
  return (
    <div className={cn(
      'bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse',
      isList && 'flex'
    )}>
      <div className={cn(
        'bg-gray-200',
        isList ? 'w-64 h-48' : 'aspect-square'
      )} />
      <div className="p-4 flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-4" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}
