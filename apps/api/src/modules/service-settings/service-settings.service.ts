import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { UpdateServiceSettingsDto } from './dto';

const DEFAULT_SERVICE_FEATURES = [
  { title: 'On-site repair and maintenance', titleBn: 'অন সাইট মেরামত ও রক্ষণাবেক্ষণ', enabled: true },
  { title: 'Regular service schedules', titleBn: 'নিয়মিত সার্ভিস সময়সূচী', enabled: true },
  { title: 'Technical troubleshooting', titleBn: 'প্রযুক্তিগত সমস্যা সমাধান', enabled: true },
  { title: 'Operator training support', titleBn: 'অপারেটর প্রশিক্ষণ সহায়তা', enabled: true },
  { title: 'Genuine parts replacement', titleBn: 'অরিজিনাল পার্টস প্রতিস্থাপন', enabled: true },
];

const DEFAULT_SERVICE_CENTERS = [
  { city: 'Dhaka Service Center', cityBn: 'ঢাকা সার্ভিস সেন্টার', area: 'Banani, Dhaka-1213', areaBn: 'বনানী, ঢাকা-১২১৩', description: 'Primary service hub', descriptionBn: 'প্রাথমিক সার্ভিস হাব', enabled: true },
  { city: 'Chittagong Service Center', cityBn: 'চট্টগ্রাম সার্ভিস সেন্টার', area: 'Agrabad, Chittagong', areaBn: 'আগ্রাবাদ, চট্টগ্রাম', description: 'Eastern region support', descriptionBn: 'পূর্বাঞ্চলীয় অঞ্চল সহায়তা', enabled: true },
  { city: 'Khulna Service Center', cityBn: 'খুলনা সার্ভিস সেন্টার', area: 'Khulna Sadar', areaBn: 'খুলনা সদর', description: 'Southwest region support', descriptionBn: 'দক্ষিণ-পশ্চিম অঞ্চল সহায়তা', enabled: true },
];

@Injectable()
export class ServiceSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(): Promise<any> {
    let settings = await this.prisma.serviceSettings.findFirst();

    if (!settings) {
      settings = await this.prisma.serviceSettings.create({
        data: {
          hotlinePhone: '+880 1321-219223',
          whatsapp: '+8801321219223',
          email: 'service@sq-agriculture.com',
          isActive: true,
          heroTitle: 'Service & Spare Parts',
          heroTitleBn: 'সেবা ও খুঁটি',
          heroSubtitle: 'Comprehensive after-sales support for your agricultural machinery. Genuine parts, expert service, 24/7 support.',
          heroSubtitleBn: 'আপনার কৃষি যন্ত্রপাতির জন্য ব্যাপক বিক্রয়-পরবর্তী সহায়তা। আসল পার্টস, বিশেষজ্ঞ সেবা, ২৪/৭ সহায়তা।',
          lubricantsTitle: 'SQ Lubricants',
          lubricantsTitleBn: 'এসকিউ লুব্রিকেন্টস',
          lubricantsDescription: 'Premium quality lubricants specially formulated for agricultural machinery. Ensure optimal performance and extended engine life.',
          lubricantsDescriptionBn: 'কৃষি যন্ত্রপাতির জন্য বিশেষভাবে তৈরি প্রিমিয়াম মানের লুব্রিকেন্ট। সর্বোত্তম কর্মক্ষমতা এবং দীর্ঘায়ু নিশ্চিত করুন।',
          lubricantsEnabled: true,
          sparePartsTitle: 'Genuine Spare Parts',
          sparePartsTitleBn: 'অরিজিনাল খুঁটি',
          sparePartsDescription: 'Original equipment manufacturer (OEM) spare parts for all SQ agricultural machinery. Guaranteed quality and perfect fit.',
          sparePartsDescriptionBn: 'সমস্ত এসকিউ কৃষি যন্ত্রপাতির জন্য মূল যন্ত্র নির্মাতার (OEM) খুঁটি। নিশ্চিত মান এবং নিখুঁত ফিট।',
          sparePartsEnabled: true,
          serviceTitle: 'On Call Service 24X7',
          serviceTitleBn: 'যেকোনো সময় সেবা ২৪X৭',
          serviceDescription: 'Round-the-clock technical support and service for your machinery. Our expert team is always ready to assist you.',
          serviceDescriptionBn: 'আপনার যন্ত্রপাতির জন্য ঘড়ি-বেজা প্রযুক্তিগত সহায়তা এবং সেবা। আমাদের বিশেষজ্ঞ দল সব সময় আপনাকে সাহায্য করতে প্রস্তুত।',
          serviceEnabled: true,
          serviceFeatures: JSON.stringify(DEFAULT_SERVICE_FEATURES),
          serviceCenters: JSON.stringify(DEFAULT_SERVICE_CENTERS),
        },
      });
    }

    return settings;
  }

  async updateSettings(dto: UpdateServiceSettingsDto): Promise<any> {
    const existing = await this.prisma.serviceSettings.findFirst();

    const updateData: any = {};

    if (dto.hotlinePhone !== undefined) updateData.hotlinePhone = dto.hotlinePhone;
    if (dto.whatsapp !== undefined) updateData.whatsapp = dto.whatsapp;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.heroTitle !== undefined) updateData.heroTitle = dto.heroTitle;
    if (dto.heroTitleBn !== undefined) updateData.heroTitleBn = dto.heroTitleBn;
    if (dto.heroSubtitle !== undefined) updateData.heroSubtitle = dto.heroSubtitle;
    if (dto.heroSubtitleBn !== undefined) updateData.heroSubtitleBn = dto.heroSubtitleBn;
    if (dto.lubricantsTitle !== undefined) updateData.lubricantsTitle = dto.lubricantsTitle;
    if (dto.lubricantsTitleBn !== undefined) updateData.lubricantsTitleBn = dto.lubricantsTitleBn;
    if (dto.lubricantsDescription !== undefined) updateData.lubricantsDescription = dto.lubricantsDescription;
    if (dto.lubricantsDescriptionBn !== undefined) updateData.lubricantsDescriptionBn = dto.lubricantsDescriptionBn;
    if (dto.lubricantsEnabled !== undefined) updateData.lubricantsEnabled = dto.lubricantsEnabled;
    if (dto.sparePartsTitle !== undefined) updateData.sparePartsTitle = dto.sparePartsTitle;
    if (dto.sparePartsTitleBn !== undefined) updateData.sparePartsTitleBn = dto.sparePartsTitleBn;
    if (dto.sparePartsDescription !== undefined) updateData.sparePartsDescription = dto.sparePartsDescription;
    if (dto.sparePartsDescriptionBn !== undefined) updateData.sparePartsDescriptionBn = dto.sparePartsDescriptionBn;
    if (dto.sparePartsEnabled !== undefined) updateData.sparePartsEnabled = dto.sparePartsEnabled;
    if (dto.serviceTitle !== undefined) updateData.serviceTitle = dto.serviceTitle;
    if (dto.serviceTitleBn !== undefined) updateData.serviceTitleBn = dto.serviceTitleBn;
    if (dto.serviceDescription !== undefined) updateData.serviceDescription = dto.serviceDescription;
    if (dto.serviceDescriptionBn !== undefined) updateData.serviceDescriptionBn = dto.serviceDescriptionBn;
    if (dto.serviceEnabled !== undefined) updateData.serviceEnabled = dto.serviceEnabled;
    if (dto.serviceFeatures !== undefined) updateData.serviceFeatures = dto.serviceFeatures;
    if (dto.serviceCenters !== undefined) updateData.serviceCenters = dto.serviceCenters;

    if (existing) {
      return this.prisma.serviceSettings.update({
        where: { id: existing.id },
        data: updateData,
      });
    }

    return this.prisma.serviceSettings.create({
      data: {
        hotlinePhone: dto.hotlinePhone || '+880 1321-219223',
        whatsapp: dto.whatsapp || '+8801321219223',
        email: dto.email || 'service@sq-agriculture.com',
        isActive: dto.isActive ?? true,
        heroTitle: dto.heroTitle || 'Service & Spare Parts',
        heroTitleBn: dto.heroTitleBn || 'সেবা ও খুঁটি',
        heroSubtitle: dto.heroSubtitle || 'Comprehensive after-sales support for your agricultural machinery. Genuine parts, expert service, 24/7 support.',
        heroSubtitleBn: dto.heroSubtitleBn || 'আপনার কৃষি যন্ত্রপাতির জন্য ব্যাপক বিক্রয়-পরবর্তী সহায়তা। আসল পার্টস, বিশেষজ্ঞ সেবা, ২৪/৭ সহায়তা।',
        lubricantsTitle: dto.lubricantsTitle || 'SQ Lubricants',
        lubricantsTitleBn: dto.lubricantsTitleBn || 'এসকিউ লুব্রিকেন্টস',
        lubricantsDescription: dto.lubricantsDescription || 'Premium quality lubricants specially formulated for agricultural machinery.',
        lubricantsDescriptionBn: dto.lubricantsDescriptionBn || 'কৃষি যন্ত্রপাতির জন্য বিশেষভাবে তৈরি প্রিমিয়াম মানের লুব্রিকেন্ট।',
        lubricantsEnabled: dto.lubricantsEnabled ?? true,
        sparePartsTitle: dto.sparePartsTitle || 'Genuine Spare Parts',
        sparePartsTitleBn: dto.sparePartsTitleBn || 'অরিজিনাল খুঁটি',
        sparePartsDescription: dto.sparePartsDescription || 'Original equipment manufacturer (OEM) spare parts for all SQ agricultural machinery.',
        sparePartsDescriptionBn: dto.sparePartsDescriptionBn || 'সমস্ত এসকিউ কৃষি যন্ত্রপাতির জন্য মূল যন্ত্র নির্মাতার (OEM) খুঁটি।',
        sparePartsEnabled: dto.sparePartsEnabled ?? true,
        serviceTitle: dto.serviceTitle || 'On Call Service 24X7',
        serviceTitleBn: dto.serviceTitleBn || 'যেকোনো সময় সেবা ২৪X৭',
        serviceDescription: dto.serviceDescription || 'Round-the-clock technical support and service for your machinery.',
        serviceDescriptionBn: dto.serviceDescriptionBn || 'আপনার যন্ত্রপাতির জন্য ঘড়ি-বেজা প্রযুক্তিগত সহায়তা এবং সেবা।',
        serviceEnabled: dto.serviceEnabled ?? true,
        serviceFeatures: dto.serviceFeatures || JSON.stringify(DEFAULT_SERVICE_FEATURES),
        serviceCenters: dto.serviceCenters || JSON.stringify(DEFAULT_SERVICE_CENTERS),
      },
    });
  }
}