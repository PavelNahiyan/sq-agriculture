import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            nameBn: true,
            slug: true,
            price: true,
            priceUnit: true,
            images: true,
          },
        },
      },
      orderBy: { addedAt: 'desc' },
    });

    return items.map(item => ({
      id: item.id,
      productId: item.productId,
      addedAt: item.addedAt,
      product: item.product,
    }));
  }

  async add(userId: string, productId: string): Promise<{ message: string }> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.prisma.wishlistItem.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      throw new ConflictException('Product already in wishlist');
    }

    await this.prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    });

    return { message: 'Product added to wishlist' };
  }

  async remove(userId: string, productId: string): Promise<{ message: string }> {
    const existing = await this.prisma.wishlistItem.findFirst({
      where: { userId, productId },
    });

    if (!existing) {
      throw new NotFoundException('Product not found in wishlist');
    }

    await this.prisma.wishlistItem.delete({
      where: { id: existing.id },
    });

    return { message: 'Product removed from wishlist' };
  }

  async count(userId: string): Promise<number> {
    return this.prisma.wishlistItem.count({
      where: { userId },
    });
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const item = await this.prisma.wishlistItem.findFirst({
      where: { userId, productId },
    });
    return !!item;
  }
}
