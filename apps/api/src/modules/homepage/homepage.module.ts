import { Module } from '@nestjs/common';
import { HomepageController } from './homepage.controller';
import { HomepageService } from './homepage.service';
import { HeroSlidesController } from './hero-slides.controller';
import { HeroSlidesService } from './hero-slides.service';

@Module({
  controllers: [HomepageController, HeroSlidesController],
  providers: [HomepageService, HeroSlidesService],
  exports: [HomepageService, HeroSlidesService],
})
export class HomepageModule {}