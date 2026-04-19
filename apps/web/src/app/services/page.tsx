'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Sprout, Droplets, Tractor, Phone, ArrowRight, CheckCircle, Beaker, Leaf } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ServicesPage() {

  const services = [
    {
      icon: Tractor,
      title: 'High-Performance Farm Machinery',
      description: 'Reliability is the backbone of a successful farm. We provide heavy-duty machinery engineered to handle the toughest terrains and the most demanding schedules.',
      features: [
        'Tractors & Harvesters: From compact utility tractors to high-capacity harvesters, we offer power and precision for every farm size',
        'Rotavators: Achieve the perfect soil tilth. Our rotavators ensure superior soil mixing and seedbed preparation',
        'Spray Machines: Advanced manual and automated sprayers designed for uniform coverage and minimal chemical waste',
      ],
      image: '/uploads/products/machinery/TT47.png',
    },
    {
      icon: Sprout,
      title: 'Premium Seeds for Every Season',
      description: 'A great harvest begins with superior genetics. Our seeds are selected for high germination rates, disease resistance, and climate adaptability.',
      features: [
        'Staple Crops: High-yielding Rice and Maize varieties optimized for regional soil types',
        'Vegetables: A wide selection of hybrid and heirloom seeds for commercial vegetable farming',
        'Quality certified seeds with high germination rates',
        'Expert guidance on seed selection for your specific land',
      ],
      image: '/uploads/products/Seeds.png',
    },
    {
      icon: Droplets,
      title: 'Crop Protection & Nutrition',
      description: 'Healthy plants need a balanced "diet" and a strong defense system. We provide the science-backed inputs required to keep your fields thriving.',
      features: [
        'Fertilizers: Essential NPK blends to fuel core plant growth and root development',
        'Micronutrients: Specialized Zinc, Boron, and Magnesium treatments to fix soil deficiencies',
        'Pesticides: Targeted solutions to eliminate pests while preserving your crop integrity',
        'Integrated pest management advice',
      ],
      image: '/uploads/products/SQ Fertilizer.png',
    },
  ];

  const whyChooseUs = [
    { icon: CheckCircle, text: 'Expert Guidance: Our team provides on-ground support to help you choose the right machinery and inputs' },
    { icon: CheckCircle, text: 'Genuine Parts & Service: Authentic products with full manufacturer warranty' },
    { icon: CheckCircle, text: 'Competitive pricing with flexible payment options' },
    { icon: CheckCircle, text: 'Technical support & farmer training programs' },
    { icon: CheckCircle, text: 'Home delivery available across Bangladesh' },
    { icon: CheckCircle, text: '24/7 customer support for urgent needs' },
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
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-700/70" />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Empowering Your Farm from Seed to Harvest</h1>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              At SQ Agriculture Ltd, we don't just sell products; we partner with you to ensure every season is more productive than the last. Whether you are prepping the soil, protecting your crop, or bringing in the harvest, our comprehensive suite of agricultural solutions is designed to maximize your yield and minimize your downtime.
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
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                      <service.icon className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/products">
                      <Button className="bg-green-600 hover:bg-green-700">
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
                      className="object-contain bg-gray-50"
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
                "Modern farming requires more than just hard work—it requires the right technology and the right chemistry."
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {whyChooseUs.map((item, index) => (
                <Card key={index} className="flex items-start gap-4">
                  <CardContent className="py-4 flex items-start gap-4 w-full">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-700">{item.text}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-green-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farm?</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Our agricultural experts are ready to help you choose the right products and machinery for your farming needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-green-800 hover:bg-green-100 gap-2">
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