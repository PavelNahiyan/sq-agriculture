import {
  IsString,
  MaxLength,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsInt,
  Min,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDealerDto {
  @IsString()
  @MaxLength(200)
  @ApiProperty({ maxLength: 200 })
  name: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 200 })
  nameBn?: string;

  @IsString()
  @MaxLength(20)
  @ApiProperty({ maxLength: 20 })
  phone: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MaxLength(500)
  @ApiProperty({ maxLength: 500 })
  address: string;

  @IsString()
  @MaxLength(100)
  @ApiProperty({ maxLength: 100 })
  district: string;

  @IsString()
  @MaxLength(100)
  @ApiProperty({ maxLength: 100 })
  division: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  image?: string;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 1000 })
  description?: string;
}

export class UpdateDealerDto {
  @IsString()
  @MaxLength(200)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 200 })
  name?: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 200 })
  nameBn?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 20 })
  phone?: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 500 })
  address?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 100 })
  district?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 100 })
  division?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  image?: string;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 1000 })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  isActive?: boolean;
}

export class DealerQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ default: 1 })
  page?: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ default: 20 })
  limit?: number = 20;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  district?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  division?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  search?: string;
}
