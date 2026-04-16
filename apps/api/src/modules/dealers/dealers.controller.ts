import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DealersService } from './dealers.service';
import { CreateDealerDto, UpdateDealerDto, DealerQueryDto } from './dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@/common/constants';

@ApiTags('dealers')
@Controller('dealers')
export class DealersController {
  constructor(private readonly dealersService: DealersService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Create a new dealer' })
  @ApiResponse({ status: 201, description: 'Dealer created' })
  async create(@Body() dto: CreateDealerDto) {
    return this.dealersService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all dealers' })
  @ApiResponse({ status: 200, description: 'Dealers retrieved' })
  async findAll(@Query() query: DealerQueryDto) {
    return this.dealersService.findAll(query);
  }

  @Get('districts')
  @Public()
  @ApiOperation({ summary: 'Get all available districts' })
  @ApiResponse({ status: 200, description: 'Districts retrieved' })
  async getDistricts(): Promise<{ data: string[] }> {
    const districts = await this.dealersService.getAllDistricts();
    return { data: districts };
  }

  @Get('divisions')
  @Public()
  @ApiOperation({ summary: 'Get all available divisions' })
  @ApiResponse({ status: 200, description: 'Divisions retrieved' })
  async getDivisions(): Promise<{ data: string[] }> {
    const divisions = await this.dealersService.getAllDivisions();
    return { data: divisions };
  }

  @Get('geojson')
  @Public()
  @ApiOperation({ summary: 'Get dealers as GeoJSON for map' })
  @ApiResponse({ status: 200, description: 'GeoJSON retrieved' })
  async getGeoJSON() {
    return this.dealersService.getGeoJSON();
  }

  @Get('district/:district')
  @Public()
  @ApiOperation({ summary: 'Get dealers by district' })
  @ApiResponse({ status: 200, description: 'Dealers retrieved' })
  async findByDistrict(@Param('district') district: string) {
    return this.dealersService.findByDistrict(district);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get dealer by ID' })
  @ApiResponse({ status: 200, description: 'Dealer retrieved' })
  async findOne(@Param('id') id: string) {
    return this.dealersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update dealer' })
  @ApiResponse({ status: 200, description: 'Dealer updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateDealerDto) {
    return this.dealersService.update(id, dto);
  }

  @Patch(':id/deactivate')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Deactivate dealer' })
  @ApiResponse({ status: 200, description: 'Dealer deactivated' })
  async remove(@Param('id') id: string) {
    await this.dealersService.remove(id);
    return { message: 'Dealer deactivated successfully' };
  }
}
