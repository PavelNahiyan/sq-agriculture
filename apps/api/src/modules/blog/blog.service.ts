import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { CreateBlogPostDto, UpdateBlogPostDto, BlogQueryDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  private safeJsonParse(str: string, defaultValue: any): any {
    try {
      return typeof str === 'string' ? JSON.parse(str) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private parsePost(post: any): any {
    if (!post) return post;
    return {
      ...post,
      tags: this.safeJsonParse(post.tags, []),
    };
  }

  private parsePosts(posts: any[]): any[] {
    return posts.map(p => this.parsePost(p));
  }

  async create(dto: CreateBlogPostDto): Promise<any> {
    const post = await this.prisma.blogPost.create({
      data: {
        ...dto,
        tags: typeof dto.tags === 'string' ? dto.tags : JSON.stringify(dto.tags || []) as any,
      },
    });
    return this.parsePost(post);
  }

  async findAll(query: BlogQueryDto): Promise<{ data: any[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 10, category, search, featured, published = true } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BlogPostWhereInput = {
      ...(published !== undefined && { published }),
      ...(category && { category }),
      ...(featured !== undefined && { featured }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { excerpt: { contains: search } },
          { content: { contains: search } },
        ],
      }),
    };

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          titleBn: true,
          slug: true,
          excerpt: true,
          excerptBn: true,
          image: true,
          author: true,
          authorImage: true,
          category: true,
          tags: true,
          published: true,
          featured: true,
          viewCount: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      data: this.parsePosts(posts),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(idOrSlug: string): Promise<any> {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    const post = await this.prisma.blogPost.findFirst({
      where: isUUID ? { id: idOrSlug } : { slug: idOrSlug },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    // Increment view count
    await this.prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return this.parsePost({ ...post, viewCount: post.viewCount + 1 });
  }

  async findBySlug(slug: string): Promise<any> {
    return this.findOne(slug);
  }

  async findFeatured(limit: number = 3): Promise<any[]> {
    const posts = await this.prisma.blogPost.findMany({
      where: { published: true, featured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        titleBn: true,
        slug: true,
        excerpt: true,
        excerptBn: true,
        image: true,
        author: true,
        authorImage: true,
        category: true,
        tags: true,
        createdAt: true,
      },
    });
    return this.parsePosts(posts);
  }

  async findByCategory(category: string, limit: number = 10): Promise<any[]> {
    const posts = await this.prisma.blogPost.findMany({
      where: { category, published: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        titleBn: true,
        slug: true,
        excerpt: true,
        image: true,
        category: true,
        createdAt: true,
      },
    });
    return this.parsePosts(posts);
  }

  async update(id: string, dto: UpdateBlogPostDto): Promise<any> {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    const updateData: any = { ...dto };
    if (dto.tags !== undefined) {
      updateData.tags = typeof dto.tags === 'string' ? dto.tags : JSON.stringify(dto.tags);
    }

    const updated = await this.prisma.blogPost.update({
      where: { id },
      data: updateData,
    });
    
    return this.parsePost(updated);
  }

  async remove(id: string): Promise<void> {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    await this.prisma.blogPost.delete({
      where: { id },
    });
  }

  async getCategories(): Promise<string[]> {
    const posts = await this.prisma.blogPost.findMany({
      where: { published: true },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return posts.map((p) => p.category);
  }
}
