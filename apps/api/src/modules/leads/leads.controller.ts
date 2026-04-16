import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadDto, LeadQueryDto, LeadResponseDto } from './dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@/common/constants';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new lead (public)' })
  @ApiResponse({ status: 201, description: 'Lead created', type: LeadResponseDto })
  async create(@Body() dto: CreateLeadDto): Promise<LeadResponseDto> {
    return this.leadsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get all leads (Admin/Manager)' })
  @ApiResponse({ status: 200, description: 'Leads retrieved' })
  async findAll(@Query() query: LeadQueryDto): Promise<any> {
    return this.leadsService.findAll(query);
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get lead statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStats(): Promise<any> {
    return this.leadsService.getStats();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get lead by ID' })
  @ApiResponse({ status: 200, description: 'Lead retrieved', type: LeadResponseDto })
  async findOne(@Param('id') id: string): Promise<LeadResponseDto> {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update lead' })
  @ApiResponse({ status: 200, description: 'Lead updated', type: LeadResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
  ): Promise<LeadResponseDto> {
    return this.leadsService.update(id, dto);
  }

  @Patch(':id/assign/:userId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Assign lead to user' })
  @ApiResponse({ status: 200, description: 'Lead assigned', type: LeadResponseDto })
  async assignToUser(
    @Param('id') leadId: string,
    @Param('userId') userId: string,
  ): Promise<LeadResponseDto> {
    return this.leadsService.assignToUser(leadId, userId);
  }
}
