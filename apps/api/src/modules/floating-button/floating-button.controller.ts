import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { FloatingButtonService } from './floating-button.service';
import { UpdateFloatingButtonDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@Controller('api/settings/floating-button')
export class FloatingButtonController {
  constructor(private readonly floatingButtonService: FloatingButtonService) {}

  @Get()
  async getSettings() {
    return this.floatingButtonService.getSettings();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateSettings(@Body() dto: UpdateFloatingButtonDto) {
    return this.floatingButtonService.updateSettings(dto);
  }
}