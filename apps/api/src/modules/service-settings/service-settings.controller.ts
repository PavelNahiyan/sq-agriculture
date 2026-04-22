import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceSettingsService } from './service-settings.service';
import { UpdateServiceSettingsDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Service Settings')
@Controller('service-settings')
export class ServiceSettingsController {
  constructor(private readonly serviceSettingsService: ServiceSettingsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get service settings (public)' })
  async getSettings() {
    return this.serviceSettingsService.getSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service settings (admin only)' })
  async updateSettings(@Body() dto: UpdateServiceSettingsDto) {
    return this.serviceSettingsService.updateSettings(dto);
  }
}