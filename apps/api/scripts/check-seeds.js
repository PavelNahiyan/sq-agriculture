const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  // Check products in Vegetable Seeds category specifically
  const vegProducts = await prisma.product.findMany({ 
    where: { 
      category: { slug: 'vegetable-seeds' },
      deletedAt: null 
    },
    select: { id: true, name: true, images: true, price: true }
  });
  
  console.log('Vegetable Seeds products:', vegProducts.length);
  for (const p of vegProducts) {
    const imgs = p.images ? JSON.parse(p.images) : [];
    console.log(`  - ${p.name}: ${imgs.length} images, price=${p.price}`);
    if (imgs[0]) console.log(`    Image: ${imgs[0]}`);
  }
}

check().finally(() => prisma.$disconnect());