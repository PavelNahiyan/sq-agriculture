import { Controller, Post, HttpCode, HttpStatus, UnauthorizedException, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Seed database with initial data (admin only)' })
  @ApiResponse({ status: 200, description: 'Database seeded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async seed(@Body() body: { secret: string }) {
    const seedSecret = this.configService.get<string>('SEED_SECRET');
    
    if (!seedSecret || body.secret !== seedSecret) {
      throw new UnauthorizedException('Invalid seed secret');
    }

    const Role = { ADMIN: 'ADMIN', MANAGER: 'MANAGER', CUSTOMER: 'CUSTOMER', USER: 'USER' };

    const adminPassword = await bcrypt.hash('admin123', 10);
    await this.prisma.user.upsert({
      where: { email: 'admin@sqagriculture.com' },
      update: {},
      create: {
        email: 'admin@sqagriculture.com',
        password: adminPassword,
        name: 'Admin User',
        phone: '+8801700000000',
        role: Role.ADMIN,
        isActive: true,
      },
    });

    return { message: 'Database seeded successfully', adminEmail: 'admin@sqagriculture.com' };
  }
}
