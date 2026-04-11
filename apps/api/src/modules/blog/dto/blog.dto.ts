import {
  IsString,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsArray,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBlogPostDto {
  @IsString()
  @MaxLength(300)
  @ApiProperty({ maxLength: 300 })
  title: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 300 })
  titleBn?: string;

  @IsString()
  @MaxLength(300)
  @ApiProperty({ maxLength: 300 })
  slug: string;

  @IsString()
  @MaxLength(1000)
  @ApiProperty({ maxLength: 1000 })
  excerpt: string;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 1000 })
  excerptBn?: string;

  @IsString()
  @ApiProperty()
  content: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  contentBn?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  image?: string;

  @IsString()
  @MaxLength(200)
  @ApiProperty({ maxLength: 200 })
  author: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  authorImage?: string;

  @IsString()
  @MaxLength(100)
  @ApiProperty({ maxLength: 100 })
  category: string;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [String] })
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ default: false })
  published?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ default: false })
  featured?: boolean;
}

export class UpdateBlogPostDto {
  @IsString()
  @MaxLength(300)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 300 })
  title?: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 300 })
  titleBn?: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 300 })
  slug?: string;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 1000 })
  excerpt?: string;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 1000 })
  excerptBn?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  content?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  contentBn?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  image?: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 200 })
  author?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  authorImage?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiPropertyOptional({ maxLength: 100 })
  category?: string;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [String] })
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  published?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  featured?: boolean;
}

export class BlogQueryDto {
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
  category?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  search?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional()
  featured?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional()
  published?: boolean;
}
