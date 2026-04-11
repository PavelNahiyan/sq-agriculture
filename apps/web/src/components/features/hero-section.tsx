'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  overlay?: 'dark' | 'light' | 'gradient';
  height?: 'full' | 'large' | 'medium' | 'small';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  backgroundImage = '/uploads/products/Rice.png',
  overlay = 'gradient',
  height = 'large',
  align = 'center',
  className,
}: HeroSectionProps) {
  const heightClasses = {
    full: 'h-screen min-h-[600px]',
    large: 'h-[70vh] min-h-[500px]',
    medium: 'h-[50vh] min-h-[400px]',
    small: 'h-[35vh] min-h-[300px]',
  };

  const overlayClasses = {
    dark: 'bg-black/60',
    light: 'bg-white/40',
    gradient: 'bg-gradient-to-r from-primary-dark/90 to-primary/70',
  };

  const textAlignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <section className={cn('relative flex items-center justify-center overflow-hidden', heightClasses[height], className)}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Hero background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Overlay */}
      <div className={cn('absolute inset-0 z-10', overlayClasses[overlay])} />

      {/* Content */}
      <div className={cn(
        'relative z-20 container mx-auto px-4 flex flex-col w-full',
        textAlignClasses[align]
      )}>
        {/* Animated Badge */}
        <div className={cn(
          'mb-6 animate-fade-in',
          align === 'center' && 'mx-auto',
          align === 'right' && 'ml-auto'
        )}>
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20">
            🌾 SQ Agriculture Ltd.
          </span>
        </div>

        {/* Title */}
        <h1 className={cn(
          'text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight animate-slide-up',
          align === 'center' && 'max-w-4xl',
          align === 'left' && 'max-w-3xl'
        )}>
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className={cn(
            'mt-6 text-lg md:text-xl text-white/90 max-w-2xl animate-slide-up',
            align === 'center' && 'mx-auto text-center',
            align === 'left' && 'text-left'
          )}
          style={{ animationDelay: '100ms' }}>
            {subtitle}
          </p>
        )}

        {/* CTAs */}
        {(ctaText || secondaryCtaText) && (
          <div className={cn(
            'flex flex-col sm:flex-row gap-4 mt-8 animate-slide-up',
            align === 'center' && 'justify-center',
            align === 'left' && 'justify-start',
            align === 'right' && 'justify-end'
          )}
          style={{ animationDelay: '200ms' }}>
            {ctaText && ctaLink && (
              <Link href={ctaLink}>
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/20"
                >
                  {ctaText}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </Link>
            )}
            
            {secondaryCtaText && secondaryCtaLink && (
              <Link href={secondaryCtaLink}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  {secondaryCtaText}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      {height === 'full' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      )}
    </section>
  );
}

// Alternative: Product Showcase Hero
export function ProductHero({
  title,
  subtitle,
  image,
  categoryName,
}: {
  title: string;
  subtitle?: string;
  image?: string;
  categoryName?: string;
}) {
  return (
    <section className="relative h-[40vh] min-h-[300px] flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {image ? (
          <Image src={image} alt={title} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pb-12 text-white">
        {categoryName && (
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm mb-4">
            {categoryName}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-lg text-white/80 max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
