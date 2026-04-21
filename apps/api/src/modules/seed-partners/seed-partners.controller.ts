import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { SeedPartnerDTO } from './seed-partners.dto';

@ApiTags('Seed Partners')
@Controller('seed-partners')
export class SeedPartnersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active seed partners' })
  @ApiResponse({ status: 200, description: 'Returns all active seed partners' })
  async findAll() {
    return this.prisma.seedPartner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get seed partner by ID' })
  @ApiResponse({ status: 200, description: 'Returns seed partner' })
  async findOne(@Param('id') id: string) {
    return this.prisma.seedPartner.findUnique({
      where: { id },
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PAGE_EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new seed partner (admin only)' })
  @ApiResponse({ status: 201, description: 'Seed partner created successfully' })
  async create(@Body() dto: SeedPartnerDTO) {
    const maxOrder = await this.prisma.seedPartner.aggregate({
      _max: { sortOrder: true },
    });
    
    return this.prisma.seedPartner.create({
      data: {
        name: dto.name,
        nameBn: dto.nameBn,
        logo: dto.logo,
        description: dto.description,
        website: dto.website,
        sortOrder: dto.sortOrder ?? (maxOrder._max.sortOrder ?? 0) + 1,
        isActive: dto.isActive ?? true,
      },
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PAGE_EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update seed partner (admin only)' })
  @ApiResponse({ status: 200, description: 'Seed partner updated successfully' })
  async update(@Param('id') id: string, @Body() dto: SeedPartnerDTO) {
    return this.prisma.seedPartner.update({
      where: { id },
      data: {
        name: dto.name,
        nameBn: dto.nameBn,
        logo: dto.logo,
        description: dto.description,
        website: dto.website,
        sortOrder: dto.sortOrder,
        isActive: dto.isActive,
      },
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PAGE_EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete seed partner (admin only)' })
  @ApiResponse({ status: 200, description: 'Seed partner deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.prisma.seedPartner.delete({
      where: { id },
    });
  }
}