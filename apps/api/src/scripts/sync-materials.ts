import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

interface MaterialFile {
  filename: string;
  path: string;
  name: string;
}

interface ProductMapping {
  folder: string;
  categoryType: string;
  categoryName: string;
  categorySlug: string;
  categoryDescription: string;
  products: {
    filename: string;
    name: string;
    nameBn?: string;
    description?: string;
    price?: number;
    priceUnit?: string;
  }[];
}

const MATERIALS_PATH = path.join(__dirname, '..', 'materials');

const CATEGORY_MAPPINGS: ProductMapping[] = [
  {
    folder: 'covers',
    categoryType: 'SLIDER',
    categoryName: 'Slider Covers',
    categorySlug: 'slider-covers',
    categoryDescription: 'Hero slider images',
    products: [
      { filename: '473546243_1328526098139120_5848044727393588155_n.jpg', name: 'Summer Harvest', description: 'Summer harvest season' },
      { filename: '469237652_556981607255908_9098269552307256399_n.jpg', name: 'Green Fields', description: 'Green agricultural fields' },
      { filename: 'harvestor cvr.jpg', name: 'Harvester Cover', description: 'Harvestor machinery' },
      { filename: 'tractor cover4.jpg', name: 'Tractor Cover', description: 'Tractor cover image' },
      { filename: 'cover.jpg', name: 'General Cover', description: 'General cover' },
      { filename: 'tractor cover 3.jpg', name: 'Tractor Cover 3', description: 'Tractor image' },
      { filename: 'tractor covers.jpg', name: 'Tractor Covers', description: 'Multiple tractors' },
      { filename: 'tormujer bichi.jpg', name: 'Farm Workers', description: 'Farm workers in field' },
      { filename: '482320470_627521863535215_7134072551268263462_n.jpg', name: 'Rice Field', description: 'Rice paddy field' },
      { filename: '617061968_894345300186202_2718315043250223736_n.jpg', name: 'Crop Field', description: 'Crop field view' },
      { filename: '649826280_940465142240884_5943911529541727990_n.jpg', name: 'Agriculture View', description: 'Agricultural landscape' },
    ],
  },
  {
    folder: 'Seed/vegetables',
    categoryType: 'SEEDS',
    categoryName: 'Vegetable Seeds',
    categorySlug: 'vegetable-seeds',
    categoryDescription: 'High-quality vegetable seeds',
    products: [
      { filename: 'SQ King-July.png', name: 'SQ King (July)', description: 'Premium hybrid vegetable seeds for July planting', price: 450, priceUnit: 'KG' },
      { filename: 'Pilot-Mar.png', name: 'Pilot (March)', description: 'Early season vegetable seeds', price: 420, priceUnit: 'KG' },
      { filename: 'P9.png', name: 'P9 Hybrid', description: 'High-yield hybrid seeds', price: 380, priceUnit: 'KG' },
      { filename: 'P8.png', name: 'P8 Variety', description: 'P8 hybrid variety', price: 350, priceUnit: 'KG' },
      { filename: 'P6.png', name: 'P6 Seeds', description: 'P6 quality seeds', price: 320, priceUnit: 'KG' },
      { filename: 'P3.png', name: 'P3 Hybrid', description: 'P3 hybrid variety', price: 300, priceUnit: 'KG' },
      { filename: 'P2.png', name: 'P2 Seeds', description: 'P2 vegetable seeds', price: 280, priceUnit: 'KG' },
      { filename: 'P11.png', name: 'P11 Variety', description: 'P11 hybrid variety', price: 400, priceUnit: 'KG' },
      { filename: 'P10.png', name: 'P10 Seeds', description: 'P10 quality seeds', price: 380, priceUnit: 'KG' },
      { filename: 'Ononna-May.png', name: 'Ononna (May)', description: 'May planting season seeds', price: 350, priceUnit: 'KG' },
      { filename: 'Millenium-Feb.png', name: 'Millenium (February)', description: 'February planting variety', price: 420, priceUnit: 'KG' },
      { filename: 'King Kumra.png', name: 'King Kumra', description: 'Premium pumpkin seeds', price: 500, priceUnit: 'KG' },
      { filename: 'Green Queen-Sep.png', name: 'Green Queen (September)', description: 'September planting variety', price: 480, priceUnit: 'KG' },
      { filename: 'Green Magic-Aug.png', name: 'Green Magic (August)', description: 'August planting hybrid', price: 450, priceUnit: 'KG' },
      { filename: 'Captain-June.png', name: 'Captain (June)', description: 'June season seeds', price: 380, priceUnit: 'KG' },
      { filename: 'Agnila-Jan.png', name: 'Agnila (January)', description: 'January winter variety', price: 520, priceUnit: 'KG' },
    ],
  },
  {
    folder: 'Seed/rice',
    categoryType: 'SEEDS',
    categoryName: 'Rice Seeds',
    categorySlug: 'rice-seeds',
    categoryDescription: 'Premium rice seeds for all seasons',
    products: [
      { filename: 'Hybrid Rice-Nov.png', name: 'Hybrid Rice (November)', description: 'High-yield hybrid rice for November planting', price: 150, priceUnit: 'KG' },
    ],
  },
  {
    folder: 'Seed/maize',
    categoryType: 'SEEDS',
    categoryName: 'Maize Seeds',
    categorySlug: 'maize-seeds',
    categoryDescription: 'Hybrid maize seeds for commercial farming',
    products: [
      { filename: 'Corns-Oct.png', name: 'Corns (October)', description: 'October maize variety', price: 450, priceUnit: 'KG' },
    ],
  },
  {
    folder: 'Pesticide',
    categoryType: 'PESTICIDES',
    categoryName: 'Pesticides',
    categorySlug: 'pesticides',
    categoryDescription: 'Effective crop protection solutions',
    products: [
      { filename: '1. Anithrin 10 EC - 400 ml.png', name: 'Anithrin 10 EC', description: 'Broad-spectrum insecticide - 400ml', price: 350, priceUnit: 'ML' },
      { filename: '2. Keyatin 1.8 EC - 400 ml.png', name: 'Keyatin 1.8 EC', description: 'Systemic insecticide - 400ml', price: 320, priceUnit: 'ML' },
      { filename: '3. Evic Plus 5 EC - 500 ml.png', name: 'Evic Plus 5 EC', description: 'Insecticide for sucking pests - 500ml', price: 380, priceUnit: 'ML' },
      { filename: '4. Imulin 20 SL - 500 ml.png', name: 'Imulin 20 SL', description: 'Systemic insecticide - 500ml', price: 420, priceUnit: 'ML' },
      { filename: '5. Keratin 4 EC - 50 ml.png', name: 'Keratin 4 EC', description: 'Concentrated insecticide - 50ml', price: 180, priceUnit: 'ML' },
      { filename: '6. Keyazate 5 WDG - 100 gm.png', name: 'Keyazate 5 WDG', description: 'Water dispersible granules - 100gm', price: 280, priceUnit: 'GM' },
      { filename: '7. Keyadin 6 WDG - 10 gm.png', name: 'Keyadin 6 WDG', description: 'WDG for pest control - 10gm', price: 150, priceUnit: 'GM' },
      { filename: '8. Keyaprid 6 WDG - 10 gm.png', name: 'Keyaprid 6 WDG', description: 'WDG insecticide - 10gm', price: 140, priceUnit: 'GM' },
      { filename: '9. Fachlor 18 WP - 50 gm.png', name: 'Fachlor 18 WP', description: 'Wettable powder - 50gm', price: 220, priceUnit: 'GM' },
      { filename: '10. Mantasha 40 WDG - 10 gm.png', name: 'Mantasha 40 WDG', description: 'Fungicide WDG - 10gm', price: 120, priceUnit: 'GM' },
      { filename: '11. Kazebin 50 WDG - 10 gm.png', name: 'Kazebin 50 WDG', description: 'Fungicide - 10gm', price: 130, priceUnit: 'GM' },
      { filename: '13. Flash Hit 70 WDG - 50 gm.png', name: 'Flash Hit 70 WDG', description: 'Powerful WDG - 50gm', price: 250, priceUnit: 'GM' },
      { filename: '14. Keyatov 75 WG - 50 gm.png', name: 'Keyatov 75 WG', description: 'Water granule - 50gm', price: 280, priceUnit: 'GM' },
      { filename: '15. Keyaton 95 SP - 50 gm.png', name: 'Keyaton 95 SP', description: 'Soluble powder - 50gm', price: 320, priceUnit: 'GM' },
      { filename: '16. Muntaha 70 WDG - 10 gm.png', name: 'Muntaha 70 WDG', description: 'WDG fungicide - 10gm', price: 110, priceUnit: 'GM' },
      { filename: '17. Thot 80 WG - 1 kg.png', name: 'Thot 80 WG', description: 'Water granule - 1kg', price: 850, priceUnit: 'KG' },
      { filename: '18. Manconil 72 WP.png', name: 'Manconil 72 WP', description: 'Fungicide wettable powder', price: 380, priceUnit: 'GM' },
      { filename: '19. Nikizeb 80 WP.png', name: 'Nikizeb 80 WP', description: 'Zinc fungicide', price: 420, priceUnit: 'GM' },
      { filename: '20. SQ Super Darma.png', name: 'SQ Super Darma', description: 'SQ premium fungicide', price: 520, priceUnit: 'GM' },
      { filename: '21. Dizizol 10 G.png', name: 'Dizizol 10 G', description: 'Granule insecticide', price: 280, priceUnit: 'GM' },
      { filename: '22. Eros Gold 30.75 DF.jpg', name: 'Eros Gold 30.75 DF', description: 'Dry flowable fungicide', price: 450, priceUnit: 'GM' },
      { filename: 'Pango PNG.png', name: 'Pango', description: 'Premium pesticide', price: 580, priceUnit: 'LTR' },
      { filename: 'Mantasha.png', name: 'Mantasha', description: 'Mantasha brand pesticide', price: 350, priceUnit: 'GM' },
      { filename: 'keyazate.png', name: 'Keyazate', description: 'Keyazate insecticide', price: 250, priceUnit: 'GM' },
      { filename: 'keyatov.png', name: 'Keyatov', description: 'Keyatov WG', price: 320, priceUnit: 'GM' },
      { filename: 'keyaton.png', name: 'Keyaton', description: 'Keyaton SP', price: 380, priceUnit: 'GM' },
      { filename: 'Dtuch.png', name: 'Dtuch', description: 'Dtuch pesticide', price: 220, priceUnit: 'ML' },
    ],
  },
  {
    folder: 'Harvester',
    categoryType: 'MACHINERY',
    categoryName: 'Harvesting Machinery',
    categorySlug: 'harvesting-machinery',
    categoryDescription: 'Efficient harvesting machines',
    products: [
      { filename: 'TT47.png', name: 'SQ ETIAN TT47', description: '47HP compact tractor', price: 850000, priceUnit: 'UNIT' },
      { filename: 'TT55.png', name: 'SQ ETIAN TT55', description: '55HP medium tractor', price: 950000, priceUnit: 'UNIT' },
      { filename: 'TT70.png', name: 'SQ ETIAN TT70', description: '70HP heavy duty tractor', price: 1200000, priceUnit: 'UNIT' },
      { filename: 'TT3.50.png', name: 'SQ TT3.50', description: '3.50 HP power tiller', price: 280000, priceUnit: 'UNIT' },
      { filename: 'Tct-3230.png', name: 'SQ TCT-3230', description: '32HP compact tractor', price: 780000, priceUnit: 'UNIT' },
      { filename: 'Rotavator.png', name: 'SQ Rotavator', description: 'Agricultural rotavator', price: 185000, priceUnit: 'UNIT' },
      { filename: 'Fieldking.png', name: 'Fieldking Implement', description: 'Multi-purpose farm implement', price: 95000, priceUnit: 'UNIT' },
      { filename: 'Etian.png', name: 'SQ Etian', description: 'Etian tractor model', price: 920000, priceUnit: 'UNIT' },
      { filename: 'Etian SQTE.png', name: 'SQ Etian SQTE', description: 'SQTE tractor variant', price: 980000, priceUnit: 'UNIT' },
      { filename: '3037.png', name: 'SQ 3037', description: '30HP tractor', price: 720000, priceUnit: 'UNIT' },
      { filename: 'Zoomlion.png', name: 'Zoomlion', description: 'Zoomlion agricultural equipment', price: 650000, priceUnit: 'UNIT' },
      { filename: '469389370_556981630589239_6387429546288724300_n.jpg', name: 'Harvester Combined', description: 'Combined harvester', price: 1250000, priceUnit: 'UNIT' },
      { filename: 'harvestor.jpg', name: 'Harvester', description: 'General harvester', price: 1150000, priceUnit: 'UNIT' },
    ],
  },
  {
    folder: 'Tractor',
    categoryType: 'MACHINERY',
    categoryName: 'Tractors',
    categorySlug: 'tractors',
    categoryDescription: 'SQ ETIAN tractors for all farming needs',
    products: [
      { filename: '476167125_599249506362451_1470294131761454851_n.jpg', name: 'Tractor Model N', description: 'New Holland tractor', price: 980000, priceUnit: 'UNIT' },
      { filename: 'new holland tractor cover.jpg', name: 'New Holland Tractor', description: 'New Holland coverage', price: 1050000, priceUnit: 'UNIT' },
      { filename: 'newholland field.jpg', name: 'New Holland in Field', description: 'Working in field', price: 1100000, priceUnit: 'UNIT' },
    ],
  },
  {
    folder: 'Lubricants',
    categoryType: 'LUBRICANTS',
    categoryName: 'Lubricants & Oils',
    categorySlug: 'lubricants-oils',
    categoryDescription: 'Premium lubricants for tractors and machinery',
    products: [
      { filename: 'Tractor Utto.png', name: 'Tractor UTTO', description: 'Universal tractor transmission oil', price: 850, priceUnit: 'LTR' },
      { filename: 'Tractor Transmission Oil.png', name: 'Transmission Oil', description: 'Tractor transmission fluid', price: 780, priceUnit: 'LTR' },
      { filename: 'Tractor Pro Engine Oil.png', name: 'Tractor Pro Engine Oil', description: 'Premium engine oil', price: 920, priceUnit: 'LTR' },
      { filename: 'Hydro AW68.png', name: 'Hydro AW68', description: 'Hydraulic oil AW68', price: 680, priceUnit: 'LTR' },
      { filename: 'Harvester Pro Engine Oil.png', name: 'Harvester Pro Engine Oil', description: 'Harvester engine oil', price: 980, priceUnit: 'LTR' },
      { filename: 'GearTech Extra.png', name: 'GearTech Extra', description: 'Extra gear lubricant', price: 750, priceUnit: 'LTR' },
    ],
  },
  {
    folder: 'Micronutrients',
    categoryType: 'MICRONUTRIENTS',
    categoryName: 'Micronutrients',
    categorySlug: 'micronutrients',
    categoryDescription: 'Essential micronutrients for plant health',
    products: [
      { filename: '1. Boron Max - 500 gm.png', name: 'Boron Max', description: 'Boron supplement - 500gm', price: 280, priceUnit: 'GM' },
      { filename: '3. Monohydrate - 1 kg.png', name: 'Monohydrate', description: 'Calcium monohydrate - 1kg', price: 180, priceUnit: 'KG' },
      { filename: '4. Spray Potash - 250 gm.png', name: 'Spray Potash', description: 'Potassium spray - 250gm', price: 220, priceUnit: 'GM' },
      { filename: '5. Tiger Zinc - 25 gm.png', name: 'Tiger Zinc', description: 'Zinc supplement - 25gm', price: 150, priceUnit: 'GM' },
      { filename: '6. Turbo Gypsum - 10 kg.png', name: 'Turbo Gypsum', description: 'Gypsum - 10kg', price: 320, priceUnit: 'KG' },
      { filename: '7. Super Folon - 100 ml.png', name: 'Super Folon', description: 'Foliar spray - 100ml', price: 180, priceUnit: 'ML' },
      { filename: '8. Pango - 1 ltr.png', name: 'Pango', description: 'Liquid micronutrient - 1ltr', price: 450, priceUnit: 'LTR' },
    ],
  },
];

@Injectable()
export class SyncMaterialsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    console.log('🔄 Starting Materials Sync...');
    await this.syncAllMaterials();
  }

  private async syncAllMaterials() {
    try {
      let syncedCategories = 0;
      let syncedProducts = 0;

      for (const mapping of CATEGORY_MAPPINGS) {
        const categoryResult = await this.syncCategory(mapping);
        syncedCategories += categoryResult.categoryCreated ? 1 : 0;
        syncedProducts += categoryResult.productsCreated;
      }

      console.log(`✅ Materials Sync Complete: ${syncedCategories} categories, ${syncedProducts} products`);
    } catch (error) {
      console.error('❌ Materials Sync Failed:', error);
    }
  }

  private async syncCategory(mapping: ProductMapping): Promise<{ categoryCreated: boolean; productsCreated: number }> {
    const { folder, categoryType, categoryName, categorySlug, categoryDescription, products } = mapping;

    let categoryCreated = false;
    let productsCreated = 0;

    try {
      const category = await this.prisma.category.upsert({
        where: { slug: categorySlug },
        update: {
          name: categoryName,
          description: categoryDescription,
          type: categoryType as any,
        },
        create: {
          name: categoryName,
          nameBn: categoryName,
          slug: categorySlug,
          description: categoryDescription,
          descriptionBn: categoryDescription,
          type: categoryType as any,
          sortOrder: this.getSortOrder(categoryType),
          isActive: true,
        },
      });

      categoryCreated = true;

      for (const product of products) {
        const imagePath = `/uploads/products/${folder}/${product.filename}`;
        
        await this.prisma.product.upsert({
          where: { slug: this.slugify(product.name) },
          update: {
            name: product.name,
            description: product.description,
            price: product.price,
            priceUnit: product.priceUnit as any,
            images: JSON.stringify([imagePath]),
            categoryId: category.id,
          },
          create: {
            name: product.name,
            nameBn: product.nameBn || product.name,
            slug: this.slugify(product.name),
            description: product.description || product.name,
            price: product.price || 0,
            priceUnit: (product.priceUnit || 'UNIT') as any,
            images: JSON.stringify([imagePath]),
            categoryId: category.id,
            featured: false,
            inStock: true,
          },
        });

        productsCreated++;
      }

      return { categoryCreated, productsCreated };
    } catch (error) {
      console.error(`❌ Error syncing ${categoryName}:`, error);
      return { categoryCreated: false, productsCreated: 0 };
    }
  }

  private getSortOrder(categoryType: string): number {
    const order: Record<string, number> = {
      'SLIDER': 0,
      'SEEDS': 1,
      'PESTICIDES': 2,
      'FERTILIZERS': 3,
      'MACHINERY': 4,
      'MICRONUTRIENTS': 5,
      'LUBRICANTS': 6,
    };
    return order[categoryType] || 99;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}