import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryQueryDto } from './dto';
import { Prisma } from '@prisma/client';
import { CategoryType, CategoryTypeType } from '@/common/constants';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async create(dto: CreateCategoryDto): Promise<any> {
    const slug = dto.slug || this.generateSlug(dto.name);

    const existingCategory = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this slug already exists');
    }

    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        nameBn: dto.nameBn,
        slug,
        description: dto.description,
        descriptionBn: dto.descriptionBn,
        image: dto.image,
        type: dto.type,
        sortOrder: dto.sortOrder || 0,
      },
    });

    return category;
  }

  async findAll(query: CategoryQueryDto): Promise<{ data: any[]; total: number }> {
    const { page = 1, limit = 10, type, isActive } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.CategoryWhereInput = {
      ...(type && { type: type as CategoryTypeType }),
      ...(isActive !== undefined && { isActive }),
    };

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
      this.prisma.category.count({ where }),
    ]);

    const data = categories.map((cat) => ({
      ...cat,
      productCount: cat._count.products,
      _count: undefined,
    }));

    return { data, total };
  }

  async findAllPublic(type?: CategoryTypeType): Promise<any[]> {
    const where: Prisma.CategoryWhereInput = {
      isActive: true,
      ...(type && { type }),
    };

    return this.prisma.category.findMany({
      where,
      include: {
        products: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
            price: true,
          },
          take: 10,
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string): Promise<any> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      ...category,
      productCount: category._count.products,
      _count: undefined,
    };
  }

  async findBySlug(slug: string): Promise<any> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<any> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (dto.slug && dto.slug !== category.slug) {
      const existingSlug = await this.prisma.category.findUnique({
        where: { slug: dto.slug },
      });

      if (existingSlug) {
        throw new ConflictException('Slug already in use');
      }
    }

    const updateData: Prisma.CategoryUpdateInput = { ...dto };

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: updateData,
    });

    return updatedCategory;
  }

  async remove(id: string): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category._count.products > 0) {
      throw new ConflictException('Cannot delete category with existing products');
    }

    await this.prisma.category.delete({
      where: { id },
    });
  }
}
