import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const heroSlides = [
  {
    title: "Empowering Bangladesh's Agricultural Future",
    titleBn: "বাংলাদেশের কৃষি ভবিষ্যৎকে শক্তিশালী করা",
    subtitle: 'Your trusted partner for quality seeds, crop protection, and modern farming machinery',
    subtitleBn: 'মানসম্পন্ন বীজ, ফসলের সুরক্ষা এবং আধুনিক কৃষি যন্ত্রপাতির জন্য আপনার বিশ্বস্ত পার্টনার',
    image: '/images/covers/473546243_1328526098139120_5848044727393588155_n.jpg',
    ctaText: 'Explore Products',
    ctaLink: '/products',
    order: 0,
    isActive: true,
    backgroundColor: '#2D5016',
    textColor: '#FFFFFF',
    overlayOpacity: 0.5,
  },
  {
    title: 'Premium Quality Seeds',
    titleBn: 'অত্যুচ মানের বীজ',
    subtitle: 'High-yielding hybrid varieties developed for Bangladesh climate and soil conditions',
    subtitleBn: 'বাংলাদেশের জলবাযু এবং মাটির অবস্থার জন্য উন্নত ফলনশীল সঙ্কর জাত',
    image: '/images/covers/469237652_556981607255908_9098269552307256399_n.jpg',
    ctaText: 'View Seeds',
    ctaLink: '/products/seeds',
    order: 1,
    isActive: true,
    backgroundColor: '#1A3009',
    textColor: '#FFFFFF',
    overlayOpacity: 0.4,
  },
  {
    title: 'Modern Farming Machinery',
    titleBn: 'আধুনিক কৃষি যন্ত্রপাতি',
    subtitle: 'SQ Etian tractors and equipment for efficient agricultural operations',
    subtitleBn: 'দক্ষ কৃষি কার্যক্রমের জন্য SQ এতিয়ান ট্রাক্টর এবং সরঞ্জাম',
    image: '/images/covers/harvestor cvr.jpg',
    ctaText: 'View Machinery',
    ctaLink: '/products/field-machinery',
    order: 2,
    isActive: true,
    backgroundColor: '#4A7C23',
    textColor: '#FFFFFF',
    overlayOpacity: 0.4,
  },
  {
    title: 'Expert Agricultural Support',
    titleBn: 'বিশেষজ্ঞ কৃষি সহায়তা',
    subtitle: 'Our team of agronomists is ready to help farmers across all 64 districts',
    subtitleBn: 'সকল ৬জেলার কৃষকদের সাহায্য করতে আমাদের কৃষিবিদদের দল প্রস্তুত',
    image: '/images/covers/tractor cover4.jpg',
    ctaText: 'Get Support',
    ctaLink: '/contact',
    order: 3,
    isActive: true,
    backgroundColor: '#2D5016',
    textColor: '#FFFFFF',
    overlayOpacity: 0.5,
  },
];

async function main() {
  console.log('Seeding hero slides...');
  
  for (const slide of heroSlides) {
    const existing = await prisma.heroSlide.findFirst({
      where: { title: slide.title },
    });
    
    if (!existing) {
      await prisma.heroSlide.create({
        data: slide,
      });
      console.log(`Created slide: ${slide.title}`);
    } else {
      console.log(`Slide already exists: ${slide.title}`);
    }
  }
  
  console.log('Hero slides seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
