import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto';
import { Prisma } from '@prisma/client';
import { AuditService } from '@/common/services/audit.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private parseProduct(product: any): any {
    if (!product) return product;
    return {
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images || '[]') : product.images || [],
      specs: typeof product.specs === 'string' ? JSON.parse(product.specs || '{}') : product.specs || {},
      preOwnedDetails: product.preOwnedDetails ? JSON.parse(product.preOwnedDetails) : null,
    };
  }

  private parseProducts(products: any[]): any[] {
    return products.map(p => this.parseProduct(p));
  }

  async create(dto: CreateProductDto, userId?: string): Promise<any> {
    const slug = dto.slug || this.generateSlug(dto.name);

    const existingProduct = await this.prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      throw new BadRequestException('Product with this slug already exists');
    }

    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        nameBn: dto.nameBn,
        slug,
        description: dto.description,
        descriptionBn: dto.descriptionBn,
        price: dto.price,
        priceUnit: dto.priceUnit,
        images: typeof dto.images === 'string' ? dto.images : JSON.stringify(dto.images || []) as any,
        specs: typeof dto.specs === 'string' ? dto.specs : JSON.stringify(dto.specs || {}) as any,
        featured: dto.featured || false,
        inStock: dto.inStock !== false,
        categoryId: dto.categoryId,
        isPreOwned: dto.isPreOwned || false,
        preOwnedDetails: dto.preOwnedDetails ? JSON.stringify(dto.preOwnedDetails) : null,
        createdById: userId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
          },
        },
        productLocations: {
          include: {
            dealer: true,
          },
        },
      },
    });

    if (dto.dealerIds && dto.dealerIds.length > 0) {
      await this.prisma.productLocation.createMany({
        data: dto.dealerIds.map((dealerId) => ({
          productId: product.id,
          dealerId,
        })),
      });
    }

    if (userId) {
      await this.auditService.logProductActivity(
        userId,
        'CREATE',
        product,
        undefined,
      );
    }

    return this.parseProduct(product);
  }

  async findAll(query: ProductQueryDto): Promise<{ data: any[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      categoryType,
      featured,
      inStock,
      minPrice,
      maxPrice,
      isActive,
      isPreOwned,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search } },
          { nameBn: { contains: search } },
          { description: { contains: search } },
        ],
      }),
      ...(categoryId && { categoryId }),
      ...(featured !== undefined && { featured }),
      ...(inStock !== undefined && { inStock }),
      ...(isActive !== undefined && { isActive }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
      ...(isPreOwned !== undefined && { isPreOwned }),
    };

    if (categoryType) {
      where.category = {
        type: categoryType,
        isActive: true,
      };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
            },
          },
        },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data: this.parseProducts(products), total };
  }

  async findAllPublic(query: ProductQueryDto): Promise<{ data: any[]; total: number }> {
    const {
      page = 1,
      limit = 12,
      search,
      categoryId,
      featured,
      categoryType,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      }),
      ...(categoryId && { categoryId }),
      ...(featured !== undefined && { featured }),
    };

    if (categoryType) {
      where.category = {
        type: categoryType,
        isActive: true,
      };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          nameBn: true,
          slug: true,
          description: true,
          price: true,
          priceUnit: true,
          images: true,
          featured: true,
          inStock: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
            },
          },
          createdAt: true,
        },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data: this.parseProducts(products), total };
  }

  async findOne(id: string): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        productLocations: {
          include: {
            dealer: {
              select: {
                id: true,
                name: true,
                address: true,
                district: true,
                division: true,
                phone: true,
                email: true,
                latitude: true,
                longitude: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.parseProduct(product);
  }

  async findBySlug(slug: string): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        productLocations: {
          include: {
            dealer: {
              select: {
                id: true,
                name: true,
                address: true,
                district: true,
                division: true,
                phone: true,
                email: true,
                latitude: true,
                longitude: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.parseProduct(product);
  }

  async update(id: string, dto: UpdateProductDto, userId?: string): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.slug && dto.slug !== product.slug) {
      const existingSlug = await this.prisma.product.findUnique({
        where: { slug: dto.slug },
      });

      if (existingSlug) {
        throw new BadRequestException('Slug already in use');
      }
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const updateData: any = { ...dto };
    
    if (dto.images && typeof dto.images !== 'string') {
      updateData.images = JSON.stringify(dto.images);
    }
    if (dto.specs && typeof dto.specs !== 'string') {
      updateData.specs = JSON.stringify(dto.specs);
    }
    if (dto.preOwnedDetails) {
      updateData.preOwnedDetails = JSON.stringify(dto.preOwnedDetails);
    }
    delete updateData.dealerIds;
    updateData.updatedById = userId;

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
          },
        },
        productLocations: {
          include: {
            dealer: true,
          },
        },
      },
    });

    if (dto.dealerIds !== undefined) {
      await this.prisma.productLocation.deleteMany({
        where: { productId: id },
      });
      
      if (dto.dealerIds.length > 0) {
        await this.prisma.productLocation.createMany({
          data: dto.dealerIds.map((dealerId) => ({
            productId: id,
            dealerId,
          })),
        });
      }
    }

    if (userId) {
      await this.auditService.logProductActivity(
        userId,
        'UPDATE',
        updatedProduct,
        product,
      );
    }

    return this.parseProduct(updatedProduct);
  }

  async remove(id: string, userId?: string): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedById: userId,
        isActive: false,
      },
    });

    if (userId) {
      await this.auditService.logProductActivity(
        userId,
        'DELETE',
        product,
      );
    }
  }

  async getFeatured(limit: number = 8): Promise<any[]> {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        featured: true,
      },
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return this.parseProducts(products);
  }

  async findPreOwned(query: ProductQueryDto): Promise<{ data: any[]; total: number }> {
    const {
      page = 1,
      limit = 12,
      search,
      categoryId,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      isPreOwned: true,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      }),
      ...(categoryId && { categoryId }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          nameBn: true,
          slug: true,
          description: true,
          price: true,
          priceUnit: true,
          images: true,
          featured: true,
          inStock: true,
          isPreOwned: true,
          preOwnedDetails: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
            },
          },
          createdAt: true,
        },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data: this.parseProducts(products), total };
  }

  async getRelated(productId: string, limit: number = 4): Promise<any[]> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    });

    if (!product) {
      return [];
    }

    const products = await this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        isActive: true,
      },
      take: limit,
      select: {
        id: true,
        name: true,
        nameBn: true,
        slug: true,
        images: true,
        price: true,
        priceUnit: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });
    
    return this.parseProducts(products);
  }
}
