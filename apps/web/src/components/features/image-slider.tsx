'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SliderSlide {
  image: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

interface ImageSliderProps {
  slides: SliderSlide[];
  autoPlay?: boolean;
  interval?: number;
  height?: string;
  showArrows?: boolean;
  showDots?: boolean;
}

export function ImageSlider({
  slides,
  autoPlay = true,
  interval = 5000,
  height = 'h-[70vh] min-h-[500px]',
  showArrows = true,
  showDots = true,
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (!autoPlay || isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, slides.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div
      className={`relative w-full ${height} overflow-hidden`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title || `Slide ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            {currentSlide.title && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
                {currentSlide.title}
              </h1>
            )}
            {currentSlide.subtitle && (
              <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in">
                {currentSlide.subtitle}
              </p>
            )}
            <div className="flex flex-wrap gap-4 animate-fade-in">
              {currentSlide.ctaText && currentSlide.ctaLink && (
                <Link href={currentSlide.ctaLink}>
                  <Button size="lg" className="bg-primary hover:bg-primary-dark text-white">
                    {currentSlide.ctaText}
                  </Button>
                </Link>
              )}
              {currentSlide.secondaryCtaText && currentSlide.secondaryCtaLink && (
                <Link href={currentSlide.secondaryCtaLink}>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                    {currentSlide.secondaryCtaText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center text-white"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Default hero slider data
export const heroSlides: SliderSlide[] = [
  {
    image: '/uploads/sliders/slider-1.jpg',
    title: "Empowering Bangladesh's Agricultural Future",
    subtitle: 'Your trusted partner for quality seeds, crop protection, and modern farming machinery',
    ctaText: 'Explore Products',
    ctaLink: '/products',
    secondaryCtaText: 'Contact Us',
    secondaryCtaLink: '/contact',
  },
  {
    image: '/uploads/sliders/slider-2.jpg',
    title: 'Premium Quality Seeds',
    subtitle: 'High-yielding hybrid varieties developed for Bangladesh climate and soil conditions',
    ctaText: 'View Seeds',
    ctaLink: '/products/seeds',
    secondaryCtaText: 'Learn More',
    secondaryCtaLink: '/services',
  },
  {
    image: '/uploads/sliders/slider-3.jpg',
    title: 'Modern Farming Machinery',
    subtitle: 'SQ Etian tractors and equipment for efficient agricultural operations',
    ctaText: 'View Machinery',
    ctaLink: '/products/field-machinery',
    secondaryCtaText: 'Contact Sales',
    secondaryCtaLink: '/contact',
  },
  {
    image: '/uploads/sliders/slider-4.jpg',
    title: 'Crop Protection Solutions',
    subtitle: 'Effective pesticides and micronutrients for healthier crops and better yields',
    ctaText: 'View Products',
    ctaLink: '/products/pesticide',
  },
  {
    image: '/uploads/sliders/slider-5.jpg',
    title: 'Expert Agricultural Support',
    subtitle: 'Our team of agronomists is ready to help farmers across all 64 districts',
    ctaText: 'Get Support',
    ctaLink: '/contact',
  },
];
