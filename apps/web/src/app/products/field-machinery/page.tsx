'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useProducts } from '@/hooks/use-products';
import { useServiceSettings } from '@/hooks/use-service-settings';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Tractor, Cog, Settings, Phone, Mail, MapPin, Package, Wrench, Clock, Menu, X } from 'lucide-react';

const SECTIONS = [
  { id: 'tractors', label: 'Tractors', icon: Tractor, color: 'text-green-600' },
  { id: 'harvestors', label: 'Harvestors', icon: Cog, color: 'text-amber-600' },
  { id: 'rotavators', label: 'Rotavators', icon: Settings, color: 'text-green-600' },
  { id: 'spray-machines', label: 'Spray Machines', icon: Cog, color: 'text-blue-600' },
  { id: 'lubricants', label: 'SQ Lubricants', icon: Cog, color: 'text-yellow-600' },
  { id: 'replacement-parts', label: 'Spare Parts', icon: Package, color: 'text-orange-600' },
  { id: 'on-call-service', label: 'On Call Service', icon: Clock, color: 'text-purple-600' },
];

function ProductCard({ product, showPrice = true }: { product: any; showPrice?: boolean }) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 bg-gray-100">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-4"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Cog className="w-16 h-16 text-gray-300" />
          </div>
        )}
        {product.featured && (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
            Featured
          </span>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-green-600 font-bold text-xl mb-3">
          {showPrice ? 'Price On Request' : '৳' + (product.price?.toLocaleString() || 'Contact for Price')}
        </p>
        <Button asChild className="w-full">
          <Link href={`/products/${product.slug}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function ServiceCard({ icon: Icon, title, description, children, color }: { icon: any; title: string; description: string; children?: React.ReactNode; color: string }) {
  return (
    <Card className="border-2 border-gray-100 hover:border-gray-200 transition-colors">
      <CardContent className="p-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        {children}
      </CardContent>
    </Card>
  );
}

export default function FieldMachineryPage() {
  const [activeSection, setActiveSection] = useState('tractors');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { data: products, isLoading } = useProducts({ categoryType: 'MACHINERY', limit: 200 });
  const { data: lubricants } = useProducts({ categoryType: 'LUBRICANTS', limit: 50 });
  const { data: spareParts } = useProducts({ categoryType: 'SPARE_PARTS', limit: 50 });
  const { data: serviceSettings } = useServiceSettings();

  const fieldMachinery = products || [];
  const lubricantsProducts = lubricants || [];
  const sparePartsProducts = spareParts || [];
  
  const hotlinePhone = serviceSettings?.hotlinePhone || '+880 1321-219223';
  const whatsappLink = serviceSettings?.whatsapp ? `https://wa.me/${serviceSettings.whatsapp.replace(/\D/g, '')}` : 'https://wa.me/8801321219223';

  const tractors = fieldMachinery.filter(p => 
    p.category?.slug === 'tractors' ||
    p.name.toLowerCase().includes('tractor')
  );

  const harvestors = fieldMachinery.filter(p => 
    p.category?.slug === 'harvesting-machinery' ||
    p.name.toLowerCase().includes('harvester') || 
    p.name.toLowerCase().includes('combine') ||
    p.name.toLowerCase().includes('reaper') ||
    p.name.toLowerCase().includes('3037') ||
    p.name.toLowerCase().includes('zoomlion')
  );

  const rotavators = fieldMachinery.filter(p => 
    p.category?.slug === 'rotavators' ||
    p.name.toLowerCase().includes('rotavator')
  );

  const sprayMachines = fieldMachinery.filter(p => 
    p.category?.slug === 'spray-machines' ||
    p.name.toLowerCase().includes('sprayer') ||
    p.name.toLowerCase().includes('spray')
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -70% 0px' }
    );

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Sticky Navigation */}
      <nav className={`sticky top-16 z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="hidden md:flex items-center gap-1 overflow-x-auto">
              {SECTIONS.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeSection === id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t max-h-80 overflow-y-auto">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-gray-50"
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-1">
        {/* Banner - Green gradient border */}
        <div className="h-3 w-full bg-gradient-to-r from-green-900 via-green-600 to-green-900 shadow-lg" />

        {/* Hero Section with Cover Images as Slider */}
        <section className="relative h-[50vh] min-h-[300px] md:h-[60vh]">
          {/* Cover Images Background */}
          <div className="absolute inset-0">
            {['/uploads/covers/tractor cover4.jpg', '/uploads/covers/tractor covers.jpg', '/uploads/covers/harvestor cvr.jpg', '/uploads/covers/cover.jpg'].map((img, i) => (
              <Image 
                key={i}
                src={img}
                alt={`Field Machinery ${i + 1}`}
                fill
                className={`object-cover ${i === 0 ? 'opacity-30' : 'opacity-0'}`}
                priority={i === 0}
              />
            ))}
          </div>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-green-800/70 to-green-700/80" />
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 flex items-center h-full">
            <div className="max-w-3xl">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border-l-4 border-green-500">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  Field Machineries
                </h1>
                <p className="text-lg md:text-xl text-green-100 mb-6">
                  High-performance tractors, harvesters, and rotavators for efficient farming operations. 
                  Your trusted partner in agricultural excellence.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                    <Link href="#tractors">Tractors</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold">
                    <Link href="/products/service-spare-parts">View Services</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* Tractors Section */}
        <section id="tractors" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <Tractor className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl md:text-3xl font-bold">Tractors</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Powerful and reliable tractors from SQ Etian. From compact 32HP to heavy-duty 70HP models.
            </p>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-200 rounded-lg h-72 animate-pulse" />
                ))}
              </div>
            ) : tractors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {tractors.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Tractor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No tractors available</p>
              </div>
            )}
          </div>
        </section>

        {/* Harvestors Section */}
        <section id="harvestors" className="py-16 bg-amber-50 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <Cog className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl md:text-3xl font-bold">Harvestors & Combine Machines</h2>
            </div>
            <p className="text-gray-600 mb-8">
              High-efficiency harvestors for fast and safe crop harvesting. Advanced technology for minimum grain loss.
            </p>

            {harvestors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {harvestors.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Cog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No harvestors available</p>
              </div>
            )}
          </div>
        </section>

        {/* Rotavators Section */}
        <section id="rotavators" className="py-16 bg-gray-50 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl md:text-3xl font-bold">Rotavators & Tillage Equipment</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Quality rotavators for efficient soil preparation. Compatible with all major tractor brands.
            </p>

            {rotavators.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {rotavators.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No rotavators available</p>
              </div>
            )}
          </div>
        </section>

        {/* Spray Machines Section */}
        <section id="spray-machines" className="py-16 bg-blue-50 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <Cog className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl md:text-3xl font-bold">Spray Machines & Equipment</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Professional spray equipment for effective crop protection. Available in various capacities.
            </p>

            {sprayMachines.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sprayMachines.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Cog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No spray machines available</p>
              </div>
            )}
          </div>
        </section>

        {/* SQ Lubricants Section */}
        <section id="lubricants" className="py-16 bg-yellow-50 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <Cog className="w-8 h-8 text-yellow-600" />
              <h2 className="text-2xl md:text-3xl font-bold">SQ Lubricants</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Premium quality lubricants specially formulated for agricultural machinery.
            </p>

            {lubricantsProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {lubricantsProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Cog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No lubricants available</p>
                <Button asChild variant="outline">
                  <Link href="/products/service-spare-parts">View Lubricants Page</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Spare Parts Section */}
        <section id="replacement-parts" className="py-16 bg-orange-50 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-8 h-8 text-orange-600" />
              <h2 className="text-2xl md:text-3xl font-bold">Genuine Spare Parts</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Original equipment manufacturer (OEM) spare parts for all SQ agricultural machinery.
            </p>

            {sparePartsProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sparePartsProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No spare parts available</p>
                <Button asChild>
                  <Link href="/products/service-spare-parts">View All Spare Parts</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* On Call Service Section */}
        <section id="on-call-service" className="py-16 bg-purple-900 text-white scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-purple-400" />
              <h2 className="text-2xl md:text-3xl font-bold">On Call Service 24X7</h2>
            </div>
            <p className="text-purple-200 mb-8">
              Round-the-clock technical support and service for your machinery.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-purple-800 rounded-lg p-6">
                <Phone className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Hotline</h3>
                <p className="text-purple-200 text-sm mb-2">Available 24/7 for emergencies</p>
                <p className="font-semibold">{hotlinePhone}</p>
              </div>
              <div className="bg-purple-800 rounded-lg p-6">
                <Wrench className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Services</h3>
                <ul className="text-purple-200 text-sm space-y-1">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4" /> On-site repair</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Maintenance</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Technical support</li>
                </ul>
              </div>
              <div className="bg-purple-800 rounded-lg p-6">
                <MapPin className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Service Centers</h3>
                <p className="text-purple-200 text-sm">Authorized service points across Bangladesh</p>
                <p className="font-semibold mt-2">Dhaka, Chittagong, Khulna</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
                <a href={`tel:${hotlinePhone.replace(/\D/g, '')}`}>
                  <Phone className="w-4 h-4 mr-2" /> Call Now
                </a>
              </Button>
              <Button asChild size="lg" className="bg-green-500 hover:bg-green-600">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Phone className="w-4 h-4 mr-2" /> WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/products/service-spare-parts">
                  View Full Service <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose SQ */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose SQ Field Machinery?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Check, title: 'Genuine Parts', desc: 'All spare parts available' },
                { icon: Settings, title: 'Service Support', desc: 'Trained technicians' },
                { icon: Tractor, title: 'Easy Finance', desc: 'Flexible payment options' },
                { icon: Cog, title: 'Training', desc: 'Free operator training' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-gray-600 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-green-800 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Contact Our Machinery Experts</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-400" />
                    <span>+880 1321-219223</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-400" />
                    <span>agriculture@sq-bd.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-green-400" />
                    <span>Banani, Dhaka-1213</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-green-800 hover:bg-green-100">
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/products">All Products</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Products */}
        <section className="py-8 bg-gray-50 text-center">
          <Button asChild variant="outline">
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Products
            </Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
