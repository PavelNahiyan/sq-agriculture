import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Facebook, Twitter, Youtube } from 'lucide-react';
import { NewsletterForm } from '@/components/features/newsletter-form';

interface FooterProps {
  locale?: string;
}

export function Footer({ locale = 'en' }: FooterProps) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white">
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
              {t('aboutText')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {tNav('products')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {tNav('services')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {tNav('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {tNav('products')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/seeds" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Seeds
                </Link>
              </li>
              <li>
                <Link href="/products/fertilizer" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Fertilizers
                </Link>
              </li>
              <li>
                <Link href="/products/pesticide" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Pesticides
                </Link>
              </li>
              <li>
                <Link href="/products/micronutrients" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Micronutrients
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
            <h3 className="font-semibold text-lg mb-4">{t('contactInfo')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-accent" />
                <span className="text-gray-300 text-sm">{t('address')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-accent" />
                <a href="tel:+8801711111111" className="text-gray-300 hover:text-white transition-colors text-sm">
                  +880 1711 111111
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-accent" />
                <a href="mailto:info@sqagriculture.com" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('email')}
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
            {t('copyright').replace('2024', currentYear.toString())}
          </p>
        </div>
      </div>
    </footer>
  );
}
