'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface BlogPost {
  id: string;
  title: string;
  titleBn?: string;
  slug: string;
  excerpt: string;
  excerptBn?: string;
  image?: string;
  author: string;
  authorImage?: string;
  category: string;
  tags?: string[];
  createdAt: string;
}

interface BlogCardProps {
  post: BlogPost;
  variant?: 'grid' | 'featured' | 'horizontal';
  className?: string;
  locale?: string;
}

export function BlogCard({ post, variant = 'grid', className, locale = 'en' }: BlogCardProps) {
  const isFeatured = variant === 'featured';
  const isHorizontal = variant === 'horizontal';

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <article
      className={cn(
        'group bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20',
        isFeatured && 'md:flex',
        isHorizontal && 'flex flex-col md:flex-row',
        className
      )}
    >
      {/* Image */}
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          'relative block overflow-hidden bg-gray-100',
          isFeatured ? 'w-full md:w-1/2 h-64 md:h-auto' : 'h-48',
          isHorizontal && 'w-full md:w-64 h-48'
        )}
      >
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={isFeatured ? '50vw' : '(max-width: 768px) 100vw, 33vw'}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <span className="text-4xl">📰</span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="text-xs shadow-sm">
            {post.category}
          </Badge>
        </div>
      </Link>

      {/* Content */}
      <div className={cn('p-5 flex flex-col', isFeatured && 'w-full md:w-1/2 p-6')}>
        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <time dateTime={post.createdAt}>
            {formatDate(post.createdAt)}
          </time>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{post.author}</span>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className={cn(
            'font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2',
            isFeatured ? 'text-2xl md:text-3xl' : 'text-lg'
          )}>
            {locale === 'bn' && post.titleBn ? post.titleBn : post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className={cn(
          'text-gray-600 mt-2 line-clamp-2',
          isFeatured && 'line-clamp-3'
        )}>
          {locale === 'bn' && post.excerptBn ? post.excerptBn : post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Read More */}
        <div className="mt-auto pt-4">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Read More
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

// Loading skeleton
export function BlogCardSkeleton({ variant = 'grid' }: { variant?: 'grid' | 'featured' }) {
  return (
    <div className={cn(
      'bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse',
      variant === 'featured' && 'md:flex'
    )}>
      <div className={cn(
        'bg-gray-200',
        variant === 'featured' ? 'w-full md:w-1/2 h-64' : 'h-48'
      )} />
      <div className="p-5">
        <div className="flex gap-3 mb-3">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}
