import { Module } from '@nestjs/common';
import { PageConfigController } from './page-config.controller';
import { PageConfigService } from './page-config.service';

@Module({
  controllers: [PageConfigController],
  providers: [PageConfigService],
  exports: [PageConfigService],
})
export class PageConfigModule {}