import { Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogPostDto, UpdateBlogPostDto, BlogQueryDto } from './dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@/common/constants';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({ status: 201, description: 'Post created' })
  async create(@Body() dto: CreateBlogPostDto) {
    return this.blogService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all published blog posts' })
  @ApiResponse({ status: 200, description: 'Posts retrieved' })
  async findAll(@Query() query: BlogQueryDto) {
    return this.blogService.findAll(query);
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get all blog categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved' })
  async getCategories(): Promise<{ data: string[] }> {
    const categories = await this.blogService.getCategories();
    return { data: categories };
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured blog posts' })
  @ApiResponse({ status: 200, description: 'Featured posts retrieved' })
  async findFeatured(@Query('limit') limit?: number) {
    return this.blogService.findFeatured(limit || 3);
  }

  @Get('category/:category')
  @Public()
  @ApiOperation({ summary: 'Get posts by category' })
  @ApiResponse({ status: 200, description: 'Posts retrieved' })
  async findByCategory(@Param('category') category: string, @Query('limit') limit?: number) {
    return this.blogService.findByCategory(category, limit || 10);
  }

  @Get(':idOrSlug')
  @Public()
  @ApiOperation({ summary: 'Get blog post by ID or slug' })
  @ApiResponse({ status: 200, description: 'Post retrieved' })
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.blogService.findOne(idOrSlug);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update blog post' })
  @ApiResponse({ status: 200, description: 'Post updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    return this.blogService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete blog post' })
  @ApiResponse({ status: 200, description: 'Post deleted' })
  async remove(@Param('id') id: string) {
    await this.blogService.remove(id);
    return { message: 'Blog post deleted successfully' };
  }
}
