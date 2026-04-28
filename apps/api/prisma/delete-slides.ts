const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.heroSlide.deleteMany({});
  console.log('Deleted all hero slides');
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); process.exit(1); });
