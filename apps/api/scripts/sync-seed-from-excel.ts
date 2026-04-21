import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

const MATERIALS_ROOT = 'E:\\sq agriculture website\\Materials';

function loadExcelData(excelPath: string): any[] {
  const products: any[] = [];
  try {
    const workbook = XLSX.readFile(excelPath);
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      if (json.length < 2) continue;
      for (let i = 2; i < json.length; i++) {
        const row = json[i] as any[];
        if (!row || row.length < 4) continue;
        const productName = row[2]?.toString().trim();
        if (productName && productName !== 'Finished Product Name' && productName !== 'Crop Name') {
          products.push({
            name: productName,
            qty: row[3] || 0,
            value: row[4] || 0,
            sheet: sheetName
          });
        }
      }
    }
  } catch (e) {
    console.log('Excel load error:', e.message);
  }
  return products;
}

function findBestMatch(productName: string, excelProducts: any[]): any | null {
  const searchName = productName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  for (const excel of excelProducts) {
    const excelName = excel.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (excelName.includes(searchName) || searchName.includes(excelName)) {
      return excel;
    }
  }
  return null;
}

function scanFolderForImages(folderPath: string): { filename: string; name: string }[] {
  const files: { filename: string; name: string }[] = [];
  try {
    if (!fs.existsSync(folderPath)) return files;
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && /\.(png|jpg|jpeg|webp)$/i.test(entry.name)) {
        const name = entry.name.replace(/\.(png|jpg|jpeg|webp)$/i, '').replace(/-/g, ' ').trim();
        files.push({ filename: entry.name, name });
      }
    }
  } catch (e) {}
  return files;
}

function extractProductNameFromFilename(filename: string): string {
  const name = filename.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  const monthMatch = name.match(/\(([^)]+)\)$/);
  const month = monthMatch ? monthMatch[1] : '';
  const baseName = month ? name.replace(/\s*\([^)]+\)\s*$/, '').trim() : name;
  return baseName;
}

async function syncSeedProducts() {
  console.log('🔄 Starting Seed Products Sync from Excel...\n');
  
  const SEED_EXCEL = path.join(MATERIALS_ROOT, 'Seed', 'Bank Loan plan - seed 2026.xlsx');
  const excelData = loadExcelData(SEED_EXCEL);
  
  console.log(`Loaded ${excelData.length} product entries from Excel\n`);

  const seedFolders = [
    { folder: 'Seed/vegetables', type: 'SEEDS', name: 'Vegetable Seeds', slug: 'vegetable-seeds' },
    { folder: 'Seed/rice', type: 'SEEDS', name: 'Rice Seeds', slug: 'rice-seeds' },
    { folder: 'Seed/maize', type: 'SEEDS', name: 'Maize Seeds', slug: 'maize-seeds' },
  ];

  let totalProducts = 0;
  let newProducts = 0;

  for (const seedFolder of seedFolders) {
    const fullPath = path.join(MATERIALS_ROOT, seedFolder.folder);
    const imageFiles = scanFolderForImages(fullPath);
    
    if (imageFiles.length === 0) continue;

    // Get or create category
    let category = await prisma.category.findUnique({ where: { slug: seedFolder.slug } });
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: seedFolder.name,
          nameBn: seedFolder.name,
          slug: seedFolder.slug,
          description: `${seedFolder.name} - High quality seeds`,
          descriptionBn: `${seedFolder.name} - High quality seeds`,
          type: seedFolder.type as any,
          sortOrder: 1,
          isActive: true,
        }
      });
      console.log(`✅ Created category: ${seedFolder.name}`);
    }

    console.log(`\n📁 Syncing ${seedFolder.name} (${imageFiles.length} products):`);

    for (const imgFile of imageFiles) {
      const productName = extractProductNameFromFilename(imgFile.name);
      const excelInfo = findBestMatch(productName, excelData);
      
      const price = excelInfo?.value && excelInfo?.qty && excelInfo.qty > 0 
        ? Math.round(excelInfo.value / excelInfo.qty) 
        : 350;
      
      const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const imagePath = `/uploads/products/${seedFolder.folder}/${imgFile.filename}`;

      const existing = await prisma.product.findUnique({ where: { slug } });
      
      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: {
            name: productName,
            nameBn: productName,
            description: `${productName} seeds - Premium quality from SQ Agriculture`,
            price,
            priceUnit: 'KG',
            images: JSON.stringify([imagePath]),
            categoryId: category.id,
          }
        });
        console.log(`  🔄 Updated: ${productName} (${price} BDT/KG)`);
      } else {
        await prisma.product.create({
          data: {
            name: productName,
            nameBn: productName,
            slug,
            description: `${productName} seeds - Premium quality from SQ Agriculture`,
            price,
            priceUnit: 'KG',
            images: JSON.stringify([imagePath]),
            categoryId: category.id,
            featured: false,
            inStock: true,
            isActive: true,
          }
        });
        console.log(`  ✅ Created: ${productName} (${price} BDT/KG)`);
        newProducts++;
      }
      totalProducts++;
    }
  }

  console.log(`\n✅ Seed Sync Complete: ${totalProducts} products synced, ${newProducts} new`);
}

syncSeedProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
