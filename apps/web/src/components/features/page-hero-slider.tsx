'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface HeroSlide {
  image: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

interface PageHeroSliderProps {
  slides: HeroSlide[];
  interval?: number;
}

export function PageHeroSlider({ slides, interval = 5000 }: PageHeroSliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [isPaused, interval, slides.length]);

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index: number) => setCurrentIndex(index);

  if (!slides.length) return null;

  const current = slides[currentIndex];

  return (
    <div
      className="relative h-[50vh] sm:h-[60vh] md:h-[65vh] min-h-[320px] sm:min-h-[400px] md:min-h-[480px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="overflow-hidden">
              <h1
                key={`title-${currentIndex}`}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-slide-up"
              >
                {current.title}
              </h1>
            </div>
            {current.subtitle && (
              <p
                key={`sub-${currentIndex}`}
                className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/90 max-w-xl leading-relaxed animate-slide-up"
                style={{ animationDelay: '100ms' }}
              >
                {current.subtitle}
              </p>
            )}
            <div
              key={`cta-${currentIndex}`}
              className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8 animate-slide-up"
              style={{ animationDelay: '200ms' }}
            >
              {current.ctaText && current.ctaLink && (
                <Link href={current.ctaLink}>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-black/20 text-sm sm:text-base">
                    {current.ctaText}
                  </Button>
                </Link>
              )}
              {current.secondaryCtaText && current.secondaryCtaLink && (
                <Link href={current.secondaryCtaLink}>
                  <Button size="lg" variant="outline" className="border-2 border-white/70 text-white hover:bg-white/10 backdrop-blur-sm text-sm sm:text-base">
                    {current.secondaryCtaText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/25 transition-all flex items-center justify-center text-white border border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/25 transition-all flex items-center justify-center text-white border border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-6 sm:w-8' : 'bg-white/40 hover:bg-white/60 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const pageHeroSlides: Record<string, HeroSlide[]> = {
  seeds: [
    {
      image: '/uploads/sliders/slider-1.jpg',
      title: 'Premium Quality Seeds',
      subtitle: 'High-yielding hybrid and open-pollinated varieties developed for Bangladeshi climate and soil conditions',
      ctaText: 'Browse Seeds',
      ctaLink: '/products/seeds',
      secondaryCtaText: 'Learn More',
      secondaryCtaLink: '/services',
    },
    {
      image: '/uploads/covers/cover.jpg',
      title: 'Rice & Maize Varieties',
      subtitle: 'Certified seeds with high germination rates for staple crops including BRRI dhan, hybrid maize, and more',
      ctaText: 'View Rice Seeds',
      ctaLink: '/products/seeds',
    },
    {
      image: '/uploads/sliders/tormujer bichi.jpg',
      title: 'Hybrid Vegetable Seeds',
      subtitle: 'Extensive collection of hybrid vegetable seeds for commercial farmers across Bangladesh',
      ctaText: 'Explore Vegetables',
      ctaLink: '/products/seeds',
    },
  ],

  pesticide: [
    {
      image: '/uploads/covers/cover.jpg',
      title: 'Crop Protection Solutions',
      subtitle: 'Advanced insecticides, fungicides, and herbicides for maximum yield protection',
      ctaText: 'View Products',
      ctaLink: '/products/pesticide',
      secondaryCtaText: 'Contact Us',
      secondaryCtaLink: '/contact',
    },
    {
      image: '/uploads/sliders/slider-3.jpg',
      title: 'Effective Pest Control',
      subtitle: 'Targeted solutions to eliminate pests while preserving your crop integrity and soil health',
      ctaText: 'Explore Pesticides',
      ctaLink: '/products/pesticide',
    },
    {
      image: '/uploads/covers/649826280_940465142240884_5943911529541727990_n.jpg',
      title: 'Quality Assured Formulations',
      subtitle: 'Expert formulated crop protection chemicals tested for Bangladeshi agricultural conditions',
      ctaText: 'Learn More',
      ctaLink: '/products/pesticide',
    },
  ],

  fertilizers: [
    {
      image: '/uploads/covers/cover.jpg',
      title: 'Fertilizers & Micronutrients',
      subtitle: 'Complete plant nutrition solutions for optimal crop growth and maximum yield',
      ctaText: 'View Fertilizers',
      ctaLink: '/products/fertilizers-micronutrients',
      secondaryCtaText: 'Contact Sales',
      secondaryCtaLink: '/contact',
    },
    {
      image: '/uploads/sliders/slider-1.jpg',
      title: 'Essential NPK Blends',
      subtitle: 'High-quality Urea, TSP, MOP, DAP, and Gypsum to fuel core plant growth and root development',
      ctaText: 'Shop Now',
      ctaLink: '/products/fertilizers-micronutrients',
    },
    {
      image: '/uploads/covers/482320470_627521863535215_7134072551268263462_n.jpg',
      title: 'Specialized Micronutrients',
      subtitle: 'Zinc, Boron, and Magnesium treatments to fix soil deficiencies and boost crop health',
      ctaText: 'View Micronutrients',
      ctaLink: '/products/fertilizers-micronutrients',
    },
  ],

  machinery: [
    {
      image: '/uploads/covers/tractor covers.jpg',
      title: 'Agricultural Machinery',
      subtitle: 'Premium tractors, rotavators, and implements from trusted global brands for Bangladesh farming',
      ctaText: 'View Machinery',
      ctaLink: '/products/machinery',
      secondaryCtaText: 'Browse Tractors',
      secondaryCtaLink: '/products/field-machinery',
    },
    {
      image: '/uploads/covers/tractor cover 3.jpg',
      title: 'Power & Performance',
      subtitle: 'Heavy-duty machinery engineered to handle the toughest terrains and demanding schedules',
      ctaText: 'Explore Range',
      ctaLink: '/products/machinery',
    },
    {
      image: '/uploads/covers/harvestor cvr.jpg',
      title: 'SQ ETIAN Tractors',
      subtitle: 'Powerful and reliable tractors designed for maximum efficiency in Bangladeshi fields',
      ctaText: 'View ETIAN Range',
      ctaLink: '/products/field-machinery',
    },
  ],

  fieldMachinery: [
    {
      image: '/uploads/covers/tractor cover4.jpg',
      title: 'Field Machinery & Equipment',
      subtitle: 'Comprehensive range of tractors, harvesters, rotavators, and spray machines for modern farming',
      ctaText: 'View Tractors',
      ctaLink: '/products/field-machinery',
      secondaryCtaText: 'View Harvesters',
      secondaryCtaLink: '/products/field-machinery',
    },
    {
      image: '/uploads/sliders/slider-3.jpg',
      title: 'Modern Harvesting Solutions',
      subtitle: 'Advanced combine harvesters for fast, efficient crop harvesting with minimal grain loss',
      ctaText: 'Learn More',
      ctaLink: '/products/field-machinery',
    },
    {
      image: '/uploads/covers/tractor covers.jpg',
      title: 'Complete Farm Solutions',
      subtitle: 'From tractors to sprayers, we provide everything you need for a productive farming operation',
      ctaText: 'Contact Sales',
      ctaLink: '/contact',
    },
  ],

  preOwned: [
    {
      image: '/uploads/products/Tractor Specs.png',
      title: 'Certified Pre-Owned Machines',
      subtitle: 'Quality inspected tractors and harvesters at unbeatable prices with warranty coverage',
      ctaText: 'View Tractors',
      ctaLink: '/products/pre-owned-machines',
      secondaryCtaText: 'View Harvesters',
      secondaryCtaLink: '/products/pre-owned-machines',
    },
    {
      image: '/uploads/covers/harvestor cvr.jpg',
      title: 'Trusted & Tested Equipment',
      subtitle: 'Every pre-owned machine undergoes rigorous inspection and certification by our expert team',
      ctaText: 'Browse Inventory',
      ctaLink: '/products/pre-owned-machines',
    },
    {
      image: '/uploads/products/Etian SQTE.png',
      title: 'Affordable Farming Solutions',
      subtitle: 'Get premium machinery at affordable prices with financing options available',
      ctaText: 'Contact Us',
      ctaLink: '/contact',
    },
  ],

  services: [
    {
      image: '/uploads/sliders/slider-2.jpg',
      title: 'Comprehensive Agricultural Services',
      subtitle: 'Empowering your farm from seed to harvest with expert guidance and premium solutions',
      ctaText: 'Our Services',
      ctaLink: '/services',
      secondaryCtaText: 'Contact Experts',
      secondaryCtaLink: '/contact',
    },
    {
      image: '/uploads/sliders/slider-5.jpg',
      title: 'Expert Agronomic Support',
      subtitle: 'Our team of agricultural specialists provides on-ground support to help you maximize yields',
      ctaText: 'Get Support',
      ctaLink: '/contact',
    },
    {
      image: '/uploads/sliders/slider-4.jpg',
      title: 'Nationwide Service Network',
      subtitle: 'Service centers and spare parts available across all 64 districts of Bangladesh',
      ctaText: 'Find a Dealer',
      ctaLink: '/dealers',
    },
  ],

  about: [
    {
      image: '/uploads/sliders/slider-1.jpg',
      title: 'About SQ Agriculture Ltd.',
      subtitle: 'Empowering Bangladeshi farmers with quality agricultural solutions since 2009',
      ctaText: 'Our Mission',
      ctaLink: '/about',
      secondaryCtaText: 'Contact Us',
      secondaryCtaLink: '/contact',
    },
    {
      image: '/uploads/sliders/slider-5.jpg',
      title: 'Our Story',
      subtitle: 'From a small seed distributor to a leading agricultural solutions provider across Bangladesh',
      ctaText: 'Learn Our Story',
      ctaLink: '/about',
    },
    {
      image: '/uploads/covers/cover.jpg',
      title: 'Partnering for Growth',
      subtitle: 'Building lasting partnerships with farmers, dealers, and communities for a greener future',
      ctaText: 'Our Values',
      ctaLink: '/about',
    },
  ],

  contact: [
    {
      image: '/uploads/sliders/slider-2.jpg',
      title: 'Get In Touch',
      subtitle: 'We are here to help. Reach out to our team for inquiries, support, or partnership opportunities',
      ctaText: 'Send Message',
      ctaLink: '/contact',
      secondaryCtaText: 'Call Us',
      secondaryCtaLink: '/contact',
    },
    {
      image: '/uploads/sliders/slider-5.jpg',
      title: 'Visit Our Office',
      subtitle: '9th Floor, Suvastu Suraiya Trade Center, 57 Kemal Ataturk Avenue, Banani, Dhaka-1213',
      ctaText: 'Get Directions',
      ctaLink: '/contact',
    },
    {
      image: '/uploads/covers/cover.jpg',
      title: '24/7 Customer Support',
      subtitle: 'Our team is available to assist you with product inquiries, technical support, and after-sales service',
      ctaText: 'Contact Now',
      ctaLink: '/contact',
    },
  ],
};
