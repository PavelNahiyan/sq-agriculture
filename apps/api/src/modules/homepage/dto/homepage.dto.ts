import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class HeroSlideDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class SliderCategoryDto {
  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsNumber()
  order: number;
}

export class FeatureDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class VideoUrlDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;
}

export class StatDto {
  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsString()
  label: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  suffix?: string;
}

export class UpdateHomepageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heroTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heroSubtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeroSlideDto)
  heroSlides?: HeroSlideDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  heroUseCategories?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SliderCategoryDto)
  sliderCategories?: SliderCategoryDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  features?: FeatureDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  videoEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoSubtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoPlaylistId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VideoUrlDto)
  videoUrls?: VideoUrlDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatDto)
  stats?: StatDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaSubtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaButtonText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaButtonLink?: string;
}