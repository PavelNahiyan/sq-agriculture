'use client';

export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { Target, Eye, Heart, Award, Users, Truck, Shield, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Quality',
      description: 'We ensure the highest quality products for our farmers',
    },
    {
      icon: Heart,
      title: 'Innovation',
      description: 'Continuously innovating to bring the best solutions',
    },
    {
      icon: Users,
      title: 'Partnership',
      description: 'Building lasting partnerships with our community',
    },
  ];

  const milestones = [
    { year: '2009', title: 'Company Founded', description: 'Started with a vision to transform Bangladeshi agriculture' },
    { year: '2012', title: 'Seed Division Launch', description: 'Introduced high-yielding seed varieties' },
    { year: '2015', title: 'Crop Protection Range', description: 'Expanded into pesticides and crop protection' },
    { year: '2018', title: 'Machinery Division', description: 'Started importing modern farming equipment' },
    { year: '2023', title: 'Digital Transformation', description: 'Launched online platform for easier access' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920"
              alt="Agricultural field"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/70" />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About SQ Agriculture</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Empowering Bangladeshi farmers with quality agricultural solutions since 2009
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-gray-600 leading-relaxed">
                    To provide high-quality agricultural products and services that empower farmers to achieve sustainable and profitable harvests while contributing to Bangladesh's food security.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-secondary">
                <CardContent className="pt-8">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                    <Eye className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                  <p className="text-gray-600 leading-relaxed">
                    To become the most trusted agricultural solutions provider in South Asia, known for quality, innovation, and commitment to farmer success.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
              <p className="text-gray-600">Over 15 years of serving Bangladeshi agriculture</p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200" />

                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center mb-8 ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                      <Card className={index % 2 === 0 ? 'border-r-4' : 'border-l-4'}>
                        <CardContent className="pt-4">
                          <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                          <h3 className="font-semibold mt-1">{milestone.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
                <div className="text-white/80">Years Experience</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-white/80">Products</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
                <div className="text-white/80">Happy Farmers</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">64</div>
                <div className="text-white/80">Districts</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Want to Partner With Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Join our network of dealers and distributors to bring quality agricultural products to farmers across Bangladesh.
            </p>
            <Link href="/contact">
              <Button size="lg">Get In Touch</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
