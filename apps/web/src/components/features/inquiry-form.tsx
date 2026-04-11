'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCreateInquiry } from '@/hooks/use-inquiries';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  company: z.string().optional(),
  userType: z.enum(['FARMER', 'DEALER', 'CORPORATE', 'OTHER']),
  productInterest: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  productId?: string;
  productName?: string;
  onSuccess?: (data: InquiryFormData) => void;
  onError?: (error: string) => void;
  className?: string;
  showProductInterest?: boolean;
  variant?: 'standalone' | 'embedded';
}

export function InquiryForm({
  productId,
  productName,
  onSuccess,
  onError,
  className,
  showProductInterest = true,
  variant = 'standalone',
}: InquiryFormProps) {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const createInquiry = useCreateInquiry();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      productInterest: productName,
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    try {
      await createInquiry.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        source: productId ? 'product' : 'website',
        productInterest: data.productInterest || productName,
        userType: data.userType,
        company: data.company,
      });
      
      setIsSuccess(true);
      onSuccess?.(data);
      
      setTimeout(() => {
        setIsSuccess(false);
        reset();
      }, 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit inquiry. Please try again.';
      onError?.(message);
    }
  };

  if (isSuccess) {
    return (
      <Card className={cn('text-center', className)}>
        <CardContent className="pt-8 pb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Inquiry Submitted!
          </h3>
          <p className="text-gray-600">
            Thank you for your interest. Our team will contact you within 24 hours.
          </p>
        </CardContent>
      </Card>
    );
  }

  const content = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            {...register('name')}
            className={cn(errors.name && 'border-red-500')}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className={cn(errors.email && 'border-red-500')}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+880 1XXX-XXXXXX"
            {...register('phone')}
            className={cn(errors.phone && 'border-red-500')}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>I am a *</Label>
          <Select
            onValueChange={(value) => setValue('userType', value as InquiryFormData['userType'])}
            defaultValue={watch('userType')}
          >
            <SelectTrigger className={cn(errors.userType && 'border-red-500')}>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FARMER">Farmer</SelectItem>
              <SelectItem value="DEALER">Dealer / Distributor</SelectItem>
              <SelectItem value="CORPORATE">Corporate Buyer</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.userType && (
            <p className="text-red-500 text-sm">{errors.userType.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company Name</Label>
        <Input
          id="company"
          placeholder="Your company name (optional)"
          {...register('company')}
        />
      </div>

      {showProductInterest && (
        <div className="space-y-2">
          <Label htmlFor="productInterest">Product Interest</Label>
          <Input
            id="productInterest"
            placeholder="e.g., Rice Seeds, Tractors"
            {...register('productInterest')}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">Your Message *</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder="Tell us about your requirements..."
          {...register('message')}
          className={cn(errors.message && 'border-red-500')}
        />
        {errors.message && (
          <p className="text-red-500 text-sm">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={createInquiry.isPending}
      >
        {createInquiry.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            Submit Inquiry
            <Send className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By submitting this form, you agree to our privacy policy and terms of service.
      </p>
    </form>
  );

  if (variant === 'embedded') {
    return content;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Send an Inquiry</CardTitle>
        <CardDescription>
          Fill out the form below and our team will get back to you shortly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}
