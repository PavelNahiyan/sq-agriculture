import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const product = await prisma.product.findUnique({ where: { slug: 'new-holland-tt75' } });
  if (product) {
    const images = JSON.parse(product.images);
    const fixed = images.filter((i: string) => !i.includes('TT75'));
    await prisma.product.update({ where: { slug: 'new-holland-tt75' }, data: { images: JSON.stringify(fixed) } });
    console.log('Fixed TT75 images:', JSON.stringify(fixed));
  } else {
    console.log('TT75 not found');
  }
  await prisma.$disconnect();
}
main();
