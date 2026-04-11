import {
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
  IsArray,
  IsNumber,
  IsObject,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CategoryType, CategoryTypeType, ProductUnit, ProductUnitType } from '@/common/constants';

export class CreateProductDto {
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
  @MaxLength(200)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 200 })
  slug?: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  descriptionBn?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  price?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  priceUnit?: ProductUnitType;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [String] })
  images?: string[];

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional()
  specs?: Record<string, any>;

  @IsUUID()
  @ApiProperty()
  categoryId: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ default: false })
  featured?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ default: true })
  inStock?: boolean;
}

export class UpdateProductDto {
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
  @MaxLength(200)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 200 })
  slug?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  descriptionBn?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  price?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  priceUnit?: ProductUnitType;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [String] })
  images?: string[];

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional()
  specs?: Record<string, any>;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  categoryId?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  featured?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  inStock?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  isActive?: boolean;
}

export class ProductQueryDto {
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
  @ApiPropertyOptional()
  search?: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  categoryType?: CategoryTypeType;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional()
  featured?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional()
  inStock?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  maxPrice?: number;
}

// Response DTOs
export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  nameBn?: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  descriptionBn?: string;

  @ApiPropertyOptional()
  price?: any;

  @ApiPropertyOptional({ type: 'string' })
  priceUnit?: ProductUnitType;

  @ApiPropertyOptional({ type: [String] })
  images?: string[];

  @ApiPropertyOptional()
  specs?: Record<string, any>;

  @ApiProperty()
  featured: boolean;

  @ApiProperty()
  inStock: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  category: {
    id: string;
    name: string;
    slug: string;
    type: CategoryTypeType;
  };
}
