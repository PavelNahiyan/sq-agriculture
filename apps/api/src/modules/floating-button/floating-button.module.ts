import { Module } from '@nestjs/common';
import { FloatingButtonController } from './floating-button.controller';
import { FloatingButtonService } from './floating-button.service';

@Module({
  controllers: [FloatingButtonController],
  providers: [FloatingButtonService],
  exports: [FloatingButtonService],
})
export class FloatingButtonModule {}