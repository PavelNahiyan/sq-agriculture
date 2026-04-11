import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryQueryDto, CategoryResponseDto } from './dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, RoleType, CategoryType, CategoryTypeType } from '@/common/constants';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created', type: CategoryResponseDto })
  async create(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories (admin)' })
  @ApiResponse({ status: 200, description: 'Categories retrieved' })
  async findAll(@Query() query: CategoryQueryDto): Promise<any> {
    return this.categoriesService.findAll(query);
  }

  @Get('public')
  @Public()
  @ApiOperation({ summary: 'Get all public categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved' })
  async findAllPublic(@Query('type') type?: CategoryTypeType): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAllPublic(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved', type: CategoryResponseDto })
  async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
    return this.categoriesService.findOne(id);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiResponse({ status: 200, description: 'Category retrieved', type: CategoryResponseDto })
  async findBySlug(@Param('slug') slug: string): Promise<CategoryResponseDto> {
    return this.categoriesService.findBySlug(slug);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, description: 'Category updated', type: CategoryResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.categoriesService.remove(id);
    return { message: 'Category deleted successfully' };
  }
}
