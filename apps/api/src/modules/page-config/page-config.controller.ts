import { Controller, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PageConfigService } from './page-config.service';
import { UpdatePageConfigDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('api/pages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PageConfigController {
  constructor(private readonly pageConfigService: PageConfigService) {}

  @Get(':pageName')
  async getConfig(@Param('pageName') pageName: string) {
    return this.pageConfigService.getConfig(pageName);
  }

  @Get()
  async getAllConfigs() {
    return this.pageConfigService.getAllConfigs();
  }

  @Patch(':pageName')
  async updateConfig(
    @Param('pageName') pageName: string,
    @Body() dto: UpdatePageConfigDto,
    @CurrentUser() user: any,
  ) {
    return this.pageConfigService.updateConfig(pageName, dto, user?.id);
  }

  @Delete(':pageName')
  async deleteConfig(@Param('pageName') pageName: string) {
    return this.pageConfigService.deleteConfig(pageName);
  }
}