import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Twitter, Youtube } from 'lucide-react';
import { NewsletterForm } from '@/components/features/newsletter-form';

interface FooterProps {
  locale?: string;
}

export function Footer({ locale = 'en' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white">
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/uploads/logo/Bended & Non-Bended SQ Agriculture Logo For Plate Design.png" 
                alt="SQ Agriculture" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              SQ Agriculture Ltd. is your trusted partner for quality seeds, crop protection, and modern farming machinery in Bangladesh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              Products
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/seeds" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Seeds
                </Link>
              </li>
              <li>
                <Link href="/products/fertilizers-micronutrients" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Fertilizers & Micronutrients
                </Link>
              </li>
              <li>
                <Link href="/products/pesticide" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Pesticides
                </Link>
              </li>
              <li>
                <Link href="/products/field-machinery" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Field Machinery
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors text-sm">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-accent" />
                <span className="text-gray-300 text-sm">9th Floor, Suvastu Suraiya Trade Center, 57 Kemal Ataturk Avenue, Banani, Dhaka-1213</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-accent" />
                <a href="tel:+8801321219223" className="text-gray-300 hover:text-white transition-colors text-sm">
                  +880 1321-219223
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-accent" />
                <a href="mailto:agriculture@sq-bd.com" className="text-gray-300 hover:text-white transition-colors text-sm">
                  agriculture@sq-bd.com
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <NewsletterForm variant="compact" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} SQ Agriculture Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
