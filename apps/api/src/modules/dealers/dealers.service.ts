import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { CreateDealerDto, UpdateDealerDto, DealerQueryDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DealersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDealerDto): Promise<any> {
    const dealer = await this.prisma.dealer.create({
      data: dto,
    });
    return dealer;
  }

  async findAll(query: DealerQueryDto): Promise<{ data: any[]; total: number }> {
    const { page = 1, limit = 500, district, division, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.DealerWhereInput = {
      isActive: true,
      ...(district && { district: { equals: district } }),
      ...(division && { division: { equals: division } }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { district: { contains: search } },
          { division: { contains: search } },
        ],
      }),
    };

    const [dealers, total] = await Promise.all([
      this.prisma.dealer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.dealer.count({ where }),
    ]);

    return { data: dealers, total };
  }

  async findOne(id: string): Promise<any> {
    const dealer = await this.prisma.dealer.findUnique({
      where: { id },
    });

    if (!dealer) {
      throw new NotFoundException('Dealer not found');
    }

    return dealer;
  }

  async findByDistrict(district: string): Promise<any[]> {
    return this.prisma.dealer.findMany({
      where: {
        district: { equals: district },
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, dto: UpdateDealerDto): Promise<any> {
    const dealer = await this.prisma.dealer.findUnique({
      where: { id },
    });

    if (!dealer) {
      throw new NotFoundException('Dealer not found');
    }

    return this.prisma.dealer.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string): Promise<void> {
    const dealer = await this.prisma.dealer.findUnique({
      where: { id },
    });

    if (!dealer) {
      throw new NotFoundException('Dealer not found');
    }

    // Soft delete
    await this.prisma.dealer.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getAllDistricts(): Promise<string[]> {
    const dealers = await this.prisma.dealer.findMany({
      where: { isActive: true },
      select: { district: true },
      distinct: ['district'],
      orderBy: { district: 'asc' },
    });
    return dealers.map((d) => d.district);
  }

  async getAllDivisions(): Promise<string[]> {
    const dealers = await this.prisma.dealer.findMany({
      where: { isActive: true },
      select: { division: true },
      distinct: ['division'],
      orderBy: { division: 'asc' },
    });
    return dealers.map((d) => d.division);
  }

  async getGeoJSON(): Promise<any> {
    const dealers = await this.prisma.dealer.findMany({
      where: { isActive: true, latitude: { not: null }, longitude: { not: null } },
    });

    return {
      type: 'FeatureCollection',
      features: dealers.map((dealer) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [dealer.longitude, dealer.latitude],
        },
        properties: {
          id: dealer.id,
          name: dealer.name,
          phone: dealer.phone,
          email: dealer.email,
          address: dealer.address,
          district: dealer.district,
          division: dealer.division,
        },
      })),
    };
  }
}
