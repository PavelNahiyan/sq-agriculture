import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/constants';

@ApiTags('activity')
@ApiBearerAuth()
@Controller('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get recent activities' })
  @ApiResponse({ status: 200, description: 'Activities retrieved successfully' })
  async getRecentActivities(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    return this.activityService.getRecentActivities(parsedLimit);
  }

  @Get('stats')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get activity statistics' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  async getActivityStats() {
    return this.activityService.getActivityStats();
  }

  @Get('entity/:type/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get activities for a specific entity' })
  @ApiResponse({ status: 200, description: 'Activities retrieved successfully' })
  async getActivitiesByEntity(
    @Param('type') type: string,
    @Param('id') id: string,
  ) {
    return this.activityService.getActivitiesByEntity(type, id);
  }

  @Get('user/:userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get activities by user' })
  @ApiResponse({ status: 200, description: 'Activities retrieved successfully' })
  async getActivitiesByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    return this.activityService.getActivitiesByUser(userId, parsedLimit);
  }
}
