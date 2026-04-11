'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCreateInquiry } from '@/hooks/use-inquiries';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  company: z.string().optional(),
  userType: z.enum(['FARMER', 'DEALER', 'CORPORATE', 'OTHER']),
  productInterest: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createInquiry = useCreateInquiry();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await createInquiry.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        source: 'contact',
        productInterest: data.productInterest,
        userType: data.userType,
        company: data.company,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      value: '123 Agricultural Lane, Dhaka, Bangladesh',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+880 1700-000000',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'info@sqagriculture.com',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Saturday - Thursday: 9AM - 6PM',
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <Card className="max-w-md mx-4 text-center">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for contacting us. We will get back to you within 24 hours.
              </p>
              <Button onClick={() => {
                setIsSubmitted(false);
                reset();
              }}>
                Send Another Message
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        <section className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-white/80">
              Get in touch with our team for inquiries and support
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="flex items-start gap-4 pt-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="mt-6">
                  <CardContent className="p-0 h-48 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500">Map Location</span>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            placeholder="Your full name"
                            {...register('name')}
                            className={cn(errors.name && 'border-red-500')}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            {...register('email')}
                            className={cn(errors.email && 'border-red-500')}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            placeholder="+880 1XXX-XXXXXX"
                            {...register('phone')}
                            className={cn(errors.phone && 'border-red-500')}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input id="company" placeholder="Your company (optional)" {...register('company')} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>I am a *</Label>
                          <Select
                            onValueChange={(value) => setValue('userType', value as ContactFormData['userType'])}
                            defaultValue={watch('userType')}
                          >
                            <SelectTrigger className={cn(errors.userType && 'border-red-500')}>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FARMER">Farmer</SelectItem>
                              <SelectItem value="DEALER">Dealer / Distributor</SelectItem>
                              <SelectItem value="CORPORATE">Corporate Buyer</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.userType && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.userType.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="productInterest">Product Interest</Label>
                          <Input
                            id="productInterest"
                            placeholder="e.g., Rice Seeds, Tractors"
                            {...register('productInterest')}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          rows={5}
                          placeholder="How can we help you?"
                          {...register('message')}
                          className={cn(errors.message && 'border-red-500')}
                        />
                        {errors.message && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.message.message}
                          </p>
                        )}
                      </div>

                      <Button type="submit" size="lg" className="w-full" disabled={createInquiry.isPending}>
                        {createInquiry.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
