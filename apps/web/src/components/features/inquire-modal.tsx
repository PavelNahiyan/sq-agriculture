'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageCircle, X } from 'lucide-react';

interface InquireModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
}

export function InquireModal({
  open,
  onOpenChange,
  productName,
  contactEmail,
  contactPhone,
  contactWhatsApp,
}: InquireModalProps) {
  const defaultEmail = 'agriculture@sq-bd.com';
  const defaultPhone = '+880 1321-219223';
  const defaultWhatsApp = 'wa.me/8801321219223';

  const email = contactEmail || defaultEmail;
  const phone = contactPhone || defaultPhone;
  const whatsapp = contactWhatsApp || defaultWhatsApp;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inquire About: {productName}</DialogTitle>
          <DialogDescription>
            Contact us for pricing and more information about this product.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {email && (
            <a
              href={`mailto:${email}?subject=Inquiry about ${encodeURIComponent(productName)}`}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-500 truncate">{email}</p>
              </div>
            </a>
          )}

          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Phone</p>
                <p className="text-sm text-gray-500">{phone}</p>
              </div>
            </a>
          )}

          {whatsapp && (
            <a
              href={`https://${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                <p className="text-sm text-gray-500">Click to chat</p>
              </div>
            </a>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
