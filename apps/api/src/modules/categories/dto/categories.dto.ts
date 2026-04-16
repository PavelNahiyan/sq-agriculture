import {
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CategoryTypeType } from '@/common/constants';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(100)
  @ApiProperty({ maxLength: 100 })
  name: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 100 })
  nameBn?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 100 })
  slug?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 500 })
  description?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 500 })
  descriptionBn?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  image?: string;

  @IsString()
  @ApiProperty({ type: 'string' })
  type: CategoryTypeType;

  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional({ default: 0 })
  sortOrder?: number;
}

export class UpdateCategoryDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 100 })
  name?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 100 })
  nameBn?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 100 })
  slug?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 500 })
  description?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 500 })
  descriptionBn?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  image?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  type?: CategoryTypeType;

  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  isActive?: boolean;
}

export class CategoryQueryDto {
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
  @ApiPropertyOptional({ default: 10 })
  limit?: number = 10;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  type?: CategoryTypeType;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional()
  isActive?: boolean;
}

// Response DTOs
export class CategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  nameBn?: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  descriptionBn?: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiProperty({ type: 'string' })
  type: CategoryTypeType;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  productCount?: number;
}
