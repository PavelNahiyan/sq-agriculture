import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  // Create Categories
  const categories = [
    { name: 'Seeds', nameBn: 'বীজ', slug: 'seeds', type: 'SEEDS', image: '/uploads/products/Seeds.png' },
    { name: 'Fertilizers', nameBn: 'সার', slug: 'fertilizer', type: 'FERTILIZERS', image: '/uploads/products/SQ Fertilizer.png' },
    { name: 'Pesticides', nameBn: 'কীটনাশক', slug: 'pesticide', type: 'PESTICIDES', image: '/uploads/products/pesticide/Dtuch.png' },
    { name: 'Micronutrients', nameBn: 'মাইক্রোনিউট্রিয়েন্টস', slug: 'micronutrients', type: 'MICRONUTRIENTS', image: '/uploads/products/SQ Fertilizer.png' },
    { name: 'Tractors', nameBn: 'ট্র্যাক্টর', slug: 'tractors', type: 'MACHINERY', image: '/uploads/products/machinery/TT47.png' },
    { name: 'Harvesters', nameBn: 'হারভেস্টার', slug: 'harvesters', type: 'MACHINERY', image: '/uploads/products/machinery/Zoomlion.png' },
    { name: 'Rotavators', nameBn: 'রোটাভেটর', slug: 'rotavators', type: 'MACHINERY', image: '/uploads/products/machinery/Rotavator.png' },
    { name: 'Lubricants', nameBn: 'লুব্রিকেন্ট', slug: 'lubricants', type: 'LUBRICANTS', image: '/uploads/products/lube/Tractor Pro Engine Oil.png' },
  ];

  const createdCategories: Record<string, string> = {};

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }

  // Create Products
  const products = [
    // Seeds (17 products)
    { name: 'SQ King (July)', slug: 'sq-king-july', description: 'Premium quality hybrid seeds for July planting season. High-yielding variety developed for Bangladesh climate.', categorySlug: 'seeds', image: '/uploads/products/seed/SQ King-July.png', featured: true },
    { name: 'Pilot (March)', slug: 'pilot-march', description: 'High-yielding seed variety perfect for March planting. Developed for optimal growth in Bangladesh.', categorySlug: 'seeds', image: '/uploads/products/seed/Pilot-Mar.png', featured: true },
    { name: 'P2 Seeds', slug: 'p2-seeds', description: 'Premium quality P2 variety seeds for better harvest.', categorySlug: 'seeds', image: '/uploads/products/seed/P2.png' },
    { name: 'P3 Seeds', slug: 'p3-seeds', description: 'High-quality P3 hybrid seeds for maximum yield.', categorySlug: 'seeds', image: '/uploads/products/seed/P3.png' },
    { name: 'P6 Seeds', slug: 'p6-seeds', description: 'P6 variety seeds with excellent disease resistance.', categorySlug: 'seeds', image: '/uploads/products/seed/P6.png' },
    { name: 'P8 Seeds', slug: 'p8-seeds', description: 'Premium P8 seeds for commercial farming.', categorySlug: 'seeds', image: '/uploads/products/seed/P8.png' },
    { name: 'P9 Seeds', slug: 'p9-seeds', description: 'High-yielding P9 variety seeds.', categorySlug: 'seeds', image: '/uploads/products/seed/P9.png' },
    { name: 'P10 Seeds', slug: 'p10-seeds', description: 'Premium P10 hybrid seeds for better crop.', categorySlug: 'seeds', image: '/uploads/products/seed/P10.png' },
    { name: 'P11 Seeds', slug: 'p11-seeds', description: 'P11 variety seeds with superior quality.', categorySlug: 'seeds', image: '/uploads/products/seed/P11.png' },
    { name: 'Ononna (May)', slug: 'ononna-may', description: 'Seasonal vegetable seeds for May planting.', categorySlug: 'seeds', image: '/uploads/products/seed/Ononna-May.png' },
    { name: 'Millenium (Feb)', slug: 'millenium-feb', description: 'Millenium variety seeds for February planting.', categorySlug: 'seeds', image: '/uploads/products/seed/Millenium-Feb.png' },
    { name: 'King Kumra', slug: 'king-kumra', description: 'Premium pumpkin seeds for high yield.', categorySlug: 'seeds', image: '/uploads/products/seed/King Kumra.png' },
    { name: 'Hybrid Rice (Nov)', slug: 'hybrid-rice-nov', description: 'High-quality hybrid rice seeds for November planting.', categorySlug: 'seeds', image: '/uploads/products/seed/Hybrid Rice-Nov.png' },
    { name: 'Green Queen (Sep)', slug: 'green-queen-sep', description: 'Premium leafy vegetable seeds for September.', categorySlug: 'seeds', image: '/uploads/products/seed/Green Queen-Sep.png' },
    { name: 'Green Magic (Aug)', slug: 'green-magic-aug', description: 'High-yielding vegetable seeds for August.', categorySlug: 'seeds', image: '/uploads/products/seed/Green Magic-Aug.png' },
    { name: 'Corns (Oct)', slug: 'corns-oct', description: 'Premium corn seeds for October planting.', categorySlug: 'seeds', image: '/uploads/products/seed/Corns-Oct.png' },
    { name: 'Captain (June)', slug: 'captain-june', description: 'Captain variety seeds for June planting season.', categorySlug: 'seeds', image: '/uploads/products/seed/Captain-June.png' },
    { name: 'Agnila (Jan)', slug: 'agnila-jan', description: 'Quality seeds for January planting.', categorySlug: 'seeds', image: '/uploads/products/seed/Agnila-Jan.png' },

    // Pesticides (8 products)
    { name: 'Dtuch Herbicide', slug: 'dtuch-herbicide', description: 'Effective weed control herbicide for crops.', categorySlug: 'pesticide', image: '/uploads/products/pesticide/Dtuch.png', featured: true },
    { name: 'Keyazate Fungicide', slug: 'keyazate-fungicide', description: 'Professional disease control fungicide.', categorySlug: 'pesticide', image: '/uploads/products/pesticide/keyazate.png' },
    { name: 'Keyaton Insecticide', slug: 'keyaton-insecticide', description: 'Powerful pest control insecticide.', categorySlug: 'pesticide', image: '/uploads/products/pesticide/keyaton.png' },
    { name: 'Keyatov Insecticide', slug: 'keyatov-insecticide', description: 'Advanced formula insecticide for crop protection.', categorySlug: 'pesticide', image: '/uploads/products/pesticide/keyatov.png' },
    { name: 'Mantasha Herbicide', slug: 'mantasha-herbicide', description: 'Effective weed control solution.', categorySlug: 'pesticide', image: '/uploads/products/pesticide/Mantasha.png' },
    { name: 'Pango Pesticide', slug: 'pango-pesticide', description: 'Complete crop protection solution.', categorySlug: 'pesticide', image: '/uploads/products/pesticide/Pango PNG.png' },
    { name: 'Real Sprayer', slug: 'real-sprayer', description: 'Professional agricultural sprayer equipment.', categorySlug: 'pesticide', image: '/uploads/products/pesticide/Real Sprayer PNG 1.png' },
    { name: 'Real Sprayers Set', slug: 'real-sprayers-set', description: 'Complete sprayer set for farm applications.', categorySlug: 'pesticide', image: '/uploads/products/pesticide/Real Sprayers PNG 2.png' },

    // Machinery - Tractors (4 products)
    { name: 'SQ ETIAN TT47 Tractor', slug: 'sq-etian-tt47', description: '47HP compact tractor perfect for small to medium farms. Fuel efficient with advanced features.', categorySlug: 'tractors', image: '/uploads/products/machinery/TT47.png', featured: true, price: 850000 },
    { name: 'SQ ETIAN TT55 Tractor', slug: 'sq-etian-tt55', description: '55HP versatile tractor for medium farms. Excellent power and reliability.', categorySlug: 'tractors', image: '/uploads/products/machinery/TT55.png', featured: true, price: 950000 },
    { name: 'SQ ETIAN TT70 Tractor', slug: 'sq-etian-tt70', description: '70HP heavy-duty tractor for large farms. Maximum power and efficiency.', categorySlug: 'tractors', image: '/uploads/products/machinery/TT70.png', featured: true, price: 1200000 },
    { name: 'SQ ETIAN TCT-3230', slug: 'sq-etian-tct-3230', description: '32HP compact tractor for small farms and gardens. Easy to operate.', categorySlug: 'tractors', image: '/uploads/products/machinery/Tct-3230.png', price: 650000 },

    // Machinery - Others (6 products)
    { name: 'TT3.50 Compact Tractor', slug: 'tt3-50', description: 'Compact tractor for specialized farming tasks.', categorySlug: 'tractors', image: '/uploads/products/machinery/TT3.50.png' },
    { name: '3037 Harvester', slug: '3037-harvester', description: 'Efficient combine harvester for wheat and rice.', categorySlug: 'harvesters', image: '/uploads/products/machinery/3037.png', featured: true },
    { name: 'Zoomlion Harvester', slug: 'zoomlion-harvester', description: 'Professional harvesting machine for commercial farms.', categorySlug: 'harvesters', image: '/uploads/products/machinery/Zoomlion.png' },
    { name: 'Rotavator', slug: 'rotavator', description: 'High-quality rotavator for efficient soil preparation.', categorySlug: 'rotavators', image: '/uploads/products/machinery/Rotavator.png', featured: true },
    { name: 'Fieldking Implement', slug: 'fieldking-implement', description: 'Professional farm implement for various tasks.', categorySlug: 'rotavators', image: '/uploads/products/machinery/Fieldking.png' },
    { name: 'ETIAN SQTE', slug: 'etian-sqte', description: 'Specialized SQ ETIAN equipment for modern farming.', categorySlug: 'tractors', image: '/uploads/products/machinery/Etian SQTE.png' },

    // Lubricants (6 products)
    { name: 'Tractor Pro Engine Oil', slug: 'tractor-pro-engine-oil', description: 'Premium engine oil for tractors. Maximum protection and performance.', categorySlug: 'lubricants', image: '/uploads/products/lube/Tractor Pro Engine Oil.png', featured: true },
    { name: 'Harvester Pro Engine Oil', slug: 'harvester-pro-engine-oil', description: 'Specialized engine oil for harvesters.', categorySlug: 'lubricants', image: '/uploads/products/lube/Harvester Pro Engine Oil.png' },
    { name: 'Tractor Transmission Oil', slug: 'tractor-transmission-oil', description: 'High-quality transmission fluid for tractors.', categorySlug: 'lubricants', image: '/uploads/products/lube/Tractor Transmission Oil.png' },
    { name: 'Tractor UTTO', slug: 'tractor-utto', description: 'Universal tractor transmission oil for all tractor types.', categorySlug: 'lubricants', image: '/uploads/products/lube/Tractor Utto.png' },
    { name: 'Hydro AW68 Hydraulic Oil', slug: 'hydro-aw68', description: 'Premium hydraulic oil for hydraulic systems.', categorySlug: 'lubricants', image: '/uploads/products/lube/Hydro AW68.png' },
    { name: 'GearTech Extra', slug: 'geartech-extra', description: 'Advanced gear oil for maximum protection.', categorySlug: 'lubricants', image: '/uploads/products/lube/GearTech Extra.png' },
  ];

  for (const p of products) {
    const categoryId = createdCategories[p.categorySlug];
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId,
        images: JSON.stringify([p.image]),
        featured: p.featured || false,
        inStock: true,
        isActive: true,
        price: p.price || null,
        priceUnit: p.price ? 'BDT' : null,
      },
    });
  }

  return { categories: categories.length, products: products.length };
}

export async function GET() {
  try {
    const result = await seedDatabase();
    return NextResponse.json({ 
      success: true, 
      message: `Database seeded: ${result.categories} categories, ${result.products} products` 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to seed database' 
    }, { status: 500 });
  }
}