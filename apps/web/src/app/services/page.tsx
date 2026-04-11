'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Sprout, Droplets, Tractor, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ServicesPage() {
  const t = useTranslations();

  const services = [
    {
      icon: Sprout,
      title: 'Quality Seeds Supply',
      description: 'We provide high-yielding, disease-resistant seed varieties suitable for Bangladeshi climate and soil conditions.',
      features: [
        'BRRI & BARI recommended varieties',
        'Hybrid seeds for maximum yield',
        'Quality certified seeds',
        'Expert guidance on seed selection',
      ],
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    },
    {
      icon: Droplets,
      title: 'Crop Protection Solutions',
      description: 'Comprehensive range of pesticides, herbicides, and fungicides to protect your crops from pests and diseases.',
      features: [
        'Insecticides for pest control',
        'Herbicides for weed management',
        'Fungicides for disease control',
        'Integrated pest management advice',
      ],
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
    },
    {
      icon: Tractor,
      title: 'Agricultural Machinery',
      description: 'Modern farming equipment and machinery to improve efficiency and reduce labor costs.',
      features: [
        'Tractors (35-75 HP)',
        'Irrigation systems',
        'Harvesting equipment',
        'After-sales service & support',
      ],
      image: 'https://images.unsplash.com/photo-1605338198613-2c8c3b97c4bb?w=800',
    },
  ];

  const whyChooseUs = [
    { icon: CheckCircle, text: 'Genuine & certified products' },
    { icon: CheckCircle, text: 'Competitive pricing' },
    { icon: CheckCircle, text: 'Technical support & training' },
    { icon: CheckCircle, text: 'Home delivery available' },
    { icon: CheckCircle, text: 'Easy credit facility for dealers' },
    { icon: CheckCircle, text: '24/7 customer support' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920"
              alt="Agricultural field"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/70" />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('nav.services')}</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Comprehensive agricultural solutions to help you grow more, grow better
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="space-y-20">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/products">
                      <Button variant="outline">
                        View Products
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <div className={`relative h-80 rounded-lg overflow-hidden ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose SQ Agriculture?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We are committed to providing the best agricultural solutions to farmers across Bangladesh
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {whyChooseUs.map((item, index) => (
                <Card key={index} className="flex items-center gap-4">
                  <CardContent className="py-4 flex items-center gap-4 w-full">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Expert Advice?</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Our agricultural experts are ready to help you choose the right products for your farming needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Us
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
