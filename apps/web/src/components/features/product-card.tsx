'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WishlistButton } from '@/components/features/wishlist-button';
import { InquireModal } from '@/components/features/inquire-modal';

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
  hidePrice?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
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
  const [showInquireModal, setShowInquireModal] = React.useState(false);

  const formatPrice = (price: number, unit?: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    return unit ? `${formatted}/${unit}` : formatted;
  };

  const showInquire = product.hidePrice === true;

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
          {showInquire ? (
            <Button 
              variant="default" 
              size="sm" 
              className="bg-primary hover:bg-primary-dark"
              onClick={() => setShowInquireModal(true)}
            >
              Inquire Now
            </Button>
          ) : product.price ? (
            <span className={cn(
              'font-bold text-primary',
              isList ? 'text-xl' : 'text-lg'
            )}>
              {formatPrice(product.price, product.priceUnit)}
            </span>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              className="bg-primary hover:bg-primary-dark"
              onClick={() => setShowInquireModal(true)}
            >
              Inquire Now
            </Button>
          )}
          
          <Link href={`/products/${product.slug}`}>
            <Button variant={isList ? 'outline' : 'default'} size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>

      <InquireModal
        open={showInquireModal}
        onOpenChange={setShowInquireModal}
        productName={product.name}
        contactEmail={product.contactEmail}
        contactPhone={product.contactPhone}
        contactWhatsApp={product.contactWhatsApp}
      />
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
