import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateServiceSettingsDto {
  // Contact Info
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  hotlinePhone?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  isActive?: boolean;

  // Hero Section
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  heroTitle?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  heroTitleBn?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  heroSubtitle?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  heroSubtitleBn?: string;

  // SQ Lubricants Section
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  lubricantsTitle?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  lubricantsTitleBn?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  lubricantsDescription?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  lubricantsDescriptionBn?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  lubricantsEnabled?: boolean;

  // Spare Parts Section
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  sparePartsTitle?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  sparePartsTitleBn?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  sparePartsDescription?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  sparePartsDescriptionBn?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  sparePartsEnabled?: boolean;

  // Service 24X7 Section
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  serviceTitle?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  serviceTitleBn?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  serviceDescription?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  serviceDescriptionBn?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  serviceEnabled?: boolean;

  // JSON Fields
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  serviceFeatures?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  serviceCenters?: string;
}
