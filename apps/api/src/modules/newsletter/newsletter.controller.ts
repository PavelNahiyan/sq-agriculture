import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { NewsletterService } from './newsletter.service';
import { SubscribeDto } from './dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@/common/constants';

@ApiTags('newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Public()
  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({ status: 201, description: 'Successfully subscribed' })
  async subscribe(@Body() dto: SubscribeDto): Promise<{ message: string }> {
    return this.newsletterService.subscribe(dto);
  }

  @Public()
  @Post('unsubscribe')
  @ApiOperation({ summary: 'Unsubscribe from newsletter' })
  @ApiResponse({ status: 200, description: 'Successfully unsubscribed' })
  async unsubscribe(@Body() dto: SubscribeDto): Promise<{ message: string }> {
    return this.newsletterService.unsubscribe(dto.email);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all newsletter subscribers (admin only)' })
  @ApiResponse({ status: 200, description: 'List of subscribers' })
  async findAll(): Promise<{ email: string; isActive: boolean; subscribedAt: Date }[]> {
    return this.newsletterService.findAll();
  }

  @Get('stats')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get newsletter statistics' })
  @ApiResponse({ status: 200, description: 'Newsletter stats' })
  async getStats(): Promise<{ total: number; active: number }> {
    return this.newsletterService.getStats();
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unsubscribe by ID' })
  @ApiResponse({ status: 200, description: 'Unsubscribed' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.newsletterService.remove(id);
    return { message: 'Unsubscribed successfully' };
  }
}
