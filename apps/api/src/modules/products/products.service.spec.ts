import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AuditService } from '@/common/services/audit.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: jest.Mocked<PrismaService>;

  const mockProduct = {
    id: 'product-id-1',
    name: 'Test Product',
    nameBn: 'টেস্ট প্রোডাক্ট',
    slug: 'test-product',
    description: 'A test product',
    price: 1000,
    priceUnit: 'per kg',
    images: '[]',
    specs: '{}',
    featured: false,
    inStock: true,
    isActive: true,
    categoryId: 'cat-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCategory = {
    id: 'cat-1',
    name: 'Fertilizers',
    type: 'FERTILIZERS',
    isActive: true,
  };

  beforeEach(async () => {
    const mockPrisma = {
      product: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      category: {
        findUnique: jest.fn(),
      },
      productLocation: {
        createMany: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    const mockAuditService = {
      logProductActivity: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get(PrismaService);
  });

  describe('findAll', () => {
    it('should return products with pagination', async () => {
      prisma.product.findMany.mockResolvedValue([mockProduct] as any);
      prisma.product.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should filter by search term', async () => {
      prisma.product.findMany.mockResolvedValue([mockProduct] as any);
      prisma.product.count.mockResolvedValue(1);

      await service.findAll({ search: 'test', page: 1, limit: 10 });

      expect(prisma.product.findMany).toHaveBeenCalled();
    });

    it('should filter by categoryId', async () => {
      prisma.product.findMany.mockResolvedValue([mockProduct] as any);
      prisma.product.count.mockResolvedValue(1);

      await service.findAll({ categoryId: 'cat-1', page: 1, limit: 10 });

      expect(prisma.product.findMany).toHaveBeenCalled();
    });

    it('should filter by featured', async () => {
      prisma.product.findMany.mockResolvedValue([mockProduct] as any);
      prisma.product.count.mockResolvedValue(1);

      await service.findAll({ featured: true, page: 1, limit: 10 });

      expect(prisma.product.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product by id', async () => {
      prisma.product.findUnique.mockResolvedValue({
        ...mockProduct,
        category: mockCategory,
        productLocations: [],
      } as any);

      const result = await service.findOne('product-id-1');

      expect(result.name).toBe('Test Product');
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-id-1' },
        expect: expect.any(Object),
      });
    });

    it('should throw NotFoundException for non-existent product', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findBySlug', () => {
    it('should return a product by slug', async () => {
      prisma.product.findUnique.mockResolvedValue({
        ...mockProduct,
        category: mockCategory,
        productLocations: [],
      } as any);

      const result = await service.findBySlug('test-product');

      expect(result.slug).toBe('test-product');
    });

    it('should throw NotFoundException for invalid slug', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findBySlug('invalid-slug')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      prisma.category.findUnique.mockResolvedValue(mockCategory);
      prisma.product.create.mockResolvedValue({
        ...mockProduct,
        category: mockCategory,
      } as any);
      prisma.product.findUnique.mockResolvedValue(null);

      const result = await service.create({
        name: 'New Product',
        categoryId: 'cat-1',
      });

      expect(result.name).toBe('Test Product');
      expect(prisma.product.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException for invalid category', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          name: 'New Product',
          categoryId: 'invalid-cat',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should generate slug if not provided', async () => {
      prisma.category.findUnique.mockResolvedValue(mockCategory);
      prisma.product.create.mockResolvedValue({
        ...mockProduct,
        category: mockCategory,
      } as any);
      prisma.product.findUnique.mockResolvedValue(null);

      await service.create({
        name: 'My New Product',
        categoryId: 'cat-1',
      });

      expect(prisma.product.create).toHaveBeenCalled();
    });
  });

  describe('getFeatured', () => {
    it('should return featured products', async () => {
      prisma.product.findMany.mockResolvedValue([mockProduct] as any);

      const result = await service.getFeatured(4);

      expect(result).toHaveLength(1);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true, featured: true },
        take: 4,
        expect: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('slug generation', () => {
    it('should generate valid slug from name', async () => {
      prisma.category.findUnique.mockResolvedValue(mockCategory);
      prisma.product.create.mockResolvedValue({
        ...mockProduct,
        category: mockCategory,
      } as any);
      prisma.product.findUnique.mockResolvedValue(null);

      await service.create({
        name: 'NPK Fertilizer 20-20-20',
        categoryId: 'cat-1',
      });

      const createCall = prisma.product.create.mock.calls[0][0];
      expect(createCall.data.slug).toBe('npk-fertilizer-20-20-20');
    });
  });
});