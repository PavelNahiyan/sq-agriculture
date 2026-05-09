import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { Public } from '@/common/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HeroSlidesService } from './hero-slides.service';
import { CreateHeroSlideDto, UpdateHeroSlideDto } from './dto/hero-slide.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('Hero Slides')
@Controller('hero-slides')
export class HeroSlidesController {
  constructor(private readonly heroSlidesService: HeroSlidesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all hero slides' })
  async findAll(@Query('activeOnly') activeOnly?: string) {
    return this.heroSlidesService.findAll(activeOnly === 'true');
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get hero slide by ID' })
  async findOne(@Param('id') id: string) {
    return this.heroSlidesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PAGE_EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create hero slide (admin only)' })
  async create(@Body() dto: CreateHeroSlideDto) {
    return this.heroSlidesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PAGE_EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update hero slide (admin only)' })
  async update(@Param('id') id: string, @Body() dto: UpdateHeroSlideDto) {
    return this.heroSlidesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PAGE_EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete hero slide (admin only)' })
  async remove(@Param('id') id: string) {
    return this.heroSlidesService.remove(id);
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PAGE_EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder hero slides (admin only)' })
  async reorder(@Body('ids') ids: string[]) {
    return this.heroSlidesService.reorder(ids);
  }
}
