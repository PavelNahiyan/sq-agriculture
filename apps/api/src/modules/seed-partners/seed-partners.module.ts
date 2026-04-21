import { Module } from '@nestjs/common';
import { SeedPartnersController } from './seed-partners.controller';

@Module({
  controllers: [SeedPartnersController],
  providers: [],
  exports: [],
})
export class SeedPartnersModule {}