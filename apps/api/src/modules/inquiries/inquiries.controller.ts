import { Controller, Get, Post, Body, Patch, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto, UpdateInquiryDto, InquiryQueryDto } from './dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@/common/constants';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Submit a new inquiry' })
  @ApiResponse({ status: 201, description: 'Inquiry submitted successfully' })
  async create(@Body() dto: CreateInquiryDto, @Req() req: Request) {
    const ipAddress = req.ip || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.inquiriesService.create(dto, ipAddress, userAgent);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get all inquiries' })
  @ApiResponse({ status: 200, description: 'Inquiries retrieved' })
  async findAll(@Query() query: InquiryQueryDto) {
    return this.inquiriesService.findAll(query);
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get inquiry statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStats() {
    return this.inquiriesService.getStats();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get inquiry by ID' })
  @ApiResponse({ status: 200, description: 'Inquiry retrieved' })
  async findOne(@Param('id') id: string) {
    return this.inquiriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update inquiry' })
  @ApiResponse({ status: 200, description: 'Inquiry updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateInquiryDto) {
    return this.inquiriesService.update(id, dto);
  }

  @Patch(':id/assign/:userId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Assign inquiry to user' })
  @ApiResponse({ status: 200, description: 'Inquiry assigned' })
  async assignToUser(@Param('id') inquiryId: string, @Param('userId') userId: string) {
    return this.inquiriesService.assignToUser(inquiryId, userId);
  }
}
