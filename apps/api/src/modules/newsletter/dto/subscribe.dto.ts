import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscribeDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;
}
