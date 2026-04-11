import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToWishlistDto {
  @IsString()
  @ApiProperty()
  productId: string;
}
