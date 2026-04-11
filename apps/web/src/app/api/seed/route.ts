import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the database connection
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Try a simple query
    await prisma.$connect();
    
    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'seeds' },
        update: {},
        create: { name: 'Seeds', nameBn: 'বীজ', slug: 'seeds', type: 'SEEDS', image: '/uploads/products/Seeds.png', isActive: true },
      }),
      prisma.category.upsert({
        where: { slug: 'pesticide' },
        update: {},
        create: { name: 'Pesticides', nameBn: 'কীটনাশক', slug: 'pesticide', type: 'PESTICIDES', image: '/uploads/products/pesticide/Dtuch.png', isActive: true },
      }),
      prisma.category.upsert({
        where: { slug: 'tractors' },
        update: {},
        create: { name: 'Tractors', nameBn: 'ট্র্যাক্টর', slug: 'tractors', type: 'MACHINERY', image: '/uploads/products/machinery/TT47.png', isActive: true },
      }),
      prisma.category.upsert({
        where: { slug: 'harvesters' },
        update: {},
        create: { name: 'Harvesters', nameBn: 'হারভেস্টার', slug: 'harvesters', type: 'MACHINERY', image: '/uploads/products/machinery/Zoomlion.png', isActive: true },
      }),
      prisma.category.upsert({
        where: { slug: 'rotavators' },
        update: {},
        create: { name: 'Rotavators', nameBn: 'রোটাভেটর', slug: 'rotavators', type: 'MACHINERY', image: '/uploads/products/machinery/Rotavator.png', isActive: true },
      }),
      prisma.category.upsert({
        where: { slug: 'lubricants' },
        update: {},
        create: { name: 'Lubricants', nameBn: 'লুব্রিকেন্ট', slug: 'lubricants', type: 'LUBRICANTS', image: '/uploads/products/lube/Tractor Pro Engine Oil.png', isActive: true },
      }),
    ]);

    // Create products
    const products = [
      // Tractors
      { name: 'SQ ETIAN TT47 Tractor', slug: 'sq-etian-tt47', description: '47HP compact tractor perfect for small to medium farms. Fuel efficient with advanced features.', categorySlug: 'tractors', image: '/uploads/products/machinery/TT47.png', price: 850000, featured: true },
      { name: 'SQ ETIAN TT55 Tractor', slug: 'sq-etian-tt55', description: '55HP versatile tractor for medium farms.', categorySlug: 'tractors', image: '/uploads/products/machinery/TT55.png', price: 950000, featured: true },
      { name: 'SQ ETIAN TT70 Tractor', slug: 'sq-etian-tt70', description: '70HP heavy-duty tractor for large farms.', categorySlug: 'tractors', image: '/uploads/products/machinery/TT70.png', price: 1200000, featured: true },
      { name: 'SQ ETIAN TCT-3230', slug: 'sq-etian-tct-3230', description: '32HP compact tractor for small farms.', categorySlug: 'tractors', image: '/uploads/products/machinery/Tct-3230.png', price: 650000 },
      
      // Harvesters
      { name: '3037 Harvester', slug: '3037-harvester', description: 'Efficient combine harvester for wheat and rice.', categorySlug: 'harvesters', image: '/uploads/products/machinery/3037.png', featured: true },
      { name: 'Zoomlion Harvester', slug: 'zoomlion-harvester', description: 'Professional harvesting machine for commercial farms.', categorySlug: 'harvesters', image: '/uploads/products/machinery/Zoomlion.png' },
      
      // Rotavators
      { name: 'Rotavator', slug: 'rotavator', description: 'High-quality rotavator for efficient soil preparation.', categorySlug: 'rotavators', image: '/uploads/products/machinery/Rotavator.png', featured: true },
      { name: 'Fieldking Implement', slug: 'fieldking-implement', description: 'Professional farm implement for various tasks.', categorySlug: 'rotavators', image: '/uploads/products/machinery/Fieldking.png' },
      
      // Pesticides
      { name: 'Dtuch Herbicide', slug: 'dtuch-herbicide', description: 'Effective weed control herbicide for crops.', categorySlug: 'pesticide', image: '/uploads/products/pesticide/Dtuch.png', featured: true },
      { name: 'Keyazate Fungicide', slug: 'keyazate-fungicide', description: 'Professional disease control fungicide.', categorySlug: 'pesticide', image: '/uploads/products/pesticide/keyazate.png' },
      { name: 'Keyaton Insecticide', slug: 'keyaton-insecticide', description: 'Powerful pest control insecticide.', categorySlug: 'pesticide', image: '/uploads/products/pesticide/keyaton.png' },
      { name: 'Keyatov Insecticide', slug: 'keyatov-insecticide', description: 'Advanced formula insecticide.', categorySlug: 'pesticide', image: '/uploads/products/pesticide/keyatov.png' },
      { name: 'Mantasha Herbicide', slug: 'mantasha-herbicide', description: 'Effective weed control solution.', categorySlug: 'pesticide', image: '/uploads/products/pesticide/Mantasha.png' },
      { name: 'Pango Pesticide', slug: 'pango-pesticide', description: 'Complete crop protection solution.', categorySlug: 'pesticide', image: '/uploads/products/pesticide/Pango PNG.png' },
      { name: 'Real Sprayer', slug: 'real-sprayer', description: 'Professional agricultural sprayer equipment.', categorySlug: 'pesticide', image: '/uploads/products/pesticide/Real Sprayer PNG 1.png' },
      
      // Seeds
      { name: 'SQ King (July)', slug: 'sq-king-july', description: 'Premium quality hybrid seeds for July planting season.', categorySlug: 'seeds', image: '/uploads/products/seed/SQ King-July.png', featured: true },
      { name: 'Pilot (March)', slug: 'pilot-march', description: 'High-yielding seed variety for March planting.', categorySlug: 'seeds', image: '/uploads/products/seed/Pilot-Mar.png', featured: true },
      
      // Lubricants
      { name: 'Tractor Pro Engine Oil', slug: 'tractor-pro-engine-oil', description: 'Premium engine oil for tractors.', categorySlug: 'lubricants', image: '/uploads/products/lube/Tractor Pro Engine Oil.png', featured: true },
      { name: 'Harvester Pro Engine Oil', slug: 'harvester-pro-engine-oil', description: 'Specialized engine oil for harvesters.', categorySlug: 'lubricants', image: '/uploads/products/lube/Harvester Pro Engine Oil.png' },
      { name: 'Tractor Transmission Oil', slug: 'tractor-transmission-oil', description: 'High-quality transmission fluid for tractors.', categorySlug: 'lubricants', image: '/uploads/products/lube/Tractor Transmission Oil.png' },
      { name: 'Hydro AW68 Hydraulic Oil', slug: 'hydro-aw68', description: 'Premium hydraulic oil for hydraulic systems.', categorySlug: 'lubricants', image: '/uploads/products/lube/Hydro AW68.png' },
      { name: 'GearTech Extra', slug: 'geartech-extra', description: 'Advanced gear oil for maximum protection.', categorySlug: 'lubricants', image: '/uploads/products/lube/GearTech Extra.png' },
      { name: 'Tractor UTTO', slug: 'tractor-utto', description: 'Universal tractor transmission oil.', categorySlug: 'lubricants', image: '/uploads/products/lube/Tractor Utto.png' },
    ];

    const categoryMap: Record<string, string> = {};
    for (const cat of categories) {
      categoryMap[cat.slug] = cat.id;
    }

    for (const p of products) {
      const categoryId = categoryMap[p.categorySlug];
      if (categoryId) {
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
    }

    await prisma.$disconnect();
    
    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${categories.length} categories and ${products.length} products` 
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to seed database' 
    }, { status: 500 });
  }
}