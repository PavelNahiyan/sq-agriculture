import { Module } from '@nestjs/common';
import { ServiceSettingsController } from './service-settings.controller';
import { ServiceSettingsService } from './service-settings.service';

@Module({
  controllers: [ServiceSettingsController],
  providers: [ServiceSettingsService],
  exports: [ServiceSettingsService],
})
export class ServiceSettingsModule {}
