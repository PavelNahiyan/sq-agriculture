'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  glowColor?: string;
}

export function AnimatedCard({ children, className = '', href, glowColor = 'primary' }: AnimatedCardProps) {
  const cardContent = (
    <div className={`relative group transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-${glowColor} to-${glowColor}/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />
      <div className="relative bg-white dark:bg-gray-900 rounded-xl border-2 border-transparent group-hover:border-primary/50 transition-all duration-300">
        {children}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
}

export function FeatureCard({ icon, title, description, index = 0 }: FeatureCardProps) {
  return (
    <div 
      className="relative group p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
          <div className="text-primary">{icon}</div>
        </div>
        <h3 className="font-semibold text-lg mb-2 text-center group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-600 text-sm text-center">{description}</p>
      </div>
    </div>
  );
}