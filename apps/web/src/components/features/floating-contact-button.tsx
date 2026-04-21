'use client';

import * as React from 'react';
import { MessageCircle, Facebook, Mail, X, MessageSquare } from 'lucide-react';
import { useFloatingButtonSettings } from '@/hooks/use-floating-button';
import { cn } from '@/lib/utils';

export function FloatingContactButton() {
  const { data: settings, isLoading } = useFloatingButtonSettings();
  const [isOpen, setIsOpen] = React.useState(false);

  if (isLoading || !settings?.isEnabled) {
    return null;
  }

  const hasAnyOption = settings.showWhatsapp || settings.showFacebook || settings.showEmail;
  if (!hasAnyOption) {
    return null;
  }

  const handleWhatsAppClick = () => {
    if (settings.whatsapp) {
      const phone = settings.whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}`, '_blank');
    }
  };

  const handleFacebookClick = () => {
    if (settings.facebook) {
      window.open(settings.facebook, '_blank');
    }
  };

  const handleEmailClick = () => {
    if (settings.email) {
      window.open(`mailto:${settings.email}`, '_blank');
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-20 md:bottom-6 z-50 flex flex-col items-end gap-3",
        settings.position === 'bottom-left' ? "left-4 md:left-6 right-auto" : "right-4 md:right-6"
      )}
    >
      {/* Expanded Options */}
      <div
        className={cn(
          "flex flex-col gap-3 transition-all duration-300 origin-bottom-right",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {settings.showWhatsapp && settings.whatsapp && (
          <button
            onClick={handleWhatsAppClick}
            className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:bg-[#20BD5A] transition-all hover:scale-110"
            title="WhatsApp"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}

        {settings.showFacebook && settings.facebook && (
          <button
            onClick={handleFacebookClick}
            className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg hover:bg-[#0d65d9] transition-all hover:scale-110"
            title="Facebook"
          >
            <Facebook className="w-6 h-6" />
          </button>
        )}

        {settings.showEmail && settings.email && (
          <button
            onClick={handleEmailClick}
            className="w-12 h-12 rounded-full bg-[#2D5A27] text-white flex items-center justify-center shadow-lg hover:bg-[#3d7a34] transition-all hover:scale-110"
            title="Email"
          >
            <Mail className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#2D5A27] text-white flex items-center justify-center shadow-xl hover:bg-[#3d7a34] transition-all hover:scale-110 active:scale-95"
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <MessageSquare className="w-7 h-7" />
        )}
      </button>
    </div>
  );
}