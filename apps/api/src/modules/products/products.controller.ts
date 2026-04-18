import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto, ProductResponseDto } from './dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@/common/constants';
import { User } from '@prisma/client';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created', type: ProductResponseDto })
  async create(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: User,
  ): Promise<ProductResponseDto> {
    return this.productsService.create(dto, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products (admin)' })
  @ApiResponse({ status: 200, description: 'Products retrieved' })
  async findAll(@Query() query: ProductQueryDto): Promise<any> {
    return this.productsService.findAll(query);
  }

  @Get('public')
  @Public()
  @ApiOperation({ summary: 'Get all public products' })
  @ApiResponse({ status: 200, description: 'Products retrieved' })
  async findAllPublic(@Query() query: ProductQueryDto): Promise<any> {
    return this.productsService.findAllPublic(query);
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({ status: 200, description: 'Featured products retrieved' })
  async getFeatured(@Query('limit') limit?: number): Promise<ProductResponseDto[]> {
    return this.productsService.getFeatured(limit || 8);
  }

  @Get('pre-owned')
  @Public()
  @ApiOperation({ summary: 'Get pre-owned machines' })
  @ApiResponse({ status: 200, description: 'Pre-owned machines retrieved' })
  async findPreOwned(@Query() query: ProductQueryDto): Promise<any> {
    return this.productsService.findPreOwned(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved', type: ProductResponseDto })
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productsService.findOne(id);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get product by slug' })
  @ApiResponse({ status: 200, description: 'Product retrieved', type: ProductResponseDto })
  async findBySlug(@Param('slug') slug: string): Promise<ProductResponseDto> {
    return this.productsService.findBySlug(slug);
  }

  @Get(':id/related')
  @Public()
  @ApiOperation({ summary: 'Get related products' })
  @ApiResponse({ status: 200, description: 'Related products retrieved' })
  async getRelated(@Param('id') id: string): Promise<ProductResponseDto[]> {
    return this.productsService.getRelated(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated', type: ProductResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: User,
  ): Promise<ProductResponseDto> {
    return this.productsService.update(id, dto, user?.id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    await this.productsService.remove(id, user?.id);
    return { message: 'Product deleted successfully' };
  }
}
